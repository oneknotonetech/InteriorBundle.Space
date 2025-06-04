'use client'

import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Home, Building2, Building } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const InteriorTab = () => (
  <motion.div
    variants={tabVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="text-center mt-24"
  >
    <motion.div
      variants={iconVariants}
      initial="initial"
      animate="animate"
      className="mx-auto mb-8 flex items-center justify-center"
    >
      <Home className="w-24 h-24 text-[var(--color-black)] drop-shadow-lg" />
    </motion.div>
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-5xl font-bold text-[var(--color-black)] mb-4"
    >
      Interior 3D Visualizer
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-xl text-gray-600 mb-8 max-w-xl mx-auto"
    >
      Experience your dream interiors in interactive 3D, customize layouts, and bring your vision to life. Stay tuned for a revolutionary way to design your space.
    </motion.p>
  </motion.div>
);

const ExteriorTab = () => (
  <motion.div
    variants={tabVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="text-center mt-24"
  >
    <motion.div
      variants={iconVariants}
      initial="initial"
      animate="animate"
      className="mx-auto mb-8 flex items-center justify-center"
    >
      <Building2 className="w-24 h-24 text-[var(--color-black)] drop-shadow-lg" />
    </motion.div>
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-5xl font-bold text-[var(--color-black)] mb-4"
    >
      Exterior 3D Visualizer
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-xl text-gray-600 mb-8 max-w-xl mx-auto"
    >
      Visualize your dream home&apos;s exterior in stunning 3D. Experiment with different architectural styles, materials, and landscaping options.
    </motion.p>
  </motion.div>
);

const CommercialTab = () => (
  <motion.div
    variants={tabVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="text-center mt-24"
  >
    <motion.div
      variants={iconVariants}
      initial="initial"
      animate="animate"
      className="mx-auto mb-8 flex items-center justify-center"
    >
      <Building className="w-24 h-24 text-[var(--color-black)] drop-shadow-lg" />
    </motion.div>
    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="text-5xl font-bold text-[var(--color-black)] mb-4"
    >
      Commercial 3D Visualizer
    </motion.h1>
    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="text-xl text-gray-600 mb-8 max-w-xl mx-auto"
    >
      Design and visualize commercial spaces in 3D. Perfect for offices, retail spaces, and commercial buildings.
    </motion.p>
  </motion.div>
);

const ComingSoon3DVisualizer: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--color-light-gray)] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center bg-[var(--color-cream)] relative">
        <Tabs defaultValue="interior" className="w-full max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/80 backdrop-blur-sm shadow-lg">
              <TabsTrigger value="interior" className="flex items-center gap-2 data-[state=active]:bg-[var(--color-cream)] data-[state=active]:text-[var(--color-black)]">
                <Home className="w-4 h-4" />
                Interior
              </TabsTrigger>
              <TabsTrigger value="exterior" className="flex items-center gap-2 data-[state=active]:bg-[var(--color-cream)] data-[state=active]:text-[var(--color-black)]">
                <Building2 className="w-4 h-4" />
                Exterior
              </TabsTrigger>
              <TabsTrigger value="commercial" className="flex items-center gap-2 data-[state=active]:bg-[var(--color-cream)] data-[state=active]:text-[var(--color-black)]">
                <Building className="w-4 h-4" />
                Commercial
              </TabsTrigger>
            </TabsList>
          </motion.div>
          <AnimatePresence mode="wait">
            <TabsContent value="interior" key="interior">
              <InteriorTab />
            </TabsContent>
            <TabsContent value="exterior" key="exterior">
              <ExteriorTab />
            </TabsContent>
            <TabsContent value="commercial" key="commercial">
              <CommercialTab />
            </TabsContent>
          </AnimatePresence>
        </Tabs>
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
