import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  logoUrl?: string;
}

export default function Logo({ className = '', size = 80, logoUrl }: LogoProps) {
  if (!logoUrl || logoUrl.trim() === '') {
    return null;
  }

  return (
    <img
      src={logoUrl}
      alt="আদর্শ শিশু কানন স্কুল লোগো"
      width={size}
      height={size}
      className={`object-cover rounded-full select-none transition-transform hover:scale-105 duration-300 ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    />
  );
}
