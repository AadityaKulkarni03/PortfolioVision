
import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import PortfolioUploader from '@/components/PortfolioUploader';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen w-full">
      <Navbar />
      <Hero />
      <Features />
      <PortfolioUploader />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
