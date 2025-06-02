'use client'

import { useState, useEffect } from "react";
import React from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  ArrowUpCircle,
  ExternalLink,
  Send
} from "lucide-react";

export default function ModernFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Check if we've scrolled down enough to show back-to-top button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const handleSubscribe = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail("");
      // In a real app, you would send this to your API
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  // Footer links organized by category (match Header.tsx navigation)
  const footerLinks = [
    {
      title: "Navigation",
      links: [
        { name: "Home", href: "/" },
        { name: "Product Bundles", href: "/product-bundles" },
        { name: "Inspirations", href: "/inspiration" },
        { name: "Design Themes", href: "/design-themes" },
        { name: "GenAI Studio", href: "/genai" },
        { name: "3D Visualizer", href: "/visualizer" },
        { name: "Wishlist", href: "/wishlist" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "FAQs", href: "/faq" },
        { name: "Contact Us", href: "/contact" },
        { name: "Shipping & Delivery", href: "/shipping" },
        { name: "Returns & Refunds", href: "/returns" },
        { name: "Track Order", href: "/track-order" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
        { name: "Cookie Policy", href: "/cookie" },
        { name: "Sitemap", href: "/sitemap" },
      ]
    }
  ];

  // Social media links
  const socialLinks = [
    { name: "Facebook", icon: <Facebook size={20} />, href: "#facebook" },
    { name: "Twitter", icon: <Twitter size={20} />, href: "#twitter" },
    { name: "Instagram", icon: <Instagram size={20} />, href: "#instagram" },
    { name: "LinkedIn", icon: <Linkedin size={20} />, href: "#linkedin" },
  ];

  // Contact information (minimal, modern)
  const contactInfo = [
    { 
      icon: <MapPin size={18} />, 
      text: "OneKnotone Technologies LLP",
      href: "https://maps.app.goo.gl/XhWNWm94RFx42uEn9"
    },
    { 
      icon: <Phone size={18} />, 
      text: "+91 9876543210",
      href: "tel:+919876543210"
    },
    { 
      icon: <Mail size={18} />, 
      text: "hello@interiorbundles.space",
      href: "mailto:hello@interiorbundles.space"
    }
  ];

  return (
    <footer className="relative z-10 bg-white text-black border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-8">
          {/* Logo and description */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="text-2xl font-bold tracking-wider mb-4 flex items-center space-x-3">
                <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">I</span>
                </div>
                <span className="text-xl font-bold text-black">InteriorBundles.Space</span>
              </div>
              <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
                Creating beautiful spaces with curated interior bundles designed by professionals. Transform your home with our carefully selected collections.
              </p>
            </motion.div>
            {/* Newsletter form */}
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h4 className="text-lg font-semibold mb-3 text-black">Stay Updated</h4>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubscribe(e)}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-black focus:ring-2 focus:ring-black focus:ring-opacity-20 transition-all duration-200 text-black placeholder-gray-400"
                    required
                  />
                </div>
                <motion.button 
                  onClick={handleSubscribe}
                  className="px-6 py-3 bg-black text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap hover:bg-gray-800"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send size={16} />
                  Subscribe
                </motion.button>
              </div>
              {subscribed && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-green-600 text-sm mt-3 flex items-center gap-2"
                >
                  ✓ Thanks for subscribing!
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Links sections */}
          {footerLinks.slice(0, 2).map((section, sectionIndex) => (
            <motion.div 
              key={section.title} 
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * (sectionIndex + 1) }}
            >
              <h4 className="font-semibold text-black mb-4 text-lg">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <motion.li 
                    key={link.name}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <a 
                      href={link.href} 
                      className="text-gray-600 hover:text-black transition-colors duration-200 text-sm block py-1"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
          {/* Legal and Get in Touch side by side */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Legal */}
            <motion.div 
              key={footerLinks[2].title} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h4 className="font-semibold text-black mb-4 text-lg">{footerLinks[2].title}</h4>
              <ul className="space-y-3">
                {footerLinks[2].links.map((link) => (
                  <motion.li 
                    key={link.name}
                    whileHover={{ x: 4 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <a 
                      href={link.href} 
                      className="text-gray-600 hover:text-black transition-colors duration-200 text-sm block py-1"
                    >
                      {link.name}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
            {/* Get in Touch */}
            <motion.div 
              key="get-in-touch"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="font-semibold text-black mb-4 text-lg">Get in Touch</h4>
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-black flex-shrink-0">{item.icon}</span>
                    <a 
                      href={item.href}
                      className="text-gray-600 hover:text-black transition-colors duration-200 text-sm"
                      target={item.href.startsWith('http') ? "_blank" : "_self"}
                      rel={item.href.startsWith('http') ? "noopener noreferrer" : ""}
                    >
                      {item.text}
                      {item.href.startsWith('http') && (
                        <ExternalLink size={12} className="inline-block ml-1" />
                      )}
                    </a>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          {/* Bottom footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <motion.div 
              className="text-sm text-gray-500"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              &copy; {new Date().getFullYear()} InteriorBundles.Space. All rights reserved.
            </motion.div>
            {/* Social links */}
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="text-gray-600 hover:text-black transition-colors duration-200 p-2 bg-white rounded-lg hover:bg-gray-100"
                  whileHover={{ y: -3, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  aria-label={social.name}
                  title={social.name}
                >
                  {social.icon}
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
      {/* Back to top button */}
      <AnimatedBackToTop isVisible={isVisible} onClick={scrollToTop} />
    </footer>
  );
}

// Animated back-to-top button component
function AnimatedBackToTop({ isVisible, onClick }: { isVisible: boolean; onClick: () => void }) {
  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50"
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        scale: isVisible ? 1 : 0.5,
        y: isVisible ? 0 : 20
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <motion.button
        onClick={onClick}
        className="bg-white text-black border border-gray-300 hover:bg-gray-100 hover:text-black rounded-full w-12 h-12 shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Scroll to top"
      >
        <ArrowUpCircle size={24} />
      </motion.button>
    </motion.div>
  );
}