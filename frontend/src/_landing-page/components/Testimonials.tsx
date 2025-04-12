import React from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

const testimonials = [
  {
    quote: "The platform's intuitive interface and powerful features have transformed our content management workflow. It's exactly what we needed.",
    author: "Sarah Johnson",
    role: "Content Director, TechCorp",
    rating: 5,
  },
  {
    quote: "Security and ease of use were our top priorities. This platform delivers on both while providing excellent support.",
    author: "Michael Chen",
    role: "CTO, StartupX",
    rating: 5,
  },
  {
    quote: "The custom fields and SEO tools have significantly improved our content strategy. Highly recommended for any content team.",
    author: "Emily Rodriguez",
    role: "Digital Marketing Manager, BrandCo",
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="py-12" id="testimonials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Trusted by Content Teams
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            See what our customers have to say about their experience
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ))}
              </div>
              <blockquote className="text-gray-600 mb-4">
                "{testimonial.quote}"
              </blockquote>
              <div className="mt-4">
                <p className="font-medium text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 