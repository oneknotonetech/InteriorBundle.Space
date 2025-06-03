'use client'

import React, { useState } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import { designThemesData, productBundlesData, budgetRanges } from '@/data/design-theme';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { motion } from 'framer-motion';

const DesignThemesPage = () => {
  const [currentThemeIndex] = useState(0);
  const [ratedCount, setRatedCount] = useState(0);
  const [ratedThemes, setRatedThemes] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({
    roomType: '',
    style: '',
    budget: '',
    colorPreference: '',
    size: ''
  });
  const [calculatorData, setCalculatorData] = useState({
    budget: '',
    style: '',
    roomType: '',
    priority: ''
  });
  // TODO: Type recommendations as ProductBundle[] or similar
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [recommendations, setRecommendations] = useState<any[]>([]);

  const currentTheme = designThemesData[currentThemeIndex];

  const handleRating = (themeIndex: number, rating: number) => {
    if (!ratedThemes.has(themeIndex)) {
      setRatedCount(prev => prev + 1);
      setRatedThemes(prev => new Set([...prev, themeIndex]));
      // Store the rating for future use
      const updatedTheme = { ...currentTheme, rating };
      designThemesData[themeIndex] = updatedTheme;
    }
  }

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculatorChange = (field: string, value: string) => {
    setCalculatorData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateRecommendations = () => {
    let filtered = productBundlesData;

    // Filter by budget
    if (calculatorData.budget) {
      filtered = filtered.filter(bundle => bundle.priceRange === calculatorData.budget);
    }

    // Filter by style/theme
    if (calculatorData.style) {
      filtered = filtered.filter(bundle => 
        bundle.theme.toLowerCase().includes(calculatorData.style.toLowerCase())
      );
    }

    setRecommendations(filtered.slice(0, 3) as typeof recommendations); // Show top 3 recommendations
  };

  return (
    <motion.div className="min-h-screen bg-gray-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Header */}
      <motion.div className="bg-white shadow-sm border-b" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Design Themes</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover your perfect interior style and find matching product bundles tailored to your taste and budget
            </p>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Design Preferences Form */}
        <motion.div className="bg-white rounded-xl shadow-lg p-8 mb-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell Us Your Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <Select value={formData.roomType} onValueChange={v => handleFormChange('roomType', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Room Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="living-room">Living Room</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="kitchen">Kitchen</SelectItem>
                  <SelectItem value="dining-room">Dining Room</SelectItem>
                  <SelectItem value="home-office">Home Office</SelectItem>
                  <SelectItem value="bathroom">Bathroom</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Style</label>
              <Select value={formData.style} onValueChange={v => handleFormChange('style', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="traditional">Traditional</SelectItem>
                  <SelectItem value="scandinavian">Scandinavian</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
                  <SelectItem value="bohemian">Bohemian</SelectItem>
                  <SelectItem value="minimalist">Minimalist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
              <Select value={formData.budget} onValueChange={v => handleFormChange('budget', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Color Preference</label>
              <Select value={formData.colorPreference} onValueChange={v => handleFormChange('colorPreference', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Colors" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="neutral">Neutral Tones</SelectItem>
                  <SelectItem value="bold">Bold & Vibrant</SelectItem>
                  <SelectItem value="pastel">Soft Pastels</SelectItem>
                  <SelectItem value="dark">Dark & Moody</SelectItem>
                  <SelectItem value="earth">Earth Tones</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Size</label>
              <Select value={formData.size} onValueChange={v => handleFormChange('size', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small ( less than 200 sq ft)</SelectItem>
                  <SelectItem value="medium">Medium (200-400 sq ft)</SelectItem>
                  <SelectItem value="large">Large (400-600 sq ft)</SelectItem>
                  <SelectItem value="extra-large">Extra Large (more than 600 sq ft)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Rate Design Themes Section with Carousel */}
        <motion.div className="bg-white rounded-xl shadow-lg p-8 mb-12" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Rate Design Themes</h2>
            <p className="text-gray-600">Help us understand your preferences by rating these design themes</p>
            <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
              <TrendingUp className="w-4 h-4 mr-2" />
              Themes Rated: {ratedCount}
            </div>
          </div>

          <div className="max-w-5xl mx-auto">
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {designThemesData.map((theme, index) => (
                  <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div 
                      className="p-1"
                      initial={{ opacity: 0, y: 20 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`bg-gray-50 rounded-2xl p-6 h-full transition-all duration-300 ${
                        ratedThemes.has(index) ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-lg'
                      }`}>
                        <img 
                          src={theme.image} 
                          alt={theme.name}
                          className="w-full h-48 object-cover rounded-xl mb-4"
                        />
                        <div className="text-lg font-bold text-gray-900 mb-2">{theme.name}</div>
                        <div className="text-gray-600 text-sm mb-3 line-clamp-2">{theme.description}</div>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {theme.colors.slice(0, 3).map((color, colorIndex) => (
                            <span key={colorIndex} className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full">
                              {color}
                            </span>
                          ))}
                          {theme.colors.length > 3 && (
                            <span className="px-2 py-1 bg-gray-300 text-gray-600 text-xs rounded-full">
                              +{theme.colors.length - 3}
                            </span>
                          )}
                        </div>
                        
                        {ratedThemes.has(index) ? (
                          <div className="text-center">
                            <div className="inline-flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                              ✓ Rated
                            </div>
                          </div>
                        ) : (
                          <div className="text-center">
                            <p className="text-xs text-gray-500 mb-2">Rate this theme (1-10)</p>
                            <div className="grid grid-cols-5 gap-1">
                              {[1,2,3,4,5,6,7,8,9,10].map((rating) => (
                                <motion.button
                                  key={rating}
                                  onClick={() => handleRating(index, rating)}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  className="w-8 h-8 text-xs rounded-full border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all duration-200 font-medium cursor-pointer"
                                >
                                  {rating}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        )}
                      </Card>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
            
            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                Swipe or use the arrows to explore all {designThemesData.length} design themes
              </p>
            </div>
          </div>
        </motion.div>

        {/* Choice Calculator */}
        <motion.div className="bg-white rounded-xl shadow-lg p-8" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <Calculator className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Design Choice Calculator</h2>
            <p className="text-gray-600">Get personalized product bundle recommendations based on your preferences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
              <Select value={calculatorData.budget} onValueChange={v => handleCalculatorChange('budget', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map(range => (
                    <SelectItem key={range} value={range}>{range}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Design Style</label>
              <Select value={calculatorData.style} onValueChange={v => handleCalculatorChange('style', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Modern">Modern</SelectItem>
                  <SelectItem value="Traditional">Traditional</SelectItem>
                  <SelectItem value="Scandinavian">Scandinavian</SelectItem>
                  <SelectItem value="Industrial">Industrial</SelectItem>
                  <SelectItem value="Luxury">Luxury</SelectItem>
                  <SelectItem value="Rustic">Rustic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Priority</label>
              <Select value={calculatorData.roomType} onValueChange={v => handleCalculatorChange('roomType', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="living-room">Living Room</SelectItem>
                  <SelectItem value="bedroom">Bedroom</SelectItem>
                  <SelectItem value="complete-home">Complete Home</SelectItem>
                  <SelectItem value="luxury-suite">Luxury Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Priority Factor</label>
              <Select value={calculatorData.priority} onValueChange={v => handleCalculatorChange('priority', v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget-Friendly</SelectItem>
                  <SelectItem value="quality">Premium Quality</SelectItem>
                  <SelectItem value="style">Design Focus</SelectItem>
                  <SelectItem value="complete">Complete Solution</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="text-center mb-8">
            <Button
              onClick={calculateRecommendations}
              className="inline-flex items-center px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <Calculator className="w-5 h-5 mr-2" />
              Calculate Recommendations
            </Button>
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Recommended Product Bundles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((bundle) => (
                  <Card key={bundle.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="text-center mb-4">
                      <div className="text-lg font-bold text-gray-900">{bundle.name}</div>
                      <div className="text-sm text-gray-600 mb-2">{bundle.theme}</div>
                      <div className="text-2xl font-bold text-green-600">{bundle.price}</div>
                    </div>
                    <div className="space-y-2">
                      {bundle.items.map((item: string, index: number) => (
                        <div key={index} className="flex items-center text-sm text-gray-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                          {item}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full mt-4" variant="default">
                      View Bundle
                    </Button>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DesignThemesPage;