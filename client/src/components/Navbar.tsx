
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <a href="#" className="flex items-center">
              <span className="text-finance-blue-600 font-display font-bold text-xl">PortfolioVision<span className="text-finance-accent"></span></span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-finance-gray-600 hover:text-finance-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="text-finance-gray-600 hover:text-finance-blue-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="text-finance-gray-600 hover:text-finance-blue-600 transition-colors">Testimonials</a>
            <Button 
              className="bg-finance-blue-600 hover:bg-finance-blue-700 text-white"
              onClick={() => {
                document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Get Started
            </Button>
          </div>
          
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-finance-gray-600 hover:text-finance-blue-600"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a 
              href="#features" 
              className="block px-3 py-2 rounded-md text-base font-medium text-finance-gray-600 hover:text-finance-blue-600 hover:bg-finance-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="block px-3 py-2 rounded-md text-base font-medium text-finance-gray-600 hover:text-finance-blue-600 hover:bg-finance-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              How It Works
            </a>
            <a 
              href="#testimonials" 
              className="block px-3 py-2 rounded-md text-base font-medium text-finance-gray-600 hover:text-finance-blue-600 hover:bg-finance-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              Testimonials
            </a>
            <div className="px-3 py-2">
              <Button 
                className="w-full bg-finance-blue-600 hover:bg-finance-blue-700 text-white"
                onClick={() => {
                  document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
