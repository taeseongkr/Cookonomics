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
