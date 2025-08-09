import React, { useState } from 'react';
import { Bed, Bath, Ruler, Car, MapPin, Sparkles } from 'lucide-react';
import { aiSearchProperties } from '../services/api';

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
    const priceForSale = Math.round(property.price_for_sale || 0);
    const pricePerMonth = Math.round(property.price_per_month || 0);
    const pricePerNight = Math.round(property.price_per_night || 0);
    const propertyListingType = property.property_listing_type || '';
    
    // Check if property is for rent
    const isForRent = propertyListingType === 'rent';
    
    // Check if property is for sale
    const isForSale = propertyListingType === 'sale';
    
    // Check if property is both (rent and sale)
    const isBoth = propertyListingType === 'both';
    
    if (isForRent || isBoth) {
      // For rent or both: show monthly price
      const rentPrice = pricePerMonth || Math.round(pricePerNight * 30); // Convert nightly to monthly if needed
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

const AiSearchResults = ({ searchResults, searchQuery, onClearSearch }) => {
  const [allProperties, setAllProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize properties from first search results
  React.useEffect(() => {
    if (searchResults && searchResults.results) {
      // Convert results object to array
      const properties = Object.entries(searchResults.results).map(([uuid, listing]) => ({
        ...listing,
        id: uuid
      }));
      
      setAllProperties(properties);
      setHasMore(searchResults.has_more || false);
      setCurrentPage(1);
    }
  }, [searchResults]);

  // Reset state when search query changes
  React.useEffect(() => {
    setAllProperties([]);
    setCurrentPage(1);
    setHasMore(false);
  }, [searchQuery]);

  const handleLoadMore = async () => {
    setLoading(true);
    try {
      // Load more results
      const results = await aiSearchProperties(searchQuery);
      
      if (results && results.results) {
        // Convert new results to array
        const newProperties = Object.entries(results.results).map(([uuid, listing]) => ({
          ...listing,
          id: uuid
        }));
        
        // Append to existing properties
        setAllProperties(prev => [...prev, ...newProperties]);
        setHasMore(results.has_more || false);
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading more AI search results:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!searchResults || !searchResults.results) {
    return null;
  }

  return (
    <section id="ai-search-results" className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl lg:text-4xl font-bold text-dream-gray-800">
              AI Search Results
            </h2>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-dream-gray-600 mb-4">
            Found {allProperties.length} properties matching: "{searchQuery}"
            {hasMore && <span className="text-dream-blue-600"> (more available)</span>}
          </p>
          <button
            onClick={onClearSearch}
            className="text-dream-blue-600 hover:text-dream-blue-700 underline"
          >
            Clear search and show all properties
          </button>
        </div>

        {/* AI Results Grid - 2 columns layout */}
        <div className="space-y-8">
          {allProperties.map((property, index) => (
            <div 
              key={property.id} 
              className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-purple-100"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                {/* Left Column - Property Card */}
                <div>
                  <PropertyCard property={property} />
                </div>
                
                {/* Right Column - AI Recommendation */}
                <div className="flex flex-col justify-center">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <h3 className="text-lg font-semibold text-dream-gray-800">
                        Why We Recommend This Property
                      </h3>
                    </div>
                    
                    {/* Placeholder for AI recommendation text */}
                    <div className="bg-white rounded-lg p-4 border border-purple-200">
                      <p className="text-dream-gray-600 leading-relaxed">
                        This property matches your search criteria perfectly. Based on your query "{searchQuery}", 
                        this listing offers excellent value and features that align with your requirements. 
                        The location, amenities, and property characteristics make it an ideal choice for your needs.
                      </p>
                      
                      {/* Recommendation score placeholder */}
                      <div className="mt-4 flex items-center space-x-2">
                        <span className="text-sm font-medium text-dream-gray-700">Match Score:</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${95 - index * 5}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-purple-600">{95 - index * 5}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Loading more...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Load 5 More Properties</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* No Results */}
        {allProperties.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-dream-gray-600 text-lg">No properties found matching your AI search.</p>
            <button
              onClick={onClearSearch}
              className="mt-4 bg-dream-blue-600 text-white px-6 py-2 rounded-md hover:bg-dream-blue-700 transition-colors"
            >
              Clear search and show all properties
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default AiSearchResults;
