const API_BASE_URL = "https://cookonomics-backend-g3hype2pca-uc.a.run.app/api/v1";

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

// Debug function to check authentication state
export const debugAuthState = () => {
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  const userEmail = localStorage.getItem('userEmail');
  
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
  const response = await fetch(`${API_BASE_URL}/profiles/${userId}/`, {
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

    const response = await fetch(`${API_BASE_URL}/workflows/`, {
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
  
  const wsUrl = `wss://cookonomics-backend-g3hype2pca-uc.a.run.app/api/v1/ws/workflow/${sessionId}?token=${token}`;
  return new WebSocket(wsUrl);
};

// Combined function to create profile and start workflow
export const createProfileAndStartWorkflow = async (formData) => {
  try {
    // Step 1: Create the profile (excluding workflow-specific fields)
    const { budget, start_date, end_date, ...profileData } = formData;
    const profileResult = await createUserProfile(profileData);
    
    // Step 2: Create workflow with workflow-specific data
    const workflowData = {
      budget: budget, // Budget comes from form data but is not part of profile
      start_date: start_date,
      end_date: end_date
    };
    const workflowResult = await createWorkflow(profileResult.id, workflowData);
    
    // Step 3: Execute workflow
    const executionResult = await executeWorkflow(workflowResult.id, profileResult.id);
    
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

    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/profiles/`, {
      method: 'GET',
      headers: headers,
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

// Create and execute workflow for existing profile
export const createWorkflowForExistingProfile = async (profileId, workflowData) => {
  try {
    // Step 1: Create workflow
    const workflowResult = await createWorkflow(profileId, workflowData);
    
    // Step 2: Execute workflow
    const executionResult = await executeWorkflow(workflowResult.id, profileId);
    
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

    const response = await fetch(`${API_BASE_URL}/workflows/?${params}`, {
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

// Get all workflows with meal plans for a specific profile
export const getAllWorkflowsWithMealPlans = async (profileId = null) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to get workflows. Please sign in with Google first.');
    }

    // First get all workflows for the profile
    const workflows = await getUserWorkflows(profileId);

    if (!workflows || workflows.length === 0) {
      return [];
    }

    // For each workflow, fetch the detailed data including meal plans
    const workflowsWithMealPlans = await Promise.all(
      workflows.map(async (workflow) => {
        try {
          const detailedWorkflow = await getWorkflowWithMealPlans(workflow.id);
          return detailedWorkflow;
        } catch (error) {
          console.error(`Error fetching meal plans for workflow ${workflow.id}:`, error);
          // Return the basic workflow if detailed fetch fails
          return workflow;
        }
      })
    );

    return workflowsWithMealPlans;
  } catch (error) {
    console.error('getAllWorkflowsWithMealPlans: Error:', error);
    return handleAuthError(error);
  }
};

// Get user profiles
export const getUserProfiles = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to get profiles. Please sign in with Google first.');
    }

    const headers = getAuthHeaders();

    const response = await fetch(`${API_BASE_URL}/profiles/`, {
      method: 'GET',
      headers: headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const profiles = await response.json();
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

// Delete user profile
export const deleteUserProfile = async (profileId) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to delete a profile. Please sign in with Google first.');
    }

    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/profiles/${profileId}`, {
      method: 'DELETE',
      headers: headers,
    });


    if (!response.ok) {
      const errorText = await response.text();
      
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
      }
      
      if (response.status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      }
      
      if (response.status === 403) {
        throw new Error('You do not have permission to delete this profile.');
      }
      
      if (response.status === 404) {
        throw new Error('Profile not found.');
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    // Check if response has content (204 No Content means successful deletion)
    if (response.status === 204) {
      return { success: true, message: 'Profile deleted successfully' };
    }
    
    // If there's a response body, parse it
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('deleteUserProfile: Error:', error);
    return handleAuthError(error);
  }
};

// Delete workflow
export const deleteWorkflow = async (workflowId) => {
  try {
    if (!isAuthenticated()) {
      throw new Error('You must be logged in to delete a workflow. Please sign in with Google first.');
    }

    const headers = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/workflows/${workflowId}`, {
      method: 'DELETE',
      headers: headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      let errorData = {};
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        // Error text couldn't be parsed as JSON
      }
      
      if (response.status === 401) {
        throw new Error('Your session has expired. Please sign in again.');
      }
      
      if (response.status === 403) {
        throw new Error('You do not have permission to delete this workflow.');
      }
      
      if (response.status === 404) {
        throw new Error('Workflow not found.');
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    // Check if response has content (204 No Content means successful deletion)
    if (response.status === 204) {
      return { success: true, message: 'Workflow deleted successfully' };
    }
    
    // If there's a response body, parse it
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('deleteWorkflow: Error:', error);
    return handleAuthError(error);
  }
};