import React, { useState } from 'react';
import { Search, Sparkles, Lock, X } from 'lucide-react';
import { aiSearchProperties } from '../services/api';

const AiSearchSection = ({ user, onLoginRequired }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showEmptyQueryModal, setShowEmptyQueryModal] = useState(false);
  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(false);

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) {
      setShowEmptyQueryModal(true);
      return;
    }

    // Check if user is logged in
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
      
      // Here you can handle the results (e.g., update state, navigate to results page)
      // For now, we'll just log them
      
    } catch (error) {
      console.error('Error performing AI search:', error);
      // Here you can show an error message to the user
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