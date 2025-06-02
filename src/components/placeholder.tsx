'use client';

import React from 'react';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  text?: string;
  className?: string;
  bgColor?: string;
  textColor?: string;
}

export const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  width = 400,
  height = 300,
  text,
  className = '',
  bgColor = '#e5e7eb', // Tailwind gray-200
  textColor = '#9ca3af', // Tailwind gray-400
}) => {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: bgColor,
        color: textColor,
        fontSize: '1rem',
        fontWeight: 500,
        position: 'relative',
      }}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
        {text || `${width} × ${height}`}
      </div>
    </div>
  );
};

export default PlaceholderImage;