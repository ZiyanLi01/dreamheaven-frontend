import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import SearchSection from './components/SearchSection';
import AiSearchSection from './components/AiSearchSection';
import PropertyListings from './components/PropertyListings';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <AiSearchSection />
      <SearchSection />
      <PropertyListings />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default App; 