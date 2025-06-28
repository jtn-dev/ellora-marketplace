import React from 'react';
import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: { width: 80, height: 80 },
    md: { width: 100, height: 100 },
    lg: { width: 120, height: 120 }
  };

  const { width, height } = sizeClasses[size];

  return (
    <div className={`flex items-center justify-center group`}>
      {/* Logo Image */}
      <div className="relative transition-all duration-500 group-hover:scale-125 flex-shrink-0 cursor-pointer">
        <Image
          src="/images/ellora-logo.png"
          alt="Ellora Logo"
          width={width}
          height={height}
          className="object-contain filter drop-shadow-2xl brightness-110 contrast-110"
          priority
        />
        {/* Subtle glow effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/15 to-green-600/15 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500 -z-10 scale-125"></div>
      </div>
    </div>
  );
};

export default Logo; 