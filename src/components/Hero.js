import React from 'react';
import { Check, ArrowDown, Star } from 'lucide-react';

const Hero = () => {

  return (
    <section className="relative bg-cover bg-center bg-no-repeat py-20" style={{backgroundImage: 'url(/1.png)'}}>
      {/* Enhanced overlay for better text readability and emotional impact */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <button className="bg-white hover:bg-gray-50 text-dream-blue-600 font-bold text-xl px-10 py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 drop-shadow-lg">
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
          
          {/* Feature List - 2 Columns with Icons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
          
          {/* Anchor Link */}
          <div className="mt-10">
            <a href="#property-listings" className="inline-flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-300 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full backdrop-blur-sm">
              <span className="text-lg font-medium">Browse Homes</span>
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 