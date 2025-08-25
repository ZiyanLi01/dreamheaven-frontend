import React, { useState, useRef, useEffect } from 'react';
import { Check, ArrowDown, Star, User, LogOut } from 'lucide-react';

const Hero = ({ onTryAiSearch, user, onLoginClick, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await onLogout();
    setShowUserMenu(false);
  };

  return (
    <section className="relative bg-cover bg-center bg-no-repeat py-20" style={{backgroundImage: 'url(/2.png)'}}>
      {/* Navigation Overlay - Logo and Sign In */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="flex justify-between items-center h-16">
            {/* Left spacer for balance */}
            <div className="w-32"></div>

            {/* Logo - Centered */}
            <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
              <button 
                onClick={() => window.location.href = '/'}
                className="hover:opacity-80 transition-opacity duration-200"
              >
                <img 
                  src="/logo3.png?v=1" 
                  alt="Dream Haven" 
                  className="h-[150px] cursor-pointer"
                />
              </button>
            </div>

            {/* User Icon */}
            <div className="flex items-center relative" ref={userMenuRef}>
              {user ? (
                // Logged in user
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 hover:bg-white/30 transition-colors duration-200"
                >
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-dream-blue-600 text-xs font-medium">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-white text-sm hidden sm:block">
                    {user.name || user.email}
                  </span>
                </button>
              ) : (
                // Not logged in
                <button
                  onClick={onLoginClick}
                  className="flex items-center space-x-2 bg-white text-dream-blue-600 rounded-full px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">Sign In</span>
                </button>
              )}

              {/* User Menu Dropdown */}
              {showUserMenu && user && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced overlay for better text readability and emotional impact */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Headline */}
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg mb-6">
            Find Your Dream Home, Smarter & Faster with AI
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl lg:text-2xl text-white/90 font-medium drop-shadow-sm mb-8 max-w-3xl mx-auto">
            Tell us what you want — we'll find the perfect home.
          </p>
          
          {/* CTA Button */}
          <div className="mb-6">
            <button 
              onClick={onTryAiSearch}
              className="bg-white hover:bg-gray-50 text-dream-blue-600 font-bold text-xl px-10 py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 drop-shadow-lg"
            >
              Try AI Search
            </button>
          </div>
          
          {/* Trust Element */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="flex items-center space-x-1">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
            <span className="text-white/80 font-medium">Trusted by 1,200+ users</span>
          </div>
          
          {/* Feature List - Center Aligned Single Column */}
          <div className="flex flex-col items-center space-y-4 max-w-2xl mx-auto">
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 drop-shadow-sm" />
              <span className="text-white font-medium drop-shadow-sm">No more complex filters</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 drop-shadow-sm" />
              <span className="text-white font-medium drop-shadow-sm">AI-powered matching</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 drop-shadow-sm" />
              <span className="text-white font-medium drop-shadow-sm">Instant results</span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-5 h-5 text-green-400 flex-shrink-0 drop-shadow-sm" />
              <span className="text-white font-medium drop-shadow-sm">Personalized recommendations</span>
            </div>
          </div>
          

        </div>
      </div>
    </section>
  );
};

export default Hero; 