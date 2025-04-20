
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero: React.FC = () => {
  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-finance-gray-900 font-display leading-tight animate-fade-in" style={{ animationDelay: '0.1s' }}>
              See Your Portfolio 
              <span className="text-finance-blue-600"> Clearly.</span>
            </h1>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium text-finance-gray-700 mt-2 font-display leading-tight animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Analyze. Compare. Optimize.
            </h2>
            <p className="text-finance-gray-600 mt-6 text-lg max-w-xl animate-fade-in" style={{ animationDelay: '0.5s' }}>
              PortfolioVision gives you unprecedented visibility into your investments with powerful analytics previously available only to professional fund managers.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <Button 
                className="bg-finance-blue-600 hover:bg-finance-blue-700 text-white font-medium px-8 py-6 text-lg"
                onClick={() => {
                  document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Get Started <ChevronRight className="ml-1 h-5 w-5" />
              </Button>
              <Button 
                variant="outline" 
                className="border-finance-gray-300 text-finance-gray-600 hover:bg-finance-gray-100 font-medium px-8 py-6 text-lg"
              >
                Learn More
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 animate-fade-in-right" style={{ animationDelay: '0.9s' }}>
            <div className="relative rounded-xl overflow-hidden shadow-2xl">
              <div className="bg-gradient-to-br from-finance-blue-500 to-finance-blue-700 aspect-video rounded-xl overflow-hidden p-6 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-5 w-full">
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-white font-medium">Portfolio Insights Dashboard</div>
                    <div className="bg-finance-accent text-white text-xs py-1 px-2 rounded">LIVE</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded bg-white/20 h-24 flex flex-col justify-center items-center">
                      <span className="text-white text-sm">Sector Allocation</span>
                      <span className="text-white text-lg font-semibold mt-2">42%</span>
                    </div>
                    <div className="rounded bg-white/20 h-24 flex flex-col justify-center items-center">
                      <span className="text-white text-sm">Performance</span>
                      <span className="text-green-400 text-lg font-semibold mt-2">+7.2%</span>
                    </div>
                    <div className="rounded bg-white/20 h-24 flex flex-col justify-center items-center">
                      <span className="text-white text-sm">Risk Score</span>
                      <span className="text-white text-lg font-semibold mt-2">Moderate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

