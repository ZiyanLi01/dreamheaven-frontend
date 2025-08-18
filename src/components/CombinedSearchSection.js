import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Filter, Sparkles, Lock, X, Bed, Bath, Ruler, Car, MapPin } from 'lucide-react';
import { searchProperties, aiSearchProperties } from '../services/api';

// PropertyCard component
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

  // Helper function to get property title (unused but kept for consistency)
  // const getPropertyTitle = () => {
  //   if (property.title) {
  //     return property.title;
  //   }
  //   // Extract title from address
  //   if (property.address) {
  //     const addressParts = property.address.split(',');
  //     return addressParts[0] || 'Property';
  //   }
  //   return 'Property';
  // };

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
      return `$${Math.round(rentPrice).toLocaleString()}/month`;
    } else if (isForSale) {
      // For sale only: show direct price
      return `$${Math.round(priceForSale).toLocaleString()}`;
    } else {
      // Default fallback - assume it's for sale
      return `$${Math.round(priceForSale).toLocaleString()}`;
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

const CombinedSearchSection = ({ user, onLoginRequired, onSearchResults, onFilterResults, isSearching, setIsSearching, onAiResultsChange }) => {
  const [searchData, setSearchData] = useState({
    location: '',
    rent: '',
    bed: '',
    bath: '',
    searchQuery: '',
    sortBy: 'price',
    sortOrder: 'asc',
    showLocationDropdown: false,
    showRentDropdown: false,
    showBedDropdown: false,
    showBathDropdown: false,
    locationSearch: ''
  });

  const [showFilters, setShowFilters] = useState(false);
  const [showEmptyQueryModal, setShowEmptyQueryModal] = useState(false);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);
  const [aiSearchResults, setAiSearchResults] = useState(null);
  const [applyFilter, setApplyFilter] = useState(false);
  const [isFilterSearching, setIsFilterSearching] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const searchRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchData(prev => ({
          ...prev,
          showLocationDropdown: false,
          showRentDropdown: false,
          showBedDropdown: false,
          showBathDropdown: false
        }));
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Note: handleSearch function removed - now using handleFilterOnly and handleAiSearchOnly

  const handleFilterOnly = async () => {
    // This is for the "Filter" button - only traditional filtering
    const hasFilters = searchData.location || searchData.rent || searchData.bed || searchData.bath;
    
    if (hasFilters) {
      await handleFilterSearch();
    } else {
      setShowEmptyQueryModal(true);
    }
  };

  const handleAiSearchOnly = async () => {
    // This is for the AI "Search" button
    const hasAiQuery = searchData.searchQuery.trim();
    
    if (!hasAiQuery) {
      setShowEmptyQueryModal(true);
      return;
    }

    // Check if user is logged in - AI search requires authentication
    if (!user) {
      setShowLoginRequiredModal(true);
      return;
    }

    if (applyFilter) {
      // Apply filter conditions with AI search
      await handleCombinedSearch();
    } else {
      // Only AI search query
      await handleAiSearch();
    }
  };

  const handleFilterSearch = async () => {
    setIsFilterSearching(true);
    try {
      // Prepare search payload (data cleaning is handled in the API service)
      const searchPayload = {
        location: searchData.location,
        rent: searchData.rent,
        bed: searchData.bed,
        bath: searchData.bath,
        sortBy: searchData.sortBy,
        sortOrder: searchData.sortOrder
      };

      console.log('Filter search data before API call:', searchPayload);
      console.log('Filter search data type:', typeof searchPayload);
      console.log('Filter search data keys:', Object.keys(searchPayload));
      
      // Call the regular search API
      const results = await searchProperties(searchPayload);
      console.log('Filter search results:', results);
      
      // Pass results to parent component
      if (onFilterResults) {
        onFilterResults(results);
      }
      
      // Clear AI results and hide AI results section
      setAiSearchResults(null);
      if (onAiResultsChange) {
        onAiResultsChange(false);
      }
    } catch (error) {
      console.error('Error in filter search:', error);
      alert(`Search failed: ${error.message}`);
    } finally {
      setIsFilterSearching(false);
    }
  };

  const handleAiSearch = async () => {
    // Check if user is logged in - AI search requires authentication
    if (!user) {
      setShowLoginRequiredModal(true);
      return;
    }

    setIsAiSearching(true);
    try {
      console.log('AI Search query:', searchData.searchQuery);
      
      // Call the AI search API
      const results = await aiSearchProperties(searchData.searchQuery);
      console.log('AI Search results:', results);
      
      // Store results locally for display
      setAiSearchResults(results);
      
            // Notify parent that AI results are being shown
      if (onAiResultsChange) {
        onAiResultsChange(true);
      }
    
    // Clear regular search results and ensure PropertyListings is hidden
    if (onFilterResults) {
      onFilterResults(null);
    }
    } catch (error) {
      console.error('Error performing AI search:', error);
      alert(`AI search failed: ${error.message}`);
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleCombinedSearch = async () => {
    // Check if user is logged in - AI search requires authentication
    if (!user) {
      setShowLoginRequiredModal(true);
      return;
    }

    setIsAiSearching(true);
    try {
      // Create combined query with filters
      const filterText = [];
      if (searchData.location) filterText.push(`in ${searchData.location}`);
      if (searchData.rent) filterText.push(`for ${searchData.rent.toLowerCase()}`);
      if (searchData.bed) filterText.push(`with ${searchData.bed} bedrooms`);
      if (searchData.bath) filterText.push(`with ${searchData.bath} bathrooms`);
      
      const combinedQuery = `${searchData.searchQuery} ${filterText.join(' ')}`.trim();
      console.log('Combined search query:', combinedQuery);
      
      // Call the AI search API with combined query
      const results = await aiSearchProperties(combinedQuery);
      console.log('Combined search results:', results);
      
      // Store results locally for display
      setAiSearchResults(results);
      
            // Notify parent that AI results are being shown
      if (onAiResultsChange) {
        onAiResultsChange(true);
      }
    
    // Clear regular search results and ensure PropertyListings is hidden
    if (onFilterResults) {
      onFilterResults(null);
    }
    } catch (error) {
      console.error('Error performing combined search:', error);
      alert(`Combined search failed: ${error.message}`);
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAiSearchOnly();
    }
  };

  const clearResults = () => {
    setAiSearchResults(null);
    
    // Notify parent that AI results are being hidden
    if (onAiResultsChange) {
      onAiResultsChange(false);
    }
    
    if (onFilterResults) {
      onFilterResults(null);
    }
  };

  return (
    <section className="bg-white border-b border-gray-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4" ref={searchRef}>
          {/* Main Search Row */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
            {/* Location */}
            <div className="relative">
              <button 
                onClick={() => setSearchData(prev => ({ ...prev, showLocationDropdown: !prev.showLocationDropdown }))}
                className="dropdown flex items-center justify-between w-full"
              >
                <span className="text-dream-gray-600">
                  {searchData.location || 'Location'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {searchData.showLocationDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2">
                    <input
                      type="text"
                      placeholder="Search locations..."
                      className="w-full px-3 py-2 border border-gray-200 rounded text-sm"
                      value={searchData.locationSearch}
                      onChange={(e) => handleInputChange('locationSearch', e.target.value)}
                    />
                    <div className="mt-2 space-y-1">
                      {['Los Angeles, CA', 'San Francisco, CA', 'New York, NY', 'Seattle, WA', 'Austin, TX', 'Nashville, TN', 'Portland, OR', 'Denver, CO'].map((loc) => (
                        <button
                          key={loc}
                          className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                          onClick={() => {
                            handleInputChange('location', loc);
                            handleInputChange('showLocationDropdown', false);
                          }}
                        >
                          {loc}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rent/Sale */}
            <div className="relative">
              <button 
                onClick={() => setSearchData(prev => ({ ...prev, showRentDropdown: !prev.showRentDropdown }))}
                className="dropdown flex items-center justify-between w-full"
              >
                <span className="text-dream-gray-600">
                  {searchData.rent || 'Rent'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {searchData.showRentDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 space-y-1">
                    {['For Rent', 'For Sale', 'Both'].map((option) => (
                      <button
                        key={option}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                        onClick={() => {
                          handleInputChange('rent', option);
                          handleInputChange('showRentDropdown', false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bedrooms */}
            <div className="relative">
              <button 
                onClick={() => setSearchData(prev => ({ ...prev, showBedDropdown: !prev.showBedDropdown }))}
                className="dropdown flex items-center justify-between w-full"
              >
                <span className="text-dream-gray-600">
                  {searchData.bed || 'Bed'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {searchData.showBedDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 space-y-1">
                    {['Any', '1+', '2+', '3+', '4+', '5+'].map((option) => (
                      <button
                        key={option}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                        onClick={() => {
                          handleInputChange('bed', option);
                          handleInputChange('showBedDropdown', false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bathrooms */}
            <div className="relative">
              <button 
                onClick={() => setSearchData(prev => ({ ...prev, showBathDropdown: !prev.showBathDropdown }))}
                className="dropdown flex items-center justify-between w-full"
              >
                <span className="text-dream-gray-600">
                  {searchData.bath || 'Bath'}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
              {searchData.showBathDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="p-2 space-y-1">
                    {['Any', '1+', '2+', '3+', '4+', '5+'].map((option) => (
                      <button
                        key={option}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
                        onClick={() => {
                          handleInputChange('bath', option);
                          handleInputChange('showBathDropdown', false);
                        }}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sort By Button */}
            <div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center justify-center space-x-2 w-full"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Sort by</span>
              </button>
            </div>

            {/* Filter Button */}
            <div>
              <button 
                onClick={handleFilterOnly}
                disabled={isFilterSearching}
                className="bg-dream-blue-600 hover:bg-dream-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFilterSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span className="hidden sm:inline">Filtering...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-dream-gray-800 mb-3">Sort & Filter Options</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dream-gray-700 mb-2">
                    Sort By
                  </label>
                  <select 
                    className="input-field"
                    value={searchData.sortBy}
                    onChange={(e) => handleInputChange('sortBy', e.target.value)}
                  >
                    <option value="price">Price</option>
                    <option value="date">Post Date</option>
                    <option value="sqft">Square Feet</option>
                    <option value="bedrooms">Bedrooms</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dream-gray-700 mb-2">
                    Sort Order
                  </label>
                  <select 
                    className="input-field"
                    value={searchData.sortOrder}
                    onChange={(e) => handleInputChange('sortOrder', e.target.value)}
                  >
                    <option value="asc">Low to High</option>
                    <option value="desc">High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* AI Search Input */}
          <div className="relative">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-dream-blue-600" />
              <span className="text-lg font-semibold text-dream-gray-800">AI Natural Language Search</span>
            </div>
            <textarea
              placeholder="Describe your dream home... e.g., 'Modern house with big yard, near good schools, bright & quiet'"
              className="w-full px-4 py-3 pr-24 text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-dream-blue-500 focus:border-transparent transition-all duration-200 resize-none bg-blue-50"
              value={searchData.searchQuery}
              onChange={(e) => handleInputChange('searchQuery', e.target.value)}
              onKeyPress={handleKeyPress}
              rows={3}
              style={{ minHeight: '80px' }}
            />
            
            {/* AI Search Controls */}
            <div className="flex items-center justify-between mt-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyFilter}
                  onChange={(e) => setApplyFilter(e.target.checked)}
                  className="w-4 h-4 text-dream-blue-600 border-gray-300 rounded focus:ring-dream-blue-500"
                />
                <span className="text-sm text-gray-700">Apply filter</span>
              </label>
              
              <button
                onClick={handleAiSearchOnly}
                disabled={isAiSearching}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAiSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
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
                    onClick={clearResults}
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
        </div>
      </div>

      {/* Empty Query Modal */}
      {showEmptyQueryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">
                Enter Your Search Criteria
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
                Please enter at least one search criteria:
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-dream-blue-600 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Select location, rent/sale, bedrooms, or bathrooms</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-dream-blue-600 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Or describe your dream home in the AI search box</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-dream-blue-600 rounded-full"></div>
                  <span className="text-gray-600 text-sm">Or combine both for more precise results</span>
                </div>
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

export default CombinedSearchSection;
