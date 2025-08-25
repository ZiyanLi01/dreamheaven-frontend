import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings } from 'lucide-react';

const Header = ({ user, onLoginClick, onLogout }) => {
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
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src="/logo.png?v=1" 
                alt="Dream Haven" 
                className="h-16 w-auto"
              />
            </div>

            {/* User Icon */}
            <div className="flex items-center relative" ref={userMenuRef}>
              {user ? (
                // Logged in user
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-gray-100 rounded-full px-3 py-1 hover:bg-gray-200 transition-colors duration-200"
                >
                  <div className="w-6 h-6 bg-dream-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700 hidden sm:block">
                    {user.name || user.email}
                  </span>
                </button>
              ) : (
                // Not logged in
                <button
                  onClick={onLoginClick}
                  className="flex items-center space-x-2 bg-dream-blue-600 text-white rounded-full px-4 py-2 hover:bg-dream-blue-700 transition-colors duration-200"
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
      </header>
    );
};

export default Header; 