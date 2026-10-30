import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  logoUrl?: string;
}

export default function Logo({ className = '', size = 80, logoUrl }: LogoProps) {
  const finalSrc = logoUrl && logoUrl.trim() !== '' ? logoUrl : '/icon.svg';

  return (
    <img
      src={finalSrc}
      alt="আদর্শ শিশু কানন স্কুল লোগো"
      width={size}
      height={size}
      className={`object-contain rounded-full select-none transition-transform hover:scale-105 duration-300 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      onError={(e) => {
        // Fallback to svg icon if custom URL fails to load
        const img = e.currentTarget as HTMLImageElement;
        if (!img.src.endsWith('/icon.svg')) {
          img.src = '/icon.svg';
        }
      }}
    />
  );
}
