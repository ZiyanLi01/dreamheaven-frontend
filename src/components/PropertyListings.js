import React, { useState, useEffect } from 'react';
import { Bed, Bath, Ruler, Car, MapPin } from 'lucide-react';

const PropertyCard = ({ property }) => {
  // Helper function to format address
  const formatAddress = () => {
    if (property.address) {
      return property.address;
    }
    
    const parts = [];
    if (property.city) parts.push(property.city);
    if (property.state) parts.push(property.state);
    if (property.zipcode) parts.push(property.zipcode);
    
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  };

  // Helper function to get property title
  const getPropertyTitle = () => {
    if (property.title) {
      return property.title;
    }
    // Extract title from address
    if (property.address) {
      const addressParts = property.address.split(',');
      return addressParts[0] || 'Property';
    }
    return 'Property';
  };



  // Helper function to get location (city, state)
  const getLocation = () => {
    if (property.city && property.state) {
      return `${property.city}, ${property.state}`;
    }
    if (property.city) {
      return property.city;
    }
    return 'Location not available';
  };

  // Helper function to get image URL with fallback
  const getImageUrl = () => {
    if (property.images && property.images.length > 0) {
      return property.images[0];
    }
    // Fallback placeholder image
    return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop';
  };

  // Helper function to format price
  const formatPrice = () => {
    // Use the correct backend field names
    const priceForSale = property.price_for_sale || 0;
    const pricePerMonth = property.price_per_month || 0;
    const pricePerNight = property.price_per_night || 0;
    const propertyListingType = property.property_listing_type || '';
    
    // Check if property is for rent
    const isForRent = propertyListingType === 'rent';
    
    // Check if property is for sale
    const isForSale = propertyListingType === 'sale';
    
    // Check if property is both (rent and sale)
    const isBoth = propertyListingType === 'both';
    
    if (isForRent || isBoth) {
      // For rent or both: show monthly price
      const rentPrice = pricePerMonth || pricePerNight * 30; // Convert nightly to monthly if needed
      return `$${rentPrice.toLocaleString()}/month`;
    } else if (isForSale) {
      // For sale only: show direct price
      return `$${priceForSale.toLocaleString()}`;
    } else {
      // Default fallback - assume it's for sale
      return `$${priceForSale.toLocaleString()}`;
    }
  };

  // Helper function to get status
  const getStatus = () => {
    const propertyListingType = property.property_listing_type || '';
    
    if (propertyListingType === 'rent') {
      return 'For Rent';
    }
    if (propertyListingType === 'sale') {
      return 'For Sale';
    }
    if (propertyListingType === 'both') {
      return 'For Rent';
    }
    return 'For Sale'; // Default fallback
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Property Image */}
      <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200">
        {getImageUrl() && (
          <img 
            src={getImageUrl()} 
            alt={formatAddress()}
            className="w-full h-full object-cover"
          />
        )}
        
        {/* Status Badge - Top Right */}
        <div className="absolute top-3 right-3">
          <span className="bg-dream-blue-800 text-white text-xs px-2 py-1 rounded font-medium">
            {getStatus()}
          </span>
        </div>
        

      </div>

      {/* Property Details */}
      <div className="p-4 space-y-4">
        {/* Address and Location */}
        <div>
          <h3 className="font-bold text-dream-gray-800 text-lg mb-1 truncate">
            {formatAddress()}
          </h3>
          <div className="flex items-center space-x-1 text-sm text-dream-gray-500">
            <MapPin className="w-3 h-3" />
            <span className="truncate">{getLocation()}</span>
          </div>
        </div>

        {/* Key Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <Ruler className="w-4 h-4 text-dream-gray-400" />
            <span className="text-dream-gray-600">
              {property.square_feet || 'N/A'} Square Feet
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Car className="w-4 h-4 text-dream-gray-400" />
            <span className="text-dream-gray-600">{property.garage_number || 0} Garage</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bed className="w-4 h-4 text-dream-gray-400" />
            <span className="text-dream-gray-600">{property.bedrooms || 0} Bedrooms</span>
          </div>
          <div className="flex items-center space-x-2">
            <Bath className="w-4 h-4 text-dream-gray-400" />
            <span className="text-dream-gray-600">{property.bathrooms || 0} Bathrooms</span>
          </div>
        </div>

        {/* Price */}
        <div className="bg-dream-blue-600 text-white text-center py-3 rounded-lg font-bold text-lg">
          {formatPrice()}
        </div>
      </div>
    </div>
  );
};

