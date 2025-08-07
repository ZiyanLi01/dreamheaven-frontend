import React from 'react';
import { User } from 'lucide-react';

const Header = () => {

      return (
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-dream-blue-600 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-3 bg-white rounded-sm relative">
                    <div className="absolute -top-1 left-0 w-0 h-0 border-l-2 border-r-2 border-b-2 border-transparent border-b-white"></div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-dream-blue-600 font-bold text-lg">Dream</span>
                  <span className="text-dream-blue-400 font-medium text-sm -mt-1">Haven</span>
                </div>
              </div>
            </div>

            {/* User Icon */}
            <div className="flex items-center">
              <button className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors duration-200">
                <User className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </header>
    );
};

export default Header; 