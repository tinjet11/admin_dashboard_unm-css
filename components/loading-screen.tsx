import React, { forwardRef } from 'react';

const LoadingScreen = forwardRef<HTMLDivElement>((_, ref) => (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50 gap-4 hidden" ref={ref}>
      <div className="loader border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
      <p className="mt-4 text-lg text-gray-700">Loading ...</p>
    </div>
));

export default LoadingScreen;
