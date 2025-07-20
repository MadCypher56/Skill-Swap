import React from 'react';

export default function SkeletonLoader({ type = 'card', count = 1 }) {
  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="glass rounded-xl p-6 animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full w-3/4 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full w-1/2 animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full animate-pulse"></div>
              <div className="h-3 bg-gradient-to-r from-blue-500/20 to-green-500/20 rounded-full w-5/6 animate-pulse"></div>
              <div className="h-3 bg-gradient-to-r from-pink-500/20 to-blue-500/20 rounded-full w-4/6 animate-pulse"></div>
            </div>
          </div>
        );
      case 'list':
        return (
          <div className="glass rounded-lg p-4 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full w-1/2 mb-2 animate-pulse"></div>
                <div className="h-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full w-3/4 animate-pulse"></div>
              </div>
            </div>
          </div>
        );
      case 'stats':
        return (
          <div className="glass rounded-xl p-6 animate-pulse">
            <div className="h-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full w-1/2 mb-2 animate-pulse"></div>
            <div className="h-8 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-full w-1/3 animate-pulse"></div>
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