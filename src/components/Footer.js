import React from 'react';
import { MapPin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dream-blue-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => window.location.href = '/'}
              className="hover:opacity-80 transition-opacity duration-200"
            >
              <img 
                src="/logo3.png?v=1" 
                alt="Dream Haven" 
                className="h-32 w-auto cursor-pointer"
              />
            </button>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-300" />
                <span className="text-blue-100">124 Brooklyn, Sanjose, CA United States</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-300" />
                <span className="text-blue-100">info@nestvector.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Links */}
        <div className="border-t border-blue-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-blue-200 text-sm">
              © Copyright All Right Reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">
                Terms Of Use
              </a>
              <span className="text-blue-600">|</span>
              <a href="#" className="text-blue-200 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 