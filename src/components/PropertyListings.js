import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Bed, Bath, Ruler, Car, MapPin, X } from 'lucide-react';

const PropertyCard = ({ property, onClick }) => {
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
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
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

const PropertyListings = ({ initialFilters = {}, searchResults, searchFilters, onClearSearch }) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [filters, setFilters] = useState({
    location: '',
    bedrooms: '',
    bathrooms: '',
    status: '',
    ...initialFilters
  });
  const hasInitialized = useRef(false);
  const filtersRef = useRef(filters);
  const lastSearchResultsRef = useRef(null);

  // Update filtersRef whenever filters change
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const fetchProperties = useCallback(async (pageNum = 1, append = false) => {
    console.log(`PropertyListings: fetchProperties called with pageNum=${pageNum}, append=${append}`);
    setLoading(true);
    setError(null);
    
    try {
      // Use current filters from ref to avoid dependency issues
      const currentFilters = filtersRef.current;
      
      // Use the correct backend endpoint - POST /search
      const payload = {
        page: pageNum,
        limit: 18 // Show 18 listings (6 rows of 3) for home page
      };

      // Add filters to payload
      if (currentFilters.location) {
        payload.location = currentFilters.location;
      } else if (!searchResults && Object.keys(searchFilters).length === 0) {
        // On home page, automatically fetch San Francisco listings
        payload.location = 'San Francisco, CA';
      }
      if (currentFilters.bedrooms) {
        payload.bed = currentFilters.bedrooms + '+';
      }
      if (currentFilters.bathrooms) {
        payload.bath = currentFilters.bathrooms + '+';
      }
      if (currentFilters.status) {
        payload.rent = currentFilters.status;
      }
      
      // Use proxy configuration to avoid CORS issues
      const fullUrl = `/search`;
      
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
      
      // Get total count and has_more from API response
      const total = data?.total || 0;
      const hasMore = data?.has_more || false;
      
      console.log('Total listings found:', listings.length);
      console.log('Total count from API:', total);
      console.log('Has more:', hasMore);
      
      if (append) {
        setProperties(prev => [...prev, ...listings]);
      } else {
        setProperties(listings);
      }
      
      setTotalCount(total);
      setHasMore(hasMore);
      setPage(pageNum);
    } catch (err) {
      setError('Failed to fetch properties. Please try again.');
      console.error('Error fetching properties:', err);
      // Set empty arrays on error to prevent undefined errors
      if (!append) {
        setProperties([]);
        setTotalCount(0);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, []); // Remove filters dependency to prevent infinite re-renders

  // Consolidated useEffect to handle all data fetching scenarios
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // If we have search results from parent component, use those
    if (searchResults) {
      console.log('PropertyListings: Processing search results from parent');
      
      // Check if we already processed these exact search results
      if (lastSearchResultsRef.current === searchResults) {
        console.log('PropertyListings: Skipping update - same search results already processed');
        return;
      }
      
      // Store the current search results to prevent reprocessing
      lastSearchResultsRef.current = searchResults;
      
      let listings = [];
      
      if (searchResults?.properties && Array.isArray(searchResults.properties)) {
        listings = searchResults.properties;
      } else if (searchResults?.results && Array.isArray(searchResults.results)) {
        listings = searchResults.results;
      } else if (searchResults?.results && typeof searchResults.results === 'object') {
        // Convert object to array and add the UUID as the id field
        listings = Object.entries(searchResults.results).map(([uuid, listing]) => ({
          ...listing,
          id: uuid
        }));
      }
      
      setProperties(listings);
      // Use total from search results if available, otherwise use listings length
      setTotalCount(searchResults.total || listings.length);
      // Use has_more from search results if available
      setHasMore(searchResults.has_more || false);
      setError(null);
      return; // Exit early, don't fetch from API
    } else {
      // Clear search results ref when no search results
      lastSearchResultsRef.current = null;
    }
    
    // If we have initial filters, apply them (only once)
    if (Object.keys(initialFilters).length > 0 && !hasInitialized.current) {
      console.log('PropertyListings: Applying initial filters');
      setFilters(prev => ({ ...prev, ...initialFilters }));
    }
    
    // Only fetch from API once on initial load if we don't have search results
    if (!hasInitialized.current && !searchResults && Object.keys(searchFilters).length === 0) {
      console.log('PropertyListings: Fetching initial San Francisco properties for home page');
      hasInitialized.current = true;
      fetchProperties(1, false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResults, initialFilters]); // Removed searchFilters to prevent infinite loop

  const handleLoadMore = () => {
    if (searchResults && searchResults.has_more) {
      // For search results with pagination, we need to call the parent to load more
      // This would require updating the parent component to handle pagination
      console.log('Load more for search results - pagination not yet implemented');
    } else {
      // For regular API calls
      fetchProperties(page + 1, true);
    }
  };

  // Calculate how many properties to display (always in multiples of 3)
  const getDisplayCount = () => {
    const currentCount = properties.length;
    // Round down to nearest multiple of 3
    return Math.floor(currentCount / 3) * 3;
  };

  const displayCount = getDisplayCount();

  return (
    <section id="property-listings" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-dream-gray-800">
            {searchResults ? 'Search Results' : 'We Bring Dream Homes To Reality'}
          </h2>
          {searchResults ? (
            <div className="mt-4">
              <p className="text-dream-gray-600">
                {searchResults.total ? (
                  `We found ${displayCount} out of ${searchResults.total} listings`
                ) : (
                  `Found ${properties.length} properties`
                )}
                {Object.keys(searchFilters).length > 0 && (
                  <span> matching your criteria</span>
                )}
              </p>
              <button 
                onClick={onClearSearch}
                className="mt-2 text-dream-blue-600 hover:text-dream-blue-700 underline"
              >
                Clear search and show all properties
              </button>
            </div>
          ) : (
            // Only show pagination info if there are filters applied (not on home page)
            Object.keys(searchFilters).length > 0 && (
              <div className="mt-4">
                <p className="text-dream-gray-600">
                  {totalCount > 0 ? (
                    `We found ${displayCount} out of ${totalCount} listings`
                  ) : (
                    'Loading properties...'
                  )}
                </p>
              </div>
            )
          )}
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
              {properties.slice(0, displayCount).map((property) => (
                <PropertyCard key={property.id} property={property} onClick={() => handlePropertyClick(property)} />
              ))}
            </div>
            
            {/* Load More Button - Show for filter results with pagination */}
            {(hasMore || (searchResults && searchResults.has_more)) && Object.keys(searchFilters).length > 0 && (
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

      {/* Property Details Modal */}
      {showPropertyModal && selectedProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Property Details</h2>
              <button
                onClick={() => setShowPropertyModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Property Images */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(() => {
                    const images = selectedProperty.images || [];
                    const imageUrl = selectedProperty.image_url;
                    const allImages = imageUrl ? [imageUrl, ...images] : images;
                    
                    if (allImages.length > 0) {
                      return allImages.slice(0, 4).map((img, index) => (
                        <div key={index} className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src={img} 
                            alt={`Property ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop';
                            }}
                          />
                        </div>
                      ));
                    } else {
                      return (
                        <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                          <img 
                            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop"
                            alt="Property placeholder"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>

              {/* Property Title and Address */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedProperty.title || selectedProperty.address || 'Property Details'}
                </h3>
                <div className="flex items-center space-x-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {selectedProperty.address || 'Address not available'}
                    {selectedProperty.city && selectedProperty.state && (
                      <span className="text-gray-500">
                        , {selectedProperty.city}, {selectedProperty.state}
                      </span>
                    )}
                  </span>
                </div>
              </div>

              {/* Price and Status */}
              <div className="mb-6">
                <div className="bg-dream-blue-600 text-white text-center py-4 rounded-lg font-bold text-xl">
                  {(() => {
                    if (selectedProperty.price) {
                      return `$${Math.round(selectedProperty.price).toLocaleString()}`;
                    }
                    
                    const priceForSale = selectedProperty.price_for_sale || 0;
                    const pricePerMonth = selectedProperty.price_per_month || 0;
                    const pricePerNight = selectedProperty.price_per_night || 0;
                    const propertyListingType = selectedProperty.property_listing_type || '';
                    
                    if (propertyListingType === 'rent' || propertyListingType === 'both') {
                      const rentPrice = pricePerMonth || pricePerNight * 30;
                      return `$${Math.round(rentPrice).toLocaleString()}/month`;
                    } else {
                      return `$${Math.round(priceForSale).toLocaleString()}`;
                    }
                  })()}
                </div>
                <div className="mt-2 text-center">
                  {(() => {
                    const propertyListingType = selectedProperty.property_listing_type || '';
                    if (propertyListingType === 'both') {
                      return (
                        <div className="space-y-2">
                          <div className="flex justify-center space-x-2">
                            <span className="bg-dream-blue-800 text-white text-sm px-3 py-1 rounded-full">
                              For Sale
                            </span>
                            <span className="bg-green-600 text-white text-sm px-3 py-1 rounded-full">
                              For Rent
                            </span>
                          </div>
                          <span className="text-sm text-gray-600 font-medium block">
                            This property is available for both sale and rent
                          </span>
                        </div>
                      );
                    } else {
                      return (
                        <>
                          <span className="bg-dream-blue-800 text-white text-sm px-3 py-1 rounded-full">
                            {propertyListingType === 'rent' ? 'For Rent' : 'For Sale'}
                          </span>
                          <div className="mt-2">
                            <span className="text-sm text-gray-600 font-medium">
                              {propertyListingType === 'rent' 
                                ? 'This property is available for rent' 
                                : 'This property is available for sale'
                              }
                            </span>
                          </div>
                        </>
                      );
                    }
                  })()}
                </div>
              </div>

              {/* Property Details Grid */}
              <div className="space-y-6 mb-6">
                {/* First Row: Bedrooms, Bathrooms, Square Feet */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bed className="w-5 h-5 text-dream-blue-600" />
                      <span className="font-semibold text-gray-800">Bedrooms</span>
                    </div>
                    <span className="text-lg text-gray-600">
                      {selectedProperty.bedrooms !== undefined ? selectedProperty.bedrooms : 'N/A'}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Bath className="w-5 h-5 text-dream-blue-600" />
                      <span className="font-semibold text-gray-800">Bathrooms</span>
                    </div>
                    <span className="text-lg text-gray-600">
                      {selectedProperty.bathrooms !== undefined ? selectedProperty.bathrooms : 'N/A'}
                    </span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Ruler className="w-5 h-5 text-dream-blue-600" />
                      <span className="font-semibold text-gray-800">Square Feet</span>
                    </div>
                    <span className="text-lg text-gray-600">
                      {selectedProperty.square_feet !== undefined ? selectedProperty.square_feet.toLocaleString() : 'N/A'}
                    </span>
                  </div>
                </div>

                {/* Second Row: Garage, Year Built, Year Renovated */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Car className="w-5 h-5 text-dream-blue-600" />
                      <span className="font-semibold text-gray-800">Garage</span>
                    </div>
                    <span className="text-lg text-gray-600">
                      {selectedProperty.garage_number !== undefined ? selectedProperty.garage_number : 'N/A'}
                    </span>
                  </div>

                  {selectedProperty.year_built && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">🏗️</span>
                        <span className="font-semibold text-gray-800">Year Built</span>
                      </div>
                      <span className="text-lg text-gray-600">
                        {selectedProperty.year_built}
                      </span>
                    </div>
                  )}

                  {selectedProperty.year_renovated && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">🔨</span>
                        <span className="font-semibold text-gray-800">Year Renovated</span>
                      </div>
                      <span className="text-lg text-gray-600">
                        {selectedProperty.year_renovated}
                      </span>
                    </div>
                  )}
                </div>

                {/* Third Row: Reviews and Rating */}
                {(selectedProperty.review_count !== undefined || selectedProperty.rating !== undefined) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {selectedProperty.review_count !== undefined && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">⭐</span>
                          <span className="font-semibold text-gray-800">Reviews</span>
                        </div>
                        <span className="text-lg text-gray-600">
                          {selectedProperty.review_count}
                        </span>
                      </div>
                    )}
                    
                    {selectedProperty.rating !== undefined && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg">⭐</span>
                          <span className="font-semibold text-gray-800">Rating</span>
                        </div>
                        <span className="text-lg text-gray-600">
                          {selectedProperty.rating}/5
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedProperty.description && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Description</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedProperty.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {selectedProperty.amenities && selectedProperty.amenities.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Amenities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedProperty.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <span className="text-green-600">✓</span>
                        <span className="text-gray-600">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      )}
      </div>
    </section>
  );
};

export default PropertyListings; 