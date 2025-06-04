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
    className="text-center"
  >
    <motion.div
      variants={iconVariants}
      initial="initial"
      animate="animate"
      className="mx-auto mb-8 flex items-center justify-center"
    >
      <Grid3x3 className="w-24 h-24 text-[var(--color-black)] drop-shadow-lg" />
    </motion.div>
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-5xl font-bold text-[var(--color-black)] mb-4"
    >
      Generate Floor Plans
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-xl text-gray-600 mb-8 max-w-xl mx-auto"
    >
      Create professional floor plans with AI assistance. Simply describe your space requirements and get instant, customizable floor plan designs ready for visualization.
    </motion.p>
    <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-[var(--color-black)] mb-2">Smart Layout</h3>
        <p className="text-sm text-gray-600">AI-powered room optimization for maximum space efficiency</p>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-[var(--color-black)] mb-2">Custom Dimensions</h3>
        <p className="text-sm text-gray-600">Specify exact measurements and spatial requirements</p>
      </div>
      <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-[var(--color-black)] mb-2">Export Ready</h3>
        <p className="text-sm text-gray-600">Professional blueprints ready for construction or 3D visualization</p>
      </div>
    </div>
    <div className="flex justify-center mt-8">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="bg-[var(--color-black)] text-[var(--color-white)]  cursor-pointer px-8 py-3 rounded-md font-semibold"
      >
        Generate Floor Plan
      </motion.button>
    </div>
  </motion.div>
);

const ComingSoon3DVisualizer: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--color-light-gray)] flex flex-col justify-center">
      <FloorPlanTab />
    </div>
  );
};

export default ComingSoon3DVisualizer;