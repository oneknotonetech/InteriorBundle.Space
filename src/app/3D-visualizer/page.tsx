'use client'

import React from 'react';
import { motion } from 'framer-motion';
import { Box } from 'lucide-react';

const ComingSoon3DVisualizer: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--color-light-gray)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center bg-[var(--color-cream)] relative">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center mt-24"
        >
          <motion.div
            initial={{ scale: 0.8, rotate: 0 }}
            animate={{ scale: 1, rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
            className="mx-auto mb-8 flex items-center justify-center"
          >
            <Box className="w-24 h-24 text-[var(--color-black)] drop-shadow-lg" />
          </motion.div>
          <h1 className="text-5xl font-bold text-[var(--color-black)] mb-4">3D Visualizer</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
            Our immersive 3D Visualizer is launching soon! Experience your dream interiors in interactive 3D, customize layouts, and bring your vision to life. Stay tuned for a revolutionary way to design your space.
          </p>
        </motion.div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-[var(--color-black)]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-[var(--color-cream)] mb-4">
              Be the First to Know
            </h2>
            <p className="text-[var(--color-warm-gray)] mb-8 max-w-2xl mx-auto">
              Sign up for updates and get notified as soon as our 3D Visualizer goes live. Transform your design process with cutting-edge technology!
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[var(--color-cream)] text-[var(--color-black)] px-8 py-3 rounded-md font-semibold hover:bg-[var(--color-light-gray)] transition-colors"
            >
              Notify Me
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ComingSoon3DVisualizer;
