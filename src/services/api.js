// API service for Dream Haven backend communication

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const searchProperties = async (searchData) => {
  try {
    // Clean up the search data for POST request
    const cleanSearchData = { ...searchData };
    
    // Remove empty values
    Object.keys(cleanSearchData).forEach(key => {
      if (!cleanSearchData[key] || cleanSearchData[key] === 'Any' || cleanSearchData[key] === 'Both') {
        delete cleanSearchData[key];
      }
    });

    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchData)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching properties:', error);
    throw error;
  }
};

export const getProperties = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/listings/?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

export const getPropertyById = async (propertyId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/listings/${propertyId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching property:', error);
    throw error;
  }
};

export const aiSearchProperties = async (query) => {
  try {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/search/ai-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error performing AI search:', error);
    throw error;
  }
};

// Authentication functions
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (token) {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
    }
  } catch (error) {
    console.error('Error logging out:', error);
  } finally {
    // Clear local storage regardless of API call success
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Example search data structure that will be sent to backend:
/*
{
  location: "Beverly Hills, CA",
  rent: "For Sale",
  bed: "3+",
  bath: "2+",
  searchQuery: "modern house with pool",
  sortBy: "price",
  sortOrder: "asc"
}
*/ 