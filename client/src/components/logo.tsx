import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon - Gradient rounded square with 3D cube */}
      <div className={`${sizeClasses[size]} bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg`}>
        <svg 
          viewBox="0 0 24 24" 
          className="w-5/6 h-5/6"
          fill="none" 
          stroke="white" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* 3D Cube - Isometric view with cleaner lines */}
          {/* Top face */}
          <path d="M6 8L14 8L18 12L10 12L6 8Z" />
          {/* Front face */}
          <path d="M6 8L6 16L10 20L10 12L6 8Z" />
          {/* Right face */}
          <path d="M14 8L14 16L10 20L10 12L14 8Z" />
          {/* Vertical edges for depth */}
          <path d="M6 8L14 8" />
          <path d="M6 16L14 16" />
          <path d="M10 12L10 20" />
        </svg>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <h1 className={`font-bold text-black ${textSizes[size]}`}>
          FedPack
        </h1>
      )}
    </div>
  );
}
