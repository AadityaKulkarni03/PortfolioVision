
import React from 'react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    quote: "PortfolioVision has completely changed how I view my investments. The sector breakdown and attribution analysis helped me identify weaknesses in my portfolio that I never would have spotted.",
    author: "Sarah J.",
    title: "Individual Investor",
    delay: "0.1s"
  },
  {
    quote: "As a financial advisor, this tool has become indispensable. The active weight analysis helps me quickly spot portfolio drift and adjust allocations for my clients with confidence.",
    author: "Michael T.",
    title: "Certified Financial Planner",
    delay: "0.3s"
  },
  {
    quote: "The performance attribution feature is incredibly powerful. It shows exactly which decisions contributed to or detracted from my returns - something I used to spend hours calculating manually.",
    author: "David L.",
    title: "Investment Analyst",
    delay: "0.5s"
  }
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-16 md:py-24 bg-finance-blue-600 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-semibold text-white font-display mb-4 text-center">What Our Users Say</h2>
        <p className="text-lg text-finance-blue-100 max-w-3xl mx-auto mb-12 text-center">
          Join thousands of investors who have transformed their investment process
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 animate-fade-in" 
              style={{ animationDelay: testimonial.delay }}
            >
              <div className="mb-4 text-finance-blue-200">
                <Quote className="h-8 w-8" />
              </div>
              <p className="text-white mb-6 italic">"{testimonial.quote}"</p>
              <div>
                <p className="text-white font-medium">{testimonial.author}</p>
                <p className="text-finance-blue-200">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
