'use client'

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Grid3x3 } from 'lucide-react';

const tabVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn"
    }
  }
};

const iconVariants: Variants = {
  initial: { scale: 0.8, rotate: 0 },
  animate: { 
    scale: 1, 
    rotate: 360,
    transition: {
      duration: 1.2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: 'easeInOut'
    }
  }
};

const FloorPlanTab = () => (
  <motion.div
    variants={tabVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="text-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 max-w-7xl mx-auto"
  >
    {/* Animated Icon */}
    <motion.div
      variants={iconVariants}
      initial="initial"
      animate="animate"
      className="mx-auto mb-4 sm:mb-6 md:mb-8 lg:mb-10 flex items-center justify-center"
    >
      <Grid3x3 className="w-8 h-8 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 text-[var(--color-black)] drop-shadow-lg" />
    </motion.div>

    {/* Main Heading */}
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-lg xs:text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-[var(--color-black)] mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-tight"
    >
      Generate Floor Plans
    </motion.h1>

    {/* Description */}
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-600 mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl mx-auto leading-relaxed"
    >
      Create professional floor plans with AI assistance. Simply describe your space requirements and get instant, customizable floor plan designs ready for visualization.
    </motion.p>

    {/* Feature Cards */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="flex flex-col xs:flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:gap-8 max-w-xs xs:max-w-sm sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto mb-6 sm:mb-8 md:mb-10 lg:mb-12"
    >
      {[
        {
          title: "Smart Layout",
          description: "AI-powered room optimization for maximum space efficiency"
        },
        {
          title: "Custom Dimensions", 
          description: "Specify exact measurements and spatial requirements"
        },
        {
          title: "Export Ready",
          description: "Professional blueprints ready for construction or 3D visualization"
        }
      ].map((feature, index) => (
        <motion.div
          key={feature.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-5 md:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-white/20"
        >
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold text-[var(--color-black)] mb-2 sm:mb-3">
            {feature.title}
          </h3>
          <p className="text-xs sm:text-xs md:text-sm text-gray-600 leading-relaxed">
            {feature.description}
          </p>
        </motion.div>
      ))}
    </motion.div>

    {/* CTA Button */}
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="flex justify-center"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[var(--color-black)] text-[var(--color-white)] cursor-pointer px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-2 xs:py-2.5 sm:py-3 md:py-4 lg:py-5 rounded-lg text-xs sm:text-sm md:text-sm lg:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300"
      >
        Generate Floor Plan
      </motion.button>
    </motion.div>
  </motion.div>
);

const ComingSoon3DVisualizer: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--color-light-gray)] flex flex-col justify-center py-4 xs:py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20 2xl:py-24 px-2 xs:px-4 sm:px-6 md:px-8">
      <FloorPlanTab />
    </div>
  );
};

export default ComingSoon3DVisualizer;