const PropertyListings = ({ initialFilters = {} }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    bedrooms: '',
    bathrooms: '',
    status: '',
    ...initialFilters
  });

  const fetchProperties = async (pageNum = 1, append = false) => {
    setLoading(true);
    setError(null);
    
    try {
      // Convert filters to query parameters for GET request (same as SearchSection)
      const queryParams = new URLSearchParams();
      
      // Add pagination
      queryParams.append('page', pageNum.toString());
      queryParams.append('limit', '20');
      
      // Add filters to query parameters
      if (filters.location) {
        // Extract city and state from location (same logic as SearchSection)
        const locationParts = filters.location.split(', ');
        if (locationParts.length >= 2) {
          queryParams.append('city', locationParts[0]);
          queryParams.append('state', locationParts[1]);
        } else {
          queryParams.append('q', filters.location);
        }
      }
      
      if (filters.status && filters.status !== 'Both') {
        queryParams.append('property_type', filters.status);
      }
      
      if (filters.bedrooms && filters.bedrooms !== 'Any') {
        const minBeds = filters.bedrooms.toString().replace('+', '');
        queryParams.append('min_bedrooms', minBeds);
      }
      
      if (filters.bathrooms && filters.bathrooms !== 'Any') {
        const minBaths = filters.bathrooms.toString().replace('+', '');
        queryParams.append('min_bathrooms', minBaths);
      }

      // Use the correct backend endpoint - POST /api/search
      const payload = {
        page: pageNum,
        limit: 20
      };

      // Add filters to payload
      if (filters.location) {
        payload.location = filters.location;
      }
      if (filters.bedrooms) {
        payload.bed = filters.bedrooms + '+';
      }
      if (filters.bathrooms) {
        payload.bath = filters.bathrooms + '+';
      }
      if (filters.status) {
        payload.rent = filters.status;
      }
      
      // Use proxy configuration to avoid CORS issues
      const fullUrl = `/api/search/`;
      
      console.log('Making API request to:', fullUrl);
      console.log('Request payload:', payload);
      
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Debug logging to see the API response
      console.log('API Response:', data);
      
      // Handle the new backend response structure: { uuid1: listing1, uuid2: listing2, ... }
      let listings = [];
      
      if (data?.results && typeof data.results === 'object') {
        // Convert object to array and add the UUID as the id field
        listings = Object.entries(data.results).map(([uuid, listing]) => ({
          ...listing,
          id: uuid // Ensure each listing has the UUID as its id
        }));
      } else if (data?.properties && Array.isArray(data.properties)) {
        // Fallback for old array structure
        listings = data.properties;
      } else if (data?.results && Array.isArray(data.results)) {
        // Fallback for old array structure
        listings = data.results;
      }
      
      const hasMore = data?.has_more || false;
      
      console.log('Total listings found:', listings.length);
      console.log('First listing:', listings[0]);
      console.log('First listing keys:', Object.keys(listings[0] || {}));
      
      if (append) {
        setProperties(prev => [...prev, ...listings]);
      } else {
        setProperties(listings);
      }
      
      setHasMore(hasMore);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to fetch properties. Please try again.');
      console.error('Error fetching properties:', err);
      // Set empty arrays on error to prevent undefined errors
      if (!append) {
        setProperties([]);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(1, false);
  }, []); // Fetch on initial load only

  // Handle external filter changes
  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...initialFilters }));
      fetchProperties(1, false);
    }
  }, [initialFilters]);

  const handleLoadMore = () => {
    fetchProperties(page + 1, true);
  };

  // Function to trigger search when filters change (can be called from parent component)
  const searchWithFilters = (newFilters) => {
    setFilters(newFilters);
    fetchProperties(1, false);
  };

  return (
    <section id="property-listings" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-dream-gray-800">
            We Bring Dream Homes To Reality
          </h2>
        </div>



        {/* Loading State */}
        {loading && (!properties || properties.length === 0) && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dream-blue-600 mx-auto"></div>
            <p className="mt-4 text-dream-gray-600">Loading properties...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchProperties(1, false)}
              className="bg-dream-blue-600 text-white px-6 py-2 rounded-md hover:bg-dream-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Property Grid */}
        {properties && properties.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
            
            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="bg-dream-blue-600 text-white px-8 py-3 rounded-md hover:bg-dream-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Properties'}
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!loading && !error && (!properties || properties.length === 0) && (
          <div className="text-center py-12">
            <p className="text-dream-gray-600 text-lg">No properties found matching your criteria.</p>
            <button
              onClick={() => {
                setFilters({
                  location: '',
                  bedrooms: '',
                  bathrooms: '',
                  status: ''
                });
              }}
              className="mt-4 bg-dream-blue-600 text-white px-6 py-2 rounded-md hover:bg-dream-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyListings; 