import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gray-300 rounded"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              <div className="h-3 bg-gray-300 rounded w-4/6"></div>
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="bg-white p-4 rounded-lg shadow-md animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
} 