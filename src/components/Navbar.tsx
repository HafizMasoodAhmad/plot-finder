'use client';

import { useState } from 'react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo - Left side */}
        <div className="flex items-center">
          <div className="relative">
            {/* Circular decorative elements */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-2 border-teal-700 rounded-full opacity-30"></div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-2 border-orange-500 rounded-full opacity-30"></div>
            
            {/* Logo text */}
            <div className="text-2xl font-bold">
              <span className="text-teal-700">Plot</span>
              <span className="text-orange-500">finder</span>
            </div>
          </div>
        </div>

        {/* Right side - Search and Menu */}
        {/* <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Enter town, county or postcode"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent placeholder-gray-400"
            />
            <button className="ml-2 p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div> */}
      </div>
    </nav>
  );
}
