
import React from 'react';
import { PieChart, BarChart, TrendingUp, FileText } from 'lucide-react';

const features = [
  {
    title: 'Sector and Stock Decomposition',
    description: 'Break down your portfolio by sectors using GICS classification and analyze individual stock holdings with detailed metrics.',
    icon: <PieChart className="h-6 w-6" />,
    delay: '0.1s'
  },
  {
    title: 'Active vs Benchmark Comparison',
    description: 'Compare your portfolio against standard benchmarks like S&P 500 to identify overweight and underweight positions.',
    icon: <BarChart className="h-6 w-6" />,
    delay: '0.3s'
  },
  {
    title: 'Performance Attribution',
    description: 'Understand which decisions drove your performance with Brinson attribution analysis showing selection and allocation effects.',
    icon: <TrendingUp className="h-6 w-6" />,
    delay: '0.5s'
  },
  {
    title: 'Historical Returns Analysis',
    description: 'Track performance over time with rolling returns and comparative analysis against benchmark indices.',
    icon: <FileText className="h-6 w-6" />,
    delay: '0.7s'
  }
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-finance-gray-100 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="section-title text-center">Powerful Portfolio Analytics</h2>
        <p className="section-subtitle text-center">
          Gain institutional-grade insights to make informed investment decisions
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card animate-slide-in-bottom" 
              style={{ animationDelay: feature.delay }}
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-finance-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-finance-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
