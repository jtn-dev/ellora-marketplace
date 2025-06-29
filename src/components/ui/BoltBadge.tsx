'use client';

import React from 'react';

const BoltBadge = () => {
  const handleAnimationEnd = (e: React.AnimationEvent<HTMLImageElement>) => {
    const target = e.target as HTMLElement;
    target.classList.add('animated');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <a 
        href="https://bolt.new/?rid=os72mi" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="block transition-all duration-300 hover:shadow-2xl"
      >
        <img 
          src="https://storage.bolt.army/white_circle_360x360.png" 
          alt="Built with Bolt.new badge" 
          className="w-20 h-20 md:w-28 md:h-28 rounded-full shadow-lg bolt-badge bolt-badge-intro"
          onAnimationEnd={handleAnimationEnd}
        />
      </a>
    </div>
  );
};

export default BoltBadge;