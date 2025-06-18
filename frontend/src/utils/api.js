const API_BASE_URL = 'http://localhost:8000/api/v1';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Helper function to handle authentication errors
const handleAuthError = (error) => {
  if (error.message.includes('401') || error.message.includes('not authenticated')) {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userEmail');
    window.location.href = '/'; // Redirect to login
  }
  throw error;
};

export const createUserProfile = async (formData) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to create a profile. Please sign in with Google first.');
    }

    const response = await fetch(`${API_BASE_URL}/profiles/`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(formData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      }
      
      if (response.status === 403) {
        throw new Error('You do not have permission to create a profile.');
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleAuthError(error);
  }
};

// Added: Function to call the Google login endpoint
export const signInWithGoogle = async (idToken) => {
  const response = await fetch(`${API_BASE_URL}/auth/google-login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id_token: idToken }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({})); // Try to parse error, default to empty obj
    throw new Error(errorData.detail || `Google Sign-In failed: ${response.status}`);
  }

  return await response.json(); // This should be your app's token (access_token, etc.)
};


// Add more API functions as needed
export const getUserProfile = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
    headers: getAuthHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

export const updateUserProfile = async (userId, formData) => {
  const response = await fetch(`${API_BASE_URL}/profiles/${userId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }

  return await response.json();
};

export const getCurrentUserId = () => {
  return localStorage.getItem('userId');
};

export const getCurrentUserProfile = async () => {
  const userId = getCurrentUserId();
  if (!userId) throw new Error('No userId found');
  return getUserProfile(userId);
};

// Workflow API functions
export const createWorkflow = async (profileId, workflowData = {}) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to create a workflow. Please sign in with Google first.');
    }

    // Validate required fields
    if (!workflowData.budget) {
      throw new Error('Budget is required to create a workflow');
    }

    // Default date range if not provided
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const defaultWorkflowData = {
      profile_id: profileId,
      start_date: workflowData.start_date || today.toISOString().split('T')[0], // YYYY-MM-DD format
      end_date: workflowData.end_date || nextWeek.toISOString().split('T')[0], // YYYY-MM-DD format
      budget: workflowData.budget, // Budget is now required, no default
      ...workflowData // Allow overriding defaults
    };

    const response = await fetch(`${API_BASE_URL}/workflows`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(defaultWorkflowData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleAuthError(error);
  }
};

export const executeWorkflow = async (workflowId) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to execute a workflow. Please sign in with Google first.');
    }

    const response = await fetch(`${API_BASE_URL}/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: getAuthHeaders(),
      // No body needed - the endpoint gets the workflow info from the workflow_id
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleAuthError(error);
  }
};

export const createWorkflowWebSocketConnection = (sessionId) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const wsUrl = `ws://localhost:8000/api/v1/ws/workflow/${sessionId}?token=${token}`;
  return new WebSocket(wsUrl);
};

// Combined function to create profile and start workflow
export const createProfileAndStartWorkflow = async (formData) => {
  try {
    // Step 1: Create the profile
    const profileResult = await createUserProfile(formData);
    console.log('Profile created successfully:', profileResult);
    
    // Step 2: Create workflow with budget from form data
    const workflowData = {
      budget: formData.budget, // Now correctly gets budget from Weekly Budget (₩) field
      start_date: formData.start_date,
      end_date: formData.end_date
    };
    console.log('Creating workflow with budget:', formData.budget, 'Full workflow data:', workflowData);
    const workflowResult = await createWorkflow(profileResult.id, workflowData);
    console.log('Workflow created successfully:', workflowResult);
    
    // Step 3: Execute workflow
    const executionResult = await executeWorkflow(workflowResult.id);
    console.log('Workflow execution started:', executionResult);
    
    return {
      profile: profileResult,
      workflow: workflowResult,
      execution: executionResult
    };
  } catch (error) {
    console.error('Error in workflow process:', error);
    throw error;
  }
};

// Image upload API functions
export const uploadRecipeImage = async (imageFile, folder = 'recipe-images', resize = true, makePublic = true) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to upload images. Please sign in with Google first.');
    }

    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('folder', folder);
    formData.append('resize', resize.toString());
    formData.append('make_public', makePublic.toString());

    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}/images/upload`, {
      method: 'POST',
      headers: {
        ...(token && { 'Authorization': `Bearer ${token}` }),
        // Don't set Content-Type header for FormData, let browser set it
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      }
      
      if (response.status === 413) {
        throw new Error('Image file is too large. Please choose a smaller image.');
      }
      
      if (response.status === 415) {
        throw new Error('Unsupported image format. Please use JPEG, PNG, GIF, or WebP.');
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleAuthError(error);
  }
};

export const deleteRecipeImage = async (blobName) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to delete images. Please sign in with Google first.');
    }

    const response = await fetch(`${API_BASE_URL}/images/delete/${encodeURIComponent(blobName)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      }
      
      if (response.status === 403) {
        throw new Error('You can only delete your own images.');
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleAuthError(error);
  }
};

export const getImageUrl = async (blobName, signed = false, expiration = 3600) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to get image URLs. Please sign in with Google first.');
    }

    const params = new URLSearchParams({
      signed: signed.toString(),
      expiration: expiration.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/images/url/${encodeURIComponent(blobName)}?${params}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleAuthError(error);
  }
};

// Advanced workflow creation with custom parameters
export const createCustomWorkflow = async (profileId, options = {}) => {
  const {
    startDate = null,
    endDate = null,
    budget, // No default - let the caller decide
    durationDays = 7
  } = options;

  // Validate required budget
  if (!budget || budget <= 0) {
    throw new Error('Budget is required and must be greater than 0');
  }

  // Calculate dates if not provided
  const today = new Date();
  const calculatedStartDate = startDate ? new Date(startDate) : today;
  const calculatedEndDate = endDate ? new Date(endDate) : new Date(calculatedStartDate.getTime() + (durationDays * 24 * 60 * 60 * 1000));

  const workflowData = {
    start_date: calculatedStartDate.toISOString().split('T')[0],
    end_date: calculatedEndDate.toISOString().split('T')[0],
    budget: parseFloat(budget)
  };

  return createWorkflow(profileId, workflowData);
};

// Check if user has any profiles
export const checkUserHasProfile = async () => {
  try {
    if (!isAuthenticated()) {
      return false;
    }

    const response = await fetch(`${API_BASE_URL}/profiles/`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleAuthError(new Error('401'));
      }
      return false;
    }

    const profiles = await response.json();
    return profiles && profiles.length > 0;
  } catch (error) {
    console.error('Error checking user profiles:', error);
    return false;
  }
};
