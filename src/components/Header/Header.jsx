import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHeart, FaGlobe, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="w-full">
      <style jsx>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playwrite+AU+QLD:wght@100..400&family=Playwrite+HU:wght@100..400&display=swap');
        `}
      </style>
      {/* Blue Top Strip */}
      <marquee className="bg-blue-500 text-white text-sm py-1 px-4 flex">
        <div className='flex items-center space-x-2 py-4'>
            <img src="../../public/vite.svg" alt="Icon" className="" /> 
            <span className='text-2xl'>ყველაზე ფართო უძრავი ქონების ბაზა. დეტალურად!</span>
        </div>
      </marquee>

      {/* Main Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left Side - Logo and Menu */}
          <div className="flex items-center space-x-6">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center space-x-1 text-black font-bold text-xl">
              <div className="bg-blue-500 w-6 h-6 flex items-center justify-center rounded-sm">
                <span className="text-white text-sm font-bold">↗</span>
              </div>
              <span style={{ fontFamily: 'Playwrite AU QLD' }}>Homeinfo</span>
            </Link>

            {/* Menu Links */}
            <nav className="hidden md:flex space-x-4 text-sm text-gray-700 relative">
              <div className="relative">
                <button
                  className="hover:text-blue-500 flex items-center"
                  onClick={() => setDropdownOpen((open) => !open)}
                  onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
                  type="button"
                >
                  შენებადი ბინები
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-20">
                    <Link
                      to="new-buildings"
                      className="block px-4 py-2 hover:bg-blue-50 text-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      მშენებარე ბინები თბილისში
                    </Link>
                    <Link
                      to="/developers"
                      className="block px-4 py-2 hover:bg-blue-50 text-gray-700"
                      onClick={() => setDropdownOpen(false)}
                    >
                      დეველოპერები
                    </Link>
                  </div>
                )}
              </div>
              <Link to="/secondary" className="hover:text-blue-500">გაყიდვა</Link>
              <Link to="/rent" className="hover:text-blue-500">გაქირავება</Link>
              <Link to="/daily" className="hover:text-blue-500">დღიურად</Link>
              <Link to="/mortgage" className="hover:text-blue-500">იპოთეკა</Link>
            </nav>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-4 text-gray-700 text-sm">
            <button className="flex items-center bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-800">
              <FaPlus className="mr-1" /> დამატება
            </button>
            <button className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">შესვლა</button>
            <FaHeart className="cursor-pointer hover:text-blue-500" />
            <FaGlobe className="cursor-pointer hover:text-blue-500" />
            <div className="flex items-center space-x-1">
              <FaMapMarkerAlt />
              <span>თბილისი</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
