import React, { useState } from 'react';
import { Search, Sparkles, Lock, X, Bed, Bath, Ruler, Car, MapPin } from 'lucide-react';
import { aiSearchProperties } from '../services/api';

// PropertyCard component (same as in PropertyListings)
const PropertyCard = ({ property }) => {
  // Helper function to format address
  const formatAddress = () => {
    if (property.address) {
      return property.address;
    }
    
    // Handle AI backend title format (extract address from title)
    if (property.title) {
      // Remove location data from title if present
      let cleanTitle = property.title;
      if (property.title.includes('{')) {
        cleanTitle = property.title.replace(/\{.*?\}/, '').trim();
      }
      return cleanTitle;
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
    // Handle AI backend location format (embedded in title)
    if (property.title && property.title.includes('{')) {
      try {
        const locationMatch = property.title.match(/\{.*?\}/);
        if (locationMatch) {
          // Convert single quotes to double quotes for JSON parsing
          let jsonString = locationMatch[0];
          jsonString = jsonString.replace(/'/g, '"');
          
          const locationData = JSON.parse(jsonString);
          if (locationData.name && locationData.state) {
            return `${locationData.name}, ${locationData.state}`;
          }
        }
      } catch (e) {
        console.error('Error parsing location from title:', e);
      }
    }
    
    // Handle regular backend format
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
    if (property.image_url) {
      return property.image_url;
    }
    // Fallback placeholder image
    return 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop';
  };

  // Helper function to format price
  const formatPrice = () => {
    // Handle AI backend price field (just 'price')
    if (property.price) {
      return `$${Math.round(property.price).toLocaleString()}`;
    }
    
    // Use the correct backend field names for main backend
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
              {property.square_feet !== undefined ? property.square_feet : 'N/A'} Square Feet
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Car className="w-4 h-4 text-dream-gray-400" />
            <span className="text-dream-gray-600">
              {property.garage_number !== undefined ? property.garage_number : 'N/A'} Garage
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Bed className="w-4 h-4 text-dream-gray-400" />
            <span className="text-dream-gray-600">
              {property.bedrooms !== undefined ? property.bedrooms : 'N/A'} Bedrooms
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Bath className="w-4 h-4 text-dream-gray-400" />
            <span className="text-dream-gray-600">
              {property.bathrooms !== undefined ? property.bathrooms : 'N/A'} Bathrooms
            </span>
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

const AiSearchSection = ({ user, onLoginRequired, onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showEmptyQueryModal, setShowEmptyQueryModal] = useState(false);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState(null);

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) {
      setShowEmptyQueryModal(true);
      return;
    }

    // Check if user is logged in - AI search requires authentication
    if (!user) {
      // Show custom modal instead of browser alert
      setShowLoginRequiredModal(true);
      return;
    }

    setIsSearching(true);
    try {
      console.log('AI Search query:', searchQuery);
      
      // Call the AI search API
      const results = await aiSearchProperties(searchQuery);
      console.log('AI Search results:', results);
      
      // Debug: Check the structure of individual properties
      if (results.items && results.items.length > 0) {
        console.log('First property structure:', results.items[0]);
        console.log('Properties with reasons:', results.items.filter(p => p.reason).length);
        console.log('Properties without reasons:', results.items.filter(p => !p.reason).length);
      }
      
      // Store results locally for display
      setAiSearchResults(results);
      
      // Note: We're displaying AI results locally, so we don't need to pass to parent
      // This prevents the error of calling regular search API with AI results
      
    } catch (error) {
      console.error('Error performing AI search:', error);
      // Show error message to user
      alert(`AI search failed: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAiSearch();
    }
  };

  return (
    <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="w-6 h-6 text-dream-blue-600" />
            <h2 className="text-2xl lg:text-3xl font-bold text-dream-gray-800">
              AI Natural Language Search
            </h2>
            <Sparkles className="w-6 h-6 text-dream-blue-600" />
          </div>
          <p className="text-dream-gray-600 text-lg">
            Describe your dream home in natural language and let AI find the perfect match
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <div className="space-y-4">

            
            {/* Search Input */}
            <div className="relative">
              <textarea
                placeholder="Describe your dream home... e.g., 'Modern house in San Francisco with big yard, near good schools, bright & quiet, facing south'"
                className="w-full px-6 py-12 pr-24 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-dream-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={4}
                style={{ minHeight: '144px' }}
              />
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={handleAiSearch}
                  disabled={isSearching}
                  className="bg-dream-blue-600 hover:bg-dream-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Searching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Search</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Search Results */}
            {aiSearchResults && (
              <div className="mt-8">
                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      AI Search Results
                    </h3>
                    <button
                      onClick={() => setAiSearchResults(null)}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Clear Results
                    </button>
                  </div>
                  
                  {(aiSearchResults.results || aiSearchResults.items) && (aiSearchResults.results || aiSearchResults.items).length > 0 ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-4">
                        Found {(aiSearchResults.results || aiSearchResults.items).length} properties for: "{aiSearchResults.query}"
                      </p>
                      
                      {/* 10 rows, 2 columns each */}
                      <div className="space-y-6">
                        {(aiSearchResults.results || aiSearchResults.items).slice(0, 10).map((property, index) => (
                          <div key={property.id || index} className="flex gap-6">
                            {/* Left Column - Listing Card (same format as home page) */}
                            <div className="flex-1">
                              <PropertyCard property={property} />
                            </div>
                            
                            {/* Right Column - Similarity Score & Explanation */}
                            <div className="w-80">
                              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                {/* Similarity Score Bar */}
                                <div className="mb-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Similarity Score</span>
                                    <span className="text-sm text-gray-600">
                                      {Math.round((property.similarity_score || 0) * 100)}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-dream-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${(property.similarity_score || 0) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                
                                {/* Explanation Text Box */}
                                <div>
                                  <h5 className="text-sm font-medium text-gray-700 mb-2">Why We Recommend This Property</h5>
                                  <div className="bg-white border border-gray-300 rounded p-3 min-h-[100px]">
                                    {property.reason ? (
                                      <ul className="text-sm text-gray-600 space-y-1">
                                        {property.reason.split('\n').map((bullet, idx) => (
                                          bullet.trim() && (
                                            <li key={idx} className="flex items-start">
                                              <span className="text-dream-blue-600 mr-2 mt-1">•</span>
                                              <span>{bullet.trim()}</span>
                                            </li>
                                          )
                                        ))}
                                      </ul>
                                    ) : (
                                      <div className="text-sm text-gray-600">
                                        <p className="mb-2">This property matches your search criteria based on:</p>
                                        <ul className="space-y-1">
                                          <li className="flex items-start">
                                            <span className="text-dream-blue-600 mr-2 mt-1">•</span>
                                            <span>Location and neighborhood preferences</span>
                                          </li>
                                          <li className="flex items-start">
                                            <span className="text-dream-blue-600 mr-2 mt-1">•</span>
                                            <span>Property features and amenities</span>
                                          </li>
                                          <li className="flex items-start">
                                            <span className="text-dream-blue-600 mr-2 mt-1">•</span>
                                            <span>Price range and value considerations</span>
                                          </li>
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No properties found matching your search.</p>
                      <p className="text-sm text-gray-500 mt-2">Try different keywords or descriptions.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Example Queries */}
            <div className="text-center">
              <p className="text-sm text-dream-gray-500 mb-3">Try these examples:</p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  "Modern apartment with city view",
                  "Family home near good schools",
                  "Quiet neighborhood with garden",
                  "Downtown condo with parking"
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchQuery(example)}
                    className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-dream-gray-700 rounded-full transition-colors duration-200"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-dream-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-dream-blue-600" />
            </div>
            <h3 className="font-semibold text-dream-gray-800 mb-2">AI-Powered</h3>
            <p className="text-sm text-dream-gray-600">Advanced natural language processing to understand your needs</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-dream-gray-800 mb-2">Smart Matching</h3>
            <p className="text-sm text-dream-gray-600">Intelligent property matching based on your preferences</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-dream-gray-800 mb-2">Instant Results</h3>
            <p className="text-sm text-dream-gray-600">Get relevant property suggestions in seconds</p>
          </div>
        </div>
      </div>

      {/* Empty Query Modal */}
      {showEmptyQueryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Enter Your Search Query
              </h2>
              <button
                onClick={() => setShowEmptyQueryModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Please enter a search query to find your dream home. Try describing what you're looking for, such as:
              </p>
              
              <div className="space-y-2 mb-6">
                {[
                  "Modern apartment with city view",
                  "Family home near good schools",
                  "Quiet neighborhood with garden",
                  "Downtown condo with parking",
                  "House with pool and backyard"
                ].map((example, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-dream-blue-600 rounded-full"></div>
                    <span className="text-gray-600 text-sm">"{example}"</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setShowEmptyQueryModal(false)}
                  className="bg-dream-blue-600 text-white px-6 py-2 rounded-md hover:bg-dream-blue-700 transition-colors"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Required Modal */}
      {showLoginRequiredModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Sign In Required
              </h2>
              <button
                onClick={() => setShowLoginRequiredModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <Lock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">AI Search Feature</h3>
                  <p className="text-sm text-gray-600">Our advanced AI search requires authentication</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                To use our AI-powered search feature, you need to sign in to your account. This helps us provide personalized and secure search results.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowLoginRequiredModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowLoginRequiredModal(false);
                    if (onLoginRequired && typeof onLoginRequired === 'function') {
                      onLoginRequired();
                    }
                  }}
                  className="bg-dream-blue-600 text-white px-6 py-2 rounded-md hover:bg-dream-blue-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AiSearchSection; 