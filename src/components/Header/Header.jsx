import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHeart, FaGlobe, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="w-full">
      {/* Orange Top Strip */}
      <marquee className="bg-orange-500 text-white text-sm py-1 px-4 flex">
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
            <Link to="/" className="flex items-center space-x-1 text-black font-bold text-xl">
              <div className="bg-orange-500 w-6 h-6 flex items-center justify-center rounded-sm">
                <span className="text-white text-sm font-bold">↗</span>
              </div>
              <span>korter</span>
            </Link>

            {/* Menu Links */}
            <nav className="hidden md:flex space-x-4 text-sm text-gray-700">
              <Link to="/new-buildings" className="hover:text-orange-500">შენებადი ბინები</Link>
              <Link to="/secondary" className="hover:text-orange-500">გაყიდვა</Link>
              <Link to="/rent" className="hover:text-orange-500">გაქირავება</Link>
              <Link to="/daily" className="hover:text-orange-500">დღიურად</Link>
              <Link to="/mortgage" className="hover:text-orange-500">იპოთეკა</Link>
              <Link to="/dashboard" className="hover:text-orange-500">მთავარი</Link>
            </nav>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-4 text-gray-700 text-sm">
            <button className="flex items-center bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-800">
              <FaPlus className="mr-1" /> დამატება
            </button>
            <button className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">შესვლა</button>
            <FaHeart className="cursor-pointer hover:text-orange-500" />
            <FaGlobe className="cursor-pointer hover:text-orange-500" />
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
