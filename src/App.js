import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchSection from './components/SearchSection';
import AiSearchSection from './components/AiSearchSection';
import PropertyListings from './components/PropertyListings';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (searchData) => {
    setIsSearching(true);
    try {
      // Import the searchProperties function
      const { searchProperties } = await import('./services/api');
      
      // Filter out empty values
      const searchPayload = { ...searchData };
      Object.keys(searchPayload).forEach(key => {
        if (!searchPayload[key]) {
          delete searchPayload[key];
        }
      });

      console.log('Search data to send to backend:', searchPayload);
      
      // Call the API service
      const results = await searchProperties(searchPayload);
      console.log('Search results:', results);
      
      // Update state with results
      setSearchResults(results);
      setSearchFilters(searchPayload);
    } catch (error) {
      console.error('Error searching properties:', error);
      setSearchResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchFilters({});
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <AiSearchSection />
      <SearchSection onSearch={handleSearch} isSearching={isSearching} />
      <PropertyListings 
        searchResults={searchResults}
        searchFilters={searchFilters}
        onClearSearch={clearSearch}
      />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App; 