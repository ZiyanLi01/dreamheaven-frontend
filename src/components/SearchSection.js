import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Search, Filter } from 'lucide-react';
import { searchProperties } from '../services/api';

const SearchSection = () => {
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

  const handleSearch = async () => {
    try {
      // Filter out empty values and dropdown states
      const searchPayload = {
        location: searchData.location,
        rent: searchData.rent,
        bed: searchData.bed,
        bath: searchData.bath,
        searchQuery: searchData.searchQuery,
        sortBy: searchData.sortBy,
        sortOrder: searchData.sortOrder
      };

      // Remove empty values
      Object.keys(searchPayload).forEach(key => {
        if (!searchPayload[key]) {
          delete searchPayload[key];
        }
      });

      console.log('Search data to send to backend:', searchPayload);
      
      // Call the API service
      const results = await searchProperties(searchPayload);
      console.log('Search results:', results);
      
      // Here you can handle the results (e.g., update state, navigate to results page)
      // For now, we'll just log them
      
      // You can add navigation to results page or update a global state here
      
    } catch (error) {
      console.error('Error searching properties:', error);
      // Here you can show an error message to the user
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

            {/* Filter Button */}
            <div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="btn-secondary flex items-center justify-center space-x-2 w-full"
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filter</span>
              </button>
            </div>

            {/* Search Button */}
            <div>
              <button 
                onClick={handleSearch}
                className="bg-dream-blue-600 hover:bg-dream-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 w-full"
              >
                <Search className="w-4 h-4" />
                <span className="hidden sm:inline">Search</span>
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
        </div>
      </div>
    </section>
  );
};

export default SearchSection; 