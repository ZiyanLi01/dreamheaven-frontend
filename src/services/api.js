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

    const response = await fetch(`${API_BASE_URL}/search/`, {
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
    const response = await fetch(`${API_BASE_URL}/search/ai-search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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