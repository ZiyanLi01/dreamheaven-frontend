import React from 'react';

const TestimonialCard = ({ testimonial }) => {
  return (
    <div className="card p-6">
      <div className="space-y-4">
        <p className="text-dream-gray-600 leading-relaxed">
          "{testimonial.quote}"
        </p>
        <div className="flex items-center space-x-3">
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
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      quote: "Dream Haven made finding our perfect home so easy. The AI-powered search understood exactly what we were looking for and found properties we never would have discovered on our own.",
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
      quote: "As a real estate agent, I love how Dream Haven helps my clients find their dream homes faster. The platform is intuitive and the results are always spot-on.",
      name: "Sarah Johnson",
      role: "Customer"
    }
  ];

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

        {/* Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Pagination Dots */}
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-dream-blue-600 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 