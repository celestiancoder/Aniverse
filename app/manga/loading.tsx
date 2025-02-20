import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center gap-4">
        
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full" />
          <div className="absolute inset-0 border-4 border-t-purple-500 rounded-full animate-spin" />
        </div>
        
       
        <div className="text-white text-xl font-medium flex items-center gap-1">
          <span className="animate-bounce delay-0">L</span>
          <span className="animate-bounce delay-75">o</span>
          <span className="animate-bounce delay-100">a</span>
          <span className="animate-bounce delay-150">d</span>
          <span className="animate-bounce delay-200">i</span>
          <span className="animate-bounce delay-300">n</span>
          <span className="animate-bounce delay-400">g</span>
          <span className="animate-bounce delay-500">.</span>
          <span className="animate-bounce delay-600">.</span>
          <span className="animate-bounce delay-700">.</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;