const API_BASE_URL = 'http://localhost:8000/api/v1';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  console.log('Getting auth headers, token present:', !!token);
  if (token) {
    console.log('Token preview:', token.substring(0, 20) + '...');
  }
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('authToken');
};

// Debug function to check authentication state
export const debugAuthState = () => {
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  
  console.log('=== AUTHENTICATION DEBUG ===');
  console.log('Token exists:', !!token);
  console.log('Token preview:', token ? token.substring(0, 20) + '...' : 'null');
  console.log('User ID:', userId);
  console.log('User Email:', userEmail);
  console.log('isAuthenticated():', isAuthenticated());
  console.log('============================');
  
  return {
    hasToken: !!token,
    tokenPreview: token ? token.substring(0, 20) + '...' : null,
    userId,
    userEmail,
    isAuthenticated: isAuthenticated()
  };
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

export const executeWorkflow = async (workflowId, profileId) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to execute a workflow. Please sign in with Google first.');
    }

    const response = await fetch(`${API_BASE_URL}/workflows/${workflowId}/execute`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        profile_id: profileId
      })
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
    const executionResult = await executeWorkflow(workflowResult.id, profileResult.id);
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
      console.log('Not authenticated - no token found');
      return false;
    }

    console.log('Making request to check user profiles...');
    const headers = getAuthHeaders();
    console.log('Request headers:', headers);

    const response = await fetch(`${API_BASE_URL}/profiles/`, {
      method: 'GET',
      headers: headers,
    });

    console.log('Profile check response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('Profile check error response:', errorText);
      
      if (response.status === 401) {
        console.log('401 error - handling auth error');
        handleAuthError(new Error('401'));
      }
      return false;
    }

    const profiles = await response.json();
    console.log('Profiles response:', profiles);
    return profiles && profiles.length > 0;
  } catch (error) {
    console.error('Error checking user profiles:', error);
    return false;
  }
};

// Create and execute workflow for existing profile
export const createWorkflowForExistingProfile = async (profileId, workflowData) => {
  try {
    console.log('Creating workflow for existing profile:', profileId, 'with data:', workflowData);
    
    // Step 1: Create workflow
    const workflowResult = await createWorkflow(profileId, workflowData);
    console.log('Workflow created successfully:', workflowResult);
    
    // Step 2: Execute workflow
    const executionResult = await executeWorkflow(workflowResult.id, profileId);
    console.log('Workflow execution started:', executionResult);
    
    return {
      profile_id: profileId,
      workflow: workflowResult,
      execution: executionResult
    };
  } catch (error) {
    console.error('Error creating workflow for existing profile:', error);
    throw error;
  }
};

// Get all workflows for a user (optionally filtered by profile)
export const getUserWorkflows = async (profileId = null) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to get workflows. Please sign in with Google first.');
    }

    const params = new URLSearchParams();
    if (profileId) {
      params.append('profile_id', profileId);
    }

    const response = await fetch(`${API_BASE_URL}/workflows?${params}`, {
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

// Get a specific workflow with its meal plans
export const getWorkflowWithMealPlans = async (workflowId) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to get workflow details. Please sign in with Google first.');
    }

    const response = await fetch(`${API_BASE_URL}/workflows/${workflowId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      }
      
      if (response.status === 404) {
        throw new Error('Workflow not found or you do not have access to it.');
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleAuthError(error);
  }
};

// Get user profiles
export const getUserProfiles = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to get profiles. Please sign in with Google first.');
    }

    console.log('getUserProfiles: Making request to get user profiles...');
    const headers = getAuthHeaders();
    console.log('getUserProfiles: Request headers:', headers);

    const response = await fetch(`${API_BASE_URL}/profiles/`, {
      method: 'GET',
      headers: headers,
    });

    console.log('getUserProfiles: Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.log('getUserProfiles: Error response:', errorText);
      
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        console.log('Failed to parse error response as JSON');
      }
      
      if (response.status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const profiles = await response.json();
    console.log('getUserProfiles: Success response:', profiles);
    return profiles;
  } catch (error) {
    console.error('getUserProfiles: Error:', error);
    return handleAuthError(error);
  }
};

// Upload meal plan image
export const uploadMealPlanImage = async (mealPlanId, imageFile) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to upload images. Please sign in with Google first.');
    }

    if (!imageFile) {
      throw new Error('Image file is required');
    }

    const formData = new FormData();
    formData.append('meal_plan_id', mealPlanId);
    formData.append('image', imageFile);

    const response = await fetch(`${API_BASE_URL}/meal-plans/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        // Don't set Content-Type header - let the browser set it for FormData
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      }
      
      if (response.status === 404) {
        throw new Error('Meal plan not found or you do not have access to it.');
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    return handleAuthError(error);
  }
};

// Get latest workflow for a user's latest profile
export const getLatestUserWorkflow = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to get workflows. Please sign in with Google first.');
    }

    // Get user profiles first
    const profiles = await getUserProfiles();
    if (!profiles || profiles.length === 0) {
      return null;
    }

    // Get the latest profile (assuming they're ordered by creation date)
    const latestProfile = profiles[profiles.length - 1];
    
    // Get workflows for this profile
    const workflows = await getUserWorkflows(latestProfile.id);
    if (!workflows || workflows.length === 0) {
      return null;
    }

    // Return the latest workflow (assuming they're ordered by creation date)
    return workflows[workflows.length - 1];
  } catch (error) {
    console.error('Error getting latest user workflow:', error);
    return null;
  }
};
