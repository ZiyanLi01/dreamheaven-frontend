import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import { ChevronDown, Search, Filter, Sparkles, Lock, X, Bed, Bath, Ruler, Car, MapPin } from 'lucide-react';
import { searchProperties, aiSearchProperties } from '../services/api';

// PropertyCard component
const PropertyCard = ({ property, onClick }) => {
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
      return 'Sale & Rent';
    }
    return 'For Sale'; // Default fallback
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      onClick={onClick}
    >
      {/* Property Image - 16:9 ratio */}
      <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-blue-200">
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
      <div className="p-4 space-y-3">
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

        {/* Key Details - 2x2 grid layout */}
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

const CombinedSearchSection = React.forwardRef(({ user, onLoginRequired, onSearchResults, onFilterResults, isSearching, setIsSearching, onAiResultsChange }, ref) => {
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
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [aiSearchResults, setAiSearchResults] = useState(null);
  const [whatYouNeed, setWhatYouNeed] = useState('');
  const [applyFilter, setApplyFilter] = useState(false);
  const [isFilterSearching, setIsFilterSearching] = useState(false);
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [expandedReasons, setExpandedReasons] = useState({});
  const [isHighlighted, setIsHighlighted] = useState(false);
  const searchRef = useRef(null);

  // Expose handleTryAiSearch function to parent component
  useImperativeHandle(ref, () => ({
    handleTryAiSearch
  }));

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
        sortOrder: searchData.sortOrder,
        page: 1,
        limit: 100  // Request more properties to get closer to the expected 80
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
      
      // Validate the query before sending
      const cleanQuery = searchData.searchQuery.trim();
      if (!cleanQuery || cleanQuery === '') {
        throw new Error('Please enter a search query');
      }
      
      console.log('Clean AI Search query:', cleanQuery);
      
      // Call the AI search API
      const results = await aiSearchProperties(cleanQuery);
      console.log('AI Search results:', results);
      
      // Store results locally for display
      setAiSearchResults(results);
      
      // Set what you need from backend response if available
      if (results.what_you_need || results.whatYouNeed) {
        setWhatYouNeed(results.what_you_need || results.whatYouNeed);
      } else {
        // Fallback to generated content if backend doesn't provide it
        setWhatYouNeed(generateWhatYouNeed(cleanQuery));
      }
      
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
      if (searchData.location && searchData.location.trim()) {
        filterText.push(`in ${searchData.location.trim()}`);
      }
      if (searchData.rent && searchData.rent.trim() && searchData.rent !== 'Both') {
        // Clean up the rent/sale text to avoid redundancy
        const rentText = searchData.rent.toLowerCase().trim();
        if (rentText === 'for rent') {
          filterText.push('for rent');
        } else if (rentText === 'for sale') {
          filterText.push('for sale');
        } else {
          filterText.push(rentText);
        }
      }
      if (searchData.bed && searchData.bed.trim() && searchData.bed !== 'Any') {
        filterText.push(`with ${searchData.bed.trim()} bedrooms`);
      }
      if (searchData.bath && searchData.bath.trim() && searchData.bath !== 'Any') {
        filterText.push(`with ${searchData.bath.trim()} bathrooms`);
      }
      
      const combinedQuery = `${searchData.searchQuery} ${filterText.join(' ')}`.trim();
      console.log('Combined search query:', combinedQuery);
      console.log('Filter text array:', filterText);
      console.log('Search data state:', {
        location: searchData.location,
        rent: searchData.rent,
        bed: searchData.bed,
        bath: searchData.bath,
        searchQuery: searchData.searchQuery
      });
      
      // Ensure we have a valid query
      if (!combinedQuery || combinedQuery.trim() === '') {
        throw new Error('Invalid search query generated');
      }
      
      // Call the AI search API with combined query
      const results = await aiSearchProperties(combinedQuery);
      console.log('Combined search results:', results);
      
      // Store results locally for display
      setAiSearchResults(results);
      
      // Set what you need from backend response if available
      if (results.what_you_need || results.whatYouNeed) {
        setWhatYouNeed(results.what_you_need || results.whatYouNeed);
      } else {
        // Fallback to generated content if backend doesn't provide it
        setWhatYouNeed(generateWhatYouNeed(combinedQuery));
      }
      
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

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
  };

  const handleTryAiSearch = () => {
    setIsHighlighted(true);
    // Scroll to search section
    const searchSection = document.getElementById('ai-search-section');
    if (searchSection) {
      searchSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    // Remove highlight after 3 seconds
    setTimeout(() => setIsHighlighted(false), 3000);
  };

    // Helper function to parse match_details into tags
  const parseReasonToTags = (reasonText, matchDetails) => {
    if (!reasonText && !matchDetails) return { matches: [], mismatches: [] };
    
    let matches = [];
    const mismatches = [];
    
    // If matchDetails is available, use structured data
    if (matchDetails) {
      // Process both structured and semantic matches, deduplicating identical elements
      const allMatches = new Set(); // Use Set to automatically deduplicate
      
      // Process structured matches
      if (matchDetails.structured && Array.isArray(matchDetails.structured) && matchDetails.structured.length > 0) {
        matchDetails.structured.forEach(item => {
          if (item.includes('✓')) {
            const cleanPart = item.replace('✓', '').trim();
            if (cleanPart) allMatches.add(cleanPart);
          }
        });
      }
      
      // Process semantic matches
      if (matchDetails.semantic && Array.isArray(matchDetails.semantic)) {
        matchDetails.semantic.forEach(item => {
          if (item.includes('✓')) {
            const cleanPart = item.replace('✓', '').trim();
            if (cleanPart) allMatches.add(cleanPart);
          }
        });
      }
      
      // Convert Set back to array
      matches = Array.from(allMatches);
      
      // Always process soft_preferences if not null
      if (matchDetails.soft_preferences && Array.isArray(matchDetails.soft_preferences)) {
        matchDetails.soft_preferences.forEach(item => {
          if (item.includes('✓')) {
            const cleanPart = item.replace('✓', '').trim();
            if (cleanPart) matches.push(cleanPart);
          }
        });
      }
      
      // Always process missing items (issues) if not null
      if (matchDetails.missing && Array.isArray(matchDetails.missing)) {
        matchDetails.missing.forEach(item => {
          if (item.includes('✗')) {
            const cleanPart = item.replace('✗', '').trim();
            if (cleanPart) mismatches.push(cleanPart);
          }
        });
      }
    } else {
      // Fallback to text parsing if matchDetails is not available
      if (reasonText.includes('|')) {
        // Split by pipe first to separate sections
        const sections = reasonText.split('|').map(section => section.trim());
        
        // Process each section
        sections.forEach(section => {
          if (section.includes('requirements:') || section.includes('Requirements:')) {
            // Extract content after "requirements:" and before any comma
            const reqMatch = section.match(/(?:requirements:)?\s*✓\s*(.*?)(?=,|$)/i);
            if (reqMatch && reqMatch[1]) {
              matches.push(reqMatch[1].trim());
            }
          } else if (section.includes('Note:') || section.includes('note:')) {
            // Extract all ✗ items from the Note section
            const noteContent = section.replace(/^Note:\s*/i, '').trim(); // Remove "Note:" prefix
            const noteParts = noteContent.split(',').map(part => part.trim()).filter(part => part);
            noteParts.forEach(part => {
              if (part.includes('✗')) {
                const cleanPart = part.replace('✗', '').trim();
                if (cleanPart) mismatches.push(cleanPart);
              }
            });
          }
        });
      } else {
        // Fallback: simple comma-based parsing
        const allParts = reasonText.split(',').map(part => part.trim()).filter(part => part);
        
        allParts.forEach(part => {
          if (part.includes('✓')) {
            // Extract content after ✓ symbol
            const cleanPart = part.replace('✓', '').trim();
            if (cleanPart) matches.push(cleanPart);
          } else if (part.includes('✗')) {
            // Extract content after ✗ symbol
            const cleanPart = part.replace('✗', '').trim();
            if (cleanPart) mismatches.push(cleanPart);
          }
        });
      }
    }
    
    return { matches, mismatches };
  };

  // Helper function to format reason text for better display
  const formatReasonText = (reasonText) => {
    if (!reasonText) return null;
    
    // First, let's clean up the text to ensure headers are on single lines and separate content properly
    let cleanedText = reasonText
      .replace(/Matches your requirements:\s*\n/g, 'Matches your requirements:\n')
      .replace(/Note:\s*\n/g, 'Note:\n')
      .replace(/\|\s*Note:/g, '\nNote:') // Convert pipe separator to line break for Note
      .replace(/Matches your requirements:\s*\|/g, 'Matches your requirements:\n') // Convert pipe separator to line break for requirements
      .replace(/,\s*✗/g, '\n✗') // Convert comma + X mark to line break + X mark
      .replace(/,\s*✓/g, '\n✓') // Convert comma + checkmark to line break + checkmark
      .replace(/\s*✗\s*/g, '\n✗ ') // Ensure X marks are on separate lines
      .replace(/\s*✓\s*/g, '\n✓ '); // Ensure checkmarks are on separate lines
    
    const lines = cleanedText.split('\n');
    const formattedLines = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;
      
      // Handle "Matches your requirements:" header
      if (trimmedLine.toLowerCase().includes('matches your requirements:')) {
        formattedLines.push(
          <div key={`header-${index}`} className="font-bold text-gray-800 mb-2">
            {trimmedLine}
          </div>
        );
        return;
      }
      
      // Handle checkmarks (✓) - positive matches
      if (trimmedLine.includes('✓')) {
        formattedLines.push(
          <div key={`check-${index}`} className="flex items-start space-x-2 ml-4">
            <span className="text-green-600 text-lg">✓</span>
            <span className="text-gray-700">{trimmedLine.replace('✓', '').trim()}</span>
          </div>
        );
        return;
      }
      
      // Handle "Note:" section header
      if (trimmedLine.toLowerCase().includes('note:')) {
        formattedLines.push(
          <div key={`note-${index}`} className="font-bold text-gray-700 mt-3 mb-1">
            {trimmedLine}
          </div>
        );
        return;
      }
      
      // Handle X marks (✗) - negative matches/issues
      if (trimmedLine.includes('✗')) {
        formattedLines.push(
          <div key={`x-${index}`} className="flex items-start space-x-2 ml-4">
            <span className="text-red-500 text-lg">✗</span>
            <span className="text-gray-600">{trimmedLine.replace('✗', '').trim()}</span>
          </div>
        );
        return;
      }
      
      // Handle regular text
      if (trimmedLine) {
        formattedLines.push(
          <div key={`text-${index}`} className="text-gray-600">
            {trimmedLine}
          </div>
        );
      }
    });
    
    return formattedLines;
  };

  // Helper function to generate "What You Need" content based on search query
  const generateWhatYouNeed = (query) => {
    const requirements = [];
    
    // Extract location requirements
    if (query.toLowerCase().includes('mission district') || query.toLowerCase().includes('mission')) {
      requirements.push('• Location: Mission District, San Francisco');
    } else if (query.toLowerCase().includes('los angeles') || query.toLowerCase().includes('la')) {
      requirements.push('• Location: Los Angeles, CA');
    } else if (query.toLowerCase().includes('new york') || query.toLowerCase().includes('nyc')) {
      requirements.push('• Location: New York, NY');
    } else if (query.toLowerCase().includes('seattle')) {
      requirements.push('• Location: Seattle, WA');
    } else if (query.toLowerCase().includes('austin')) {
      requirements.push('• Location: Austin, TX');
    } else if (query.toLowerCase().includes('nashville')) {
      requirements.push('• Location: Nashville, TN');
    } else if (query.toLowerCase().includes('portland')) {
      requirements.push('• Location: Portland, OR');
    } else if (query.toLowerCase().includes('denver')) {
      requirements.push('• Location: Denver, CO');
    }
    
    // Extract bedroom requirements
    if (query.toLowerCase().includes('1-bedroom') || query.toLowerCase().includes('1 bedroom') || query.toLowerCase().includes('studio')) {
      requirements.push('• Bedrooms: 1 bedroom or studio');
    } else if (query.toLowerCase().includes('2-bedroom') || query.toLowerCase().includes('2 bedroom')) {
      requirements.push('• Bedrooms: 2 bedrooms');
    } else if (query.toLowerCase().includes('3-bedroom') || query.toLowerCase().includes('3 bedroom')) {
      requirements.push('• Bedrooms: 3 bedrooms');
    } else if (query.toLowerCase().includes('4-bedroom') || query.toLowerCase().includes('4 bedroom')) {
      requirements.push('• Bedrooms: 4 bedrooms');
    }
    
    // Extract price requirements
    if (query.toLowerCase().includes('under $2,500') || query.toLowerCase().includes('under $2500')) {
      requirements.push('• Budget: Under $2,500 per month');
    } else if (query.toLowerCase().includes('under $3,000') || query.toLowerCase().includes('under $3000')) {
      requirements.push('• Budget: Under $3,000 per month');
    } else if (query.toLowerCase().includes('under $4,000') || query.toLowerCase().includes('under $4000')) {
      requirements.push('• Budget: Under $4,000 per month');
    } else if (query.toLowerCase().includes('under $5,000') || query.toLowerCase().includes('under $5000')) {
      requirements.push('• Budget: Under $5,000 per month');
    }
    
    // Extract property type requirements
    if (query.toLowerCase().includes('apartment')) {
      requirements.push('• Property Type: Apartment');
    } else if (query.toLowerCase().includes('house') || query.toLowerCase().includes('home')) {
      requirements.push('• Property Type: House');
    } else if (query.toLowerCase().includes('condo') || query.toLowerCase().includes('condominium')) {
      requirements.push('• Property Type: Condominium');
    } else if (query.toLowerCase().includes('townhouse') || query.toLowerCase().includes('town house')) {
      requirements.push('• Property Type: Townhouse');
    }
    
    // Extract amenity requirements
    if (query.toLowerCase().includes('modern')) {
      requirements.push('• Style: Modern design');
    } else if (query.toLowerCase().includes('bright') || query.toLowerCase().includes('natural light')) {
      requirements.push('• Features: Bright with natural light');
    } else if (query.toLowerCase().includes('quiet')) {
      requirements.push('• Environment: Quiet neighborhood');
    } else if (query.toLowerCase().includes('near good schools') || query.toLowerCase().includes('good schools')) {
      requirements.push('• Location: Near good schools');
    } else if (query.toLowerCase().includes('big yard') || query.toLowerCase().includes('yard')) {
      requirements.push('• Outdoor Space: Big yard');
    }
    
    // If no specific requirements found, provide a generic summary
    if (requirements.length === 0) {
      requirements.push('• Custom search criteria based on your description');
    }
    
    return requirements.join('\n');
  };

  const toggleReasonExpansion = (propertyId) => {
    setExpandedReasons(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };

  const clearResults = () => {
    setAiSearchResults(null);
    setWhatYouNeed('');
    setExpandedReasons({});
    
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
                className="bg-white hover:bg-gray-50 text-dream-blue-600 border-2 border-dream-blue-600 px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div id="ai-search-section" className="relative">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-5 h-5 text-dream-blue-600" />
              <span className="text-lg font-semibold text-dream-gray-800">AI Natural Language Search</span>
            </div>
            <textarea
              placeholder="Describe your dream home... e.g., 'Modern house with big yard, near good schools, bright & quiet'"
              className={`w-full px-4 py-3 pr-24 text-base border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-dream-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                isHighlighted 
                  ? 'border-blue-400 bg-blue-50 shadow-lg shadow-blue-200 ring-4 ring-blue-200' 
                  : 'border-gray-200 bg-blue-50'
              }`}
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
                className="bg-dream-blue-600 hover:bg-dream-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed w-32"
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
                {/* What You Need Info Box */}
                {whatYouNeed && (
                  <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                    <div className="space-y-3">
                      {whatYouNeed.split('\n').map((line, index) => {
                        const trimmedLine = line.trim();
                        if (!trimmedLine) return null;
                        
                        // Handle section headers
                        if (trimmedLine.toLowerCase().includes('must have:') || trimmedLine.toLowerCase().includes('nice to have:')) {
                          return (
                            <div key={index} className="font-semibold text-blue-800 text-sm uppercase tracking-wide">
                              {trimmedLine}
                            </div>
                          );
                        }
                        
                        // Handle bullet points
                        if (trimmedLine.startsWith('•')) {
                          return (
                            <div key={index} className="flex items-start space-x-2 ml-4">
                              <span className="text-blue-600 mt-1">•</span>
                              <span className="text-blue-700 text-sm">{trimmedLine.substring(1).trim()}</span>
                            </div>
                          );
                        }
                        
                        // Handle regular text
                        return (
                          <div key={index} className="text-blue-700 text-sm">
                            {trimmedLine}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
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
                
                {(aiSearchResults.results || aiSearchResults.items || aiSearchResults.listings) && (aiSearchResults.results || aiSearchResults.items || aiSearchResults.listings).length > 0 ? (
                  <div>
                    <p className="text-sm text-gray-600 mb-4">
                      Found {(aiSearchResults.results || aiSearchResults.items || aiSearchResults.listings).length} properties for: "{searchData.searchQuery}"
                    </p>
                    
                    {/* 10 rows, 2 columns each */}
                    <div className="space-y-6">
                      {(aiSearchResults.results || aiSearchResults.items || aiSearchResults.listings).slice(0, 10).map((property, index) => (
                        <div key={property.id || index} className="flex gap-6">
                          {/* Left Column - Listing Card (same format as home page) */}
                          <div className="flex-1">
                            <PropertyCard property={property} onClick={() => handlePropertyClick(property)} />
                          </div>
                          
                          {/* Right Column - Recommendation Panel */}
                          <div className="w-[450px]">
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 h-full flex flex-col">
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
                                    className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${(property.similarity_score || 0) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              
                              {/* Recommendation Tags */}
                              <div className="flex-1">
                                <div className="mb-3">
                                  <h5 className="text-base font-medium text-gray-700">Recommendation</h5>
                                </div>
                                
                                {/* Tags */}
                                <div className="space-y-4">
                                  {(() => {
                                    const { matches, mismatches } = parseReasonToTags(property.reason, property.match_details);
                                    return (
                                      <>
                                        {/* Matched Criteria - Green Tags */}
                                        {matches.length > 0 && (
                                          <div>
                                            <div className="text-base font-medium text-gray-700 mb-4">✓ Matches:</div>
                                            <div className="space-y-1">
                                              {matches.map((match, idx) => (
                                                <div key={idx} className="text-base font-medium text-green-700 bg-green-50 border border-green-200 rounded px-3 py-2 break-words whitespace-normal overflow-visible">
                                                  <span className="whitespace-normal">{match}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                        
                                        {/* Mismatched Criteria - Red Tags */}
                                        {mismatches.length > 0 && (
                                          <div>
                                            <div className="text-base font-medium text-gray-700 mb-3">✗ Issues:</div>
                                            <div className="space-y-4">
                                              {mismatches.map((mismatch, idx) => (
                                                <div key={idx} className="text-base font-medium text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2 break-words whitespace-normal overflow-visible">
                                                  <span className="whitespace-normal">{mismatch}</span>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                                
                                {/* Expanded Details */}
                                {expandedReasons[property.id || index] && (
                                  <div className="mt-4 p-3 bg-white border border-gray-300 rounded">
                                    <h6 className="text-xs font-medium text-gray-700 mb-2">Detailed Analysis</h6>
                                    <div className="text-xs text-gray-600 space-y-2">
                                      {formatReasonText(property.reason)}
                                    </div>
                                  </div>
                                )}
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

                {/* Third Row: Reviews */}
                {selectedProperty.review_count !== undefined && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">⭐</span>
                        <span className="font-semibold text-gray-800">Reviews</span>
                      </div>
                      <span className="text-lg text-gray-600">
                        {selectedProperty.review_count}
                      </span>
                    </div>
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

              {/* Tags */}
              {selectedProperty.tags && selectedProperty.tags.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProperty.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}


            </div>
          </div>
        </div>
      )}
    </section>
  );
});

export default CombinedSearchSection;
