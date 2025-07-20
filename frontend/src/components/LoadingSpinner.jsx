import React from 'react';

export default function LoadingSpinner({ size = 'md', text = 'Loading...' }) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  return (
    <div className="flex justify-center items-center min-h-64">
      <div className="text-center">
        <div className="relative">
          <div className={`${sizeClasses[size]} mx-auto mb-4`}>
            <div className="absolute inset-0 rounded-full border-4 border-blue-500/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin-glow"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
          </div>
        </div>
        <p className="text-gray-300 font-medium">{text}</p>
        <div className="flex justify-center space-x-1 mt-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
}