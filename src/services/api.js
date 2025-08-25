// API service for Dream Haven backend communication

// Main Backend (Port 8080) - for regular search, authentication, property listings
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

// AI/RAG Backend (Port 8001) - for AI search functionality
const AI_BASE_URL = process.env.REACT_APP_AI_API_URL || 'http://localhost:8001';

/*
Environment Variables Configuration:
Create a .env file in your project root with:

REACT_APP_API_URL=http://localhost:8000
REACT_APP_AI_API_URL=http://localhost:8001

This allows you to easily switch between different backend environments.
*/

export const searchProperties = async (searchData) => {
  try {
    console.log('API - Raw search data received:', searchData);
    console.log('API - Raw search data type:', typeof searchData);
    console.log('API - Raw search data keys:', Object.keys(searchData));
    
    // Clean up the search data for POST request
    const cleanSearchData = { ...searchData };
    
    // Remove empty values and unwanted values
    Object.keys(cleanSearchData).forEach(key => {
      if (!cleanSearchData[key] || cleanSearchData[key] === 'Any' || cleanSearchData[key] === 'Both') {
        delete cleanSearchData[key];
      }
    });

    console.log('API - Cleaned search data being sent to backend:', cleanSearchData);
    console.log('API - Cleaned search data type:', typeof cleanSearchData);
    console.log('API - Cleaned search data keys:', Object.keys(cleanSearchData));
    console.log('API - Making request to:', `${API_BASE_URL}/search/`);

    const response = await fetch(`${API_BASE_URL}/search/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cleanSearchData),
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('API - Backend response received:', result);
    console.log('API - Backend response type:', typeof result);
    console.log('API - Backend response keys:', Object.keys(result));
    return result;
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
    console.log('AI Search - Making request to:', `${AI_BASE_URL}/ai-search`);
    console.log('AI Search - Auth headers:', authHeaders);
    console.log('AI Search - Query:', query);
    console.log('AI Search - Query type:', typeof query);
    console.log('AI Search - Query length:', query ? query.length : 'null/undefined');
    
    const response = await fetch(`${AI_BASE_URL}/ai-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders
      },
      body: JSON.stringify({ 
        query,
        // Add default values to prevent null comparison errors
        page: 1,
        limit: 20,
        // Add explicit null values for common filter parameters
        min_price: null,
        max_price: null,
        min_bedrooms: null,
        min_bathrooms: null,
        property_type: null
      })
    });

    console.log('AI Search - Response status:', response.status);
    console.log('AI Search - Response headers:', response.headers);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Search - Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log('AI Search - Success response:', result);
    console.log('AI Search - Response type:', typeof result);
    console.log('AI Search - Response keys:', Object.keys(result));
    console.log('AI Search - Has results:', !!result.results);
    console.log('AI Search - Has items:', !!result.items);
    console.log('AI Search - Has listings:', !!result.listings);
    console.log('AI Search - Results length:', result.results?.length || result.items?.length || result.listings?.length || 'N/A');
    return result;
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