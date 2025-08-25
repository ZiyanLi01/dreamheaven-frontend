import React, { useState, useEffect, useRef } from 'react';
import Hero from './components/Hero';
import CombinedSearchSection from './components/CombinedSearchSection';
import PropertyListings from './components/PropertyListings';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  const [showAiResults, setShowAiResults] = useState(false);
  const combinedSearchRef = useRef(null);
  

  
  // Authentication state
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  const handleSearch = async (searchData) => {
    setIsSearching(true);
    try {
      // Import the searchProperties function
      const { searchProperties } = await import('./services/api');
      
      console.log('Search data received from component:', searchData);
      console.log('Search data type:', typeof searchData);
      console.log('Search data keys:', Object.keys(searchData));
      
      // Call the API service (data processing is handled in the API service)
      const results = await searchProperties(searchData);
      console.log('Search results:', results);
      
      // Update state with results
      setSearchResults(results);
      setSearchFilters(searchData);
      setShowAiResults(false); // Hide AI results when using regular search
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
    setShowAiResults(false);
  };

  const handleTryAiSearch = () => {
    // Trigger the highlight function in CombinedSearchSection
    if (combinedSearchRef.current && combinedSearchRef.current.handleTryAiSearch) {
      combinedSearchRef.current.handleTryAiSearch();
    }
  };

  // Authentication functions
  useEffect(() => {
    // Check if user is already logged in on app load
    const savedUser = localStorage.getItem('user');
    console.log('App.js - Saved user from localStorage:', savedUser);
    
    if (savedUser && savedUser !== 'undefined') {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log('App.js - Parsed user:', parsedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      console.log('App.js - No saved user found, setting user to null');
      setUser(null);
    }
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const { loginUser } = await import('./services/api');
      const response = await loginUser(credentials);
      
      // Save user data to localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setShowLoginModal(false);
      setIsRegisterMode(false);
    } catch (error) {
      throw error;
    }
  };

  const handleRegister = async (userData) => {
    try {
      const { registerUser } = await import('./services/api');
      const response = await registerUser(userData);
      
      // Save user data to localStorage
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      setUser(response.user);
      setShowLoginModal(false);
      setIsRegisterMode(false);
    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {
    try {
      const { logoutUser } = await import('./services/api');
      await logoutUser();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      // Still clear local state even if API call fails
      setUser(null);
    }
  };

  const openLoginModal = (mode = 'login') => {
    setIsRegisterMode(mode === 'register');
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
    setIsRegisterMode(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Hero 
        onTryAiSearch={handleTryAiSearch}
        user={user} 
        onLoginClick={() => openLoginModal('login')}
        onLogout={handleLogout}
      />
      <CombinedSearchSection 
        ref={combinedSearchRef}
        user={user}
        onLoginRequired={() => openLoginModal('login')}
        onSearchResults={handleSearch}
        onFilterResults={setSearchResults}
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        onAiResultsChange={setShowAiResults}
      />

      {!showAiResults ? (
        <PropertyListings 
          searchResults={searchResults}
          searchFilters={searchFilters}
          onClearSearch={clearSearch}
        />
      ) : (
        <div className="py-8 text-center text-gray-500">
          <p>AI search results are being displayed above</p>
        </div>
      )}
      <Testimonials />
      <Footer />
      
      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={closeLoginModal}
        onLogin={handleLogin}
        onRegister={handleRegister}
        isRegisterMode={isRegisterMode}
        switchToRegister={() => setIsRegisterMode(true)}
        switchToLogin={() => setIsRegisterMode(false)}
      />
    </div>
  );
}

export default App; 