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

  const handleSearchResults = (results, filters) => {
    setSearchResults(results);
    setSearchFilters(filters);
  };

  const clearSearch = () => {
    setSearchResults(null);
    setSearchFilters({});
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <AiSearchSection onSearchResults={handleSearchResults} />
      <SearchSection onSearchResults={handleSearchResults} />
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