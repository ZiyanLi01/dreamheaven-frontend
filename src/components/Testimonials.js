import React, { useState } from 'react';

const TestimonialCard = ({ testimonial, onClick }) => {
  return (
    <div 
      className="card p-6 w-[320px] h-[200px] flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      <div className="flex-1 space-y-4">
        <p className="text-dream-gray-600 leading-relaxed line-clamp-4">
          "{testimonial.quote}"
        </p>
      </div>
      <div className="flex items-center space-x-3 mt-auto">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {testimonial.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <p className="font-semibold text-dream-gray-800">{testimonial.name}</p>
          <p className="text-sm text-dream-gray-500">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialModal = ({ testimonial, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800">Customer Review</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Quote */}
          <div className="mb-6">
            <div className="flex items-start space-x-3">
              <span className="text-4xl text-gray-300 font-bold">"</span>
              <p className="text-lg text-gray-700 leading-relaxed flex-1">
                {testimonial.quote}
              </p>
              <span className="text-4xl text-gray-300 font-bold">"</span>
            </div>
          </div>

          {/* Customer Info */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {testimonial.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-lg">{testimonial.name}</p>
              <p className="text-gray-600">{testimonial.role}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-dream-blue-600 text-white px-6 py-2 rounded-md hover:bg-dream-blue-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const testimonials = [
    {
      id: 1,
      quote: "Nest Vector made finding our perfect home so easy. The AI-powered search understood exactly what we were looking for and found properties we never would have discovered on our own.",
      name: "Grace Hall",
      role: "Customer"
    },
    {
      id: 2,
      quote: "The natural language search is incredible. I just typed 'I want a house with a big backyard near good schools' and it found exactly what I needed. Highly recommend!",
      name: "Michael Chen",
      role: "Customer"
    },
    {
      id: 3,
      quote: "As a real estate agent, I love how Nest Vector helps my clients find their dream homes faster. The platform is intuitive and the results are always spot-on.",
      name: "Sarah Johnson",
      role: "Customer"
    },
    {
      id: 4,
      quote: "Nest Vector's AI search is a game-changer! Found my dream apartment in San Francisco within minutes. The personalized recommendations were spot-on.",
      name: "David Rodriguez",
      role: "Customer"
    },
    {
      id: 5,
      quote: "Finally, a platform that understands what I'm looking for! Nest Vector's natural language search found me the perfect home in the Mission District.",
      name: "Emily Watson",
      role: "Customer"
    },
    {
      id: 6,
      quote: "The instant results and personalized recommendations from Nest Vector saved me weeks of searching. Found my ideal home in Pacific Heights!",
      name: "Alex Thompson",
      role: "Customer"
    },
    {
      id: 7,
      quote: "Nest Vector's AI-powered matching is incredible. It understood my preferences better than any real estate agent I've worked with.",
      name: "Jennifer Lee",
      role: "Customer"
    },
    {
      id: 8,
      quote: "No more complex filters! Nest Vector's natural language search made house hunting enjoyable instead of frustrating.",
      name: "Robert Kim",
      role: "Customer"
    },
    {
      id: 9,
      quote: "Found my perfect home in Hayes Valley thanks to Nest Vector. The AI recommendations were exactly what I needed.",
      name: "Maria Garcia",
      role: "Customer"
    }
  ];

  const totalSlides = Math.ceil(testimonials.length / 3);
  
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  const getVisibleTestimonials = () => {
    const startIndex = currentIndex * 3;
    return testimonials.slice(startIndex, startIndex + 3);
  };

  const handleCardClick = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTestimonial(null);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <span className="text-6xl text-dream-gray-200 font-bold">"</span>
            <h2 className="text-3xl lg:text-4xl font-bold text-dream-gray-800">
              What Our Customers Say
            </h2>
            <span className="text-6xl text-dream-gray-200 font-bold">"</span>
          </div>
        </div>

        {/* Testimonial Cards Container */}
        <div className="relative mb-8">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-200"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Testimonial Cards */}
          <div className="flex justify-center px-16">
            <div className="flex space-x-8 max-w-5xl">
              {getVisibleTestimonials().map((testimonial) => (
                <TestimonialCard 
                  key={testimonial.id} 
                  testimonial={testimonial} 
                  onClick={() => handleCardClick(testimonial)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalSlides }, (_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index === currentIndex ? 'bg-dream-blue-600' : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Testimonial Modal */}
      <TestimonialModal 
        testimonial={selectedTestimonial}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </section>
  );
};

export default Testimonials; 