import React from 'react';


const MarqueeNotice = () => {
  return (
    <div className="bg-gray-800 text-yellow-400 border-b-2 border-orange-500 fixed top-0 w-full py-2 z-50 overflow-hidden">
      <p className="animate-scroll whitespace-nowrap font-bold text-sm">
        🚧 Our site is currently under construction. Some features may not work as expected. Thank you for your patience! 🚧
      </p>
    </div>
  );
};

export default MarqueeNotice;
