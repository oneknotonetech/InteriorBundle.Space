'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu,
  Heart,
  X
} from 'lucide-react';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Product Bundles', href: '/product-bundles' },
  { label: 'Inspirations', href: '/inspiration' },
  { label: 'Design Themes', href: '/design-themes' },
  { label: 'GenAI Studio', href: '/gen-ai-studio' },
  { label: 'Visualizer', href: '/3D-visualizer' },
  { label: 'Wishlist', href: '/wishlist' },
];

const Header: React.FC = React.memo(() => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'var(--color-white)',
        boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
        borderBottom: '1px solid var(--color-gray)',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Three-column flex layout with perfect centering */}
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-20">
          {/* Left column: Logo/Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--color-black)' }}
              >
                <span className="text-white font-bold text-xl">I</span>
              </div>
              <div className="hidden sm:block truncate">
                <span
                  className="text-xl font-bold transition-colors group-hover:text-[var(--color-gray)]"
                  style={{ color: 'var(--color-black)' }}
                >
                  InteriorBundles.Space
                </span>
                <div className="text-xs" style={{ color: 'var(--color-black)' }}>
                  By OneKnotOne Technologies LLP
                </div>
              </div>
            </Link>
          </div>

          {/* Center column: Navigation (perfectly centered) */}
          <nav className="hidden lg:flex items-center justify-center space-x-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium px-2 py-1 rounded transition-colors whitespace-nowrap hover:text-[var(--color-gray)] ${isActive ? 'bg-[var(--color-gray)] text-[var(--color-black)] font-bold' : ''}`}
                  style={{
                    color: 'var(--color-black)',
                    borderRadius: '0.5rem',
                  }}
                  onClick={() => setShowMobileMenu(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right column: Actions */}
          <div className="flex items-center justify-end space-x-2">
            {/* Search */}
            {/* <div className="hidden md:flex relative">
              <input
                type="text"
                placeholder="Search furniture, decor, styles..."
                className="w-56 py-2 px-4 pr-10 rounded-md text-sm"
                style={{
                  background: 'var(--color-white)',
                  color: 'var(--color-black)',
                  border: '1px solid var(--color-gray)',
                }}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-gray)' }} />
            </div> */}
            {/* Wishlist */}
            <Link href="/wishlist" className="relative group p-2 rounded hover:bg-[var(--color-gray)] transition">
              <Heart className="w-5 h-5" style={{ color: 'var(--color-black)' }} />
            </Link>
            {/* Cart */}
            <Link href="/cart" className="relative group p-2 rounded hover:bg-[var(--color-gray)] transition">
              <ShoppingCart className="w-5 h-5" style={{ color: 'var(--color-black)' }} />
            </Link>
           
            {/* User/Login */}
            <Link href="/auth/profile-page" className="group p-2 rounded hover:bg-[var(--color-gray)] transition">
              <User className="w-5 h-5" style={{ color: 'var(--color-black)' }} />
            </Link>
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded hover:bg-[var(--color-gray)] transition"
              onClick={() => setShowMobileMenu(true)}
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" style={{ color: 'var(--color-black)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Custom Mobile Menu (replacing Radix UI Dialog) */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            {/* Backdrop/Overlay */}
            <motion.div 
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileMenu(false)}
            />
            
            {/* Menu Panel */}
            <motion.div 
              className="fixed right-0 top-0 h-full w-[300px] bg-[var(--color-white)] shadow-lg z-50 overflow-auto"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold" style={{ color: 'var(--color-black)' }}>Menu</h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-1"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    <X className="w-5 h-5" style={{ color: 'var(--color-gray)' }} />
                  </motion.button>
                </div>
                
                {/* Mobile Search */}
                <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search furniture, decor..."
                    className="w-full py-2 px-4 pr-10 border rounded-md focus:outline-none text-sm"
                    style={{
                      background: 'var(--color-white)',
                      color: 'var(--color-black)',
                      border: '1px solid var(--color-gray)',
                    }}
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: 'var(--color-gray)' }} />
                </div>
                
                {/* Mobile Navigation */}
                <nav className="space-y-3">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="block w-full text-left py-2 transition-colors text-sm hover:text-[var(--color-gray)]"
                      style={{ color: 'var(--color-black)' }}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;