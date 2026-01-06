'use client';

import React, { useRef, useState, useEffect } from 'react';

export const MouseBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.07), transparent 40%)`,
        }}
      />
      <div 
         className="absolute top-[-50%] left-[-50%] h-[200%] w-[200%] animate-spin-slow opacity-10"
         style={{
            background: 'conic-gradient(from 0deg at 50% 50%, transparent 0deg, rgba(168, 85, 247, 0.1) 180deg, transparent 360deg)',
            animationDuration: '20s',
            pointerEvents: 'none'
         }}
      />
    </div>
  );
};
