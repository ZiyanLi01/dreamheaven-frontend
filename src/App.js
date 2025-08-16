import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchSection from './components/SearchSection';
import AiSearchSection from './components/AiSearchSection';
import PropertyListings from './components/PropertyListings';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';

function App() {
  const [searchResults, setSearchResults] = useState(null);
  const [searchFilters, setSearchFilters] = useState({});
  const [isSearching, setIsSearching] = useState(false);
  
  // Authentication state
  const [user, setUser] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);

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
      <Header 
        user={user} 
        onLoginClick={() => openLoginModal('login')}
        onLogout={handleLogout}
      />
      <Hero />
      <AiSearchSection 
        user={user}
        onLoginRequired={() => openLoginModal('login')}
        onSearchResults={handleSearch}
      />
      <SearchSection onSearch={handleSearch} isSearching={isSearching} />
      <PropertyListings 
        searchResults={searchResults}
        searchFilters={searchFilters}
        onClearSearch={clearSearch}
      />
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