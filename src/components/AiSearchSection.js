import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { aiSearchProperties } from '../services/api';

const AiSearchSection = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleAiSearch = async () => {
    if (!searchQuery.trim()) {
      console.log('Please enter a search query');
      return;
    }

    try {
      console.log('AI Search query:', searchQuery);
      
      // Call the AI search API
      const results = await aiSearchProperties(searchQuery);
      console.log('AI Search results:', results);
      
      // Pass the results to the parent component
      if (onSearchResults && results) {
        onSearchResults(results, { searchQuery });
      }
      
    } catch (error) {
      console.error('Error performing AI search:', error);
      // Here you can show an error message to the user
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
                  className="bg-dream-blue-600 hover:bg-dream-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
                >
                  Search
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
    </section>
  );
};

export default AiSearchSection; 