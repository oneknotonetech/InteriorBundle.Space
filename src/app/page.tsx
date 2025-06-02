'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroSlides from '@/data/hero-carousel';
import bestsellerBundles from '@/data/best-seller';

const Homepage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-[var(--color-light-gray)]">
      {/* Hero Section with Carousel */}
      <section className="relative bg-[var(--color-cream)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative h-96 bg-[var(--color-light-gray)] rounded-lg overflow-hidden">
            {/* Carousel Images */}
            <div className="relative h-full">
              {heroSlides.map((slide, index) => (
                <motion.div
                  key={slide.id}
                  className={`absolute inset-0 flex items-center justify-center ${
                    index === currentSlide ? 'block' : 'hidden'
                  }`}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: index === currentSlide ? 1 : 0, x: index === currentSlide ? 0 : 100 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-center">
                    <div className="text-6xl font-light text-gray-400 mb-4">{slide.image}</div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">{slide.title}</h2>
                    <p className="text-gray-600">{slide.subtitle}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all"
            >
              <ChevronRight className="h-6 w-6 text-gray-700" />
            </button>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-gray-800' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Bestseller Bundles Section */}
      <section className="py-16 bg-[var(--color-light-gray)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[var(--color-black)] mb-2">Bestseller Bundles</h2>
            <p className="text-[var(--color-warm-gray)]">Discover our most popular interior design collections</p>
          </div>

          {/* Bundles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bestsellerBundles.map((bundle, index) => (
              <motion.div
                key={bundle.id}
                className="bg-white rounded-lg shadow-md overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              >
                {/* Image Placeholder */}
                <div className="h-64 bg-gray-200 flex items-center justify-center relative overflow-hidden">
                  <span className="text-2xl font-light text-gray-400">{bundle.image}</span>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                    {bundle.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">{bundle.price}</span>
                      <span className="text-sm text-gray-500 line-through">{bundle.originalPrice}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-gray-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      View Bundle
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-[var(--color-black)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-[var(--color-cream)] mb-4">
              Ready to Transform Your Space?
            </h2>
            <p className="text-[var(--color-warm-gray)] mb-8 max-w-2xl mx-auto">
              Explore our complete collection of interior design bundles and find the perfect style for your home.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[var(--color-cream)] text-[var(--color-black)] px-8 py-3 rounded-md font-semibold hover:bg-[var(--color-light-gray)] transition-colors"
            >
              Shop All Bundles
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;