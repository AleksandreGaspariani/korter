import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaHeart, FaGlobe, FaMapMarkerAlt, FaPlus } from 'react-icons/fa';

const Header = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sellDropdownOpen, setSellDropdownOpen] = useState(false);
  const [rentDropdownOpen, setRentDropdownOpen] = useState(false);
  const [dailyDropdownOpen, setDailyDropdownOpen] = useState(false);

  return (
    <header className="w-full">
      <style>
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
              {/* შენებადი ბინები dropdown */}
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

              {/* გაყიდვა dropdown */}
              <div className="relative">
                <button
                  className="hover:text-blue-500 flex items-center"
                  onClick={() => setSellDropdownOpen((open) => !open)}
                  onBlur={() => setTimeout(() => setSellDropdownOpen(false), 150)}
                  type="button"
                >
                  გაყიდვა
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {sellDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-20">
                    <Link to="/search/apartments?category=flats&type=sale" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setSellDropdownOpen(false)}>
                      იყიდება ბინები
                    </Link>
                    <Link to="/search/apartments?category=houses&type=sale" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setSellDropdownOpen(false)}>
                      სახლების გაყიდვა
                    </Link>
                    <Link to="/search/apartments?category=commercial&type=sale" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setSellDropdownOpen(false)}>
                      იყიდება კომერციული ფართები
                    </Link>
                    <Link to="/search/apartments?category=office&type=sale" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setSellDropdownOpen(false)}>
                      ოფისის გაყიდვა
                    </Link>
                    <Link to="/search/apartments?category=warehouse&type=sale" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setSellDropdownOpen(false)}>
                      საწყობების გაყიდვა
                    </Link>
                    <Link to="/search/apartments?category=land&type=sale" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setSellDropdownOpen(false)}>
                      ნაკვეთების გაყიდვა
                    </Link>
                    <Link to="/search/apartments?category=garage&type=sale" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setSellDropdownOpen(false)}>
                      გარაჟებისა და პაკინგის გაყიდვა
                    </Link>
                    <Link to="/realtors" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setSellDropdownOpen(false)}>
                      რიელტორები
                    </Link>
                  </div>
                )}
              </div>

              {/* გაქირავება dropdown */}
              <div className="relative">
                <button
                  className="hover:text-blue-500 flex items-center"
                  onClick={() => setRentDropdownOpen((open) => !open)}
                  onBlur={() => setTimeout(() => setRentDropdownOpen(false), 150)}
                  type="button"
                >
                  გაქირავება
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {rentDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-20">
                    <Link to="/search/apartments?category=flats&type=rent" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setRentDropdownOpen(false)}>
                      ქირავდება ბინები
                    </Link>
                    <Link to="/search/apartments?category=houses&type=rent" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setRentDropdownOpen(false)}>
                        ქირავდება სახლები
                    </Link>
                    <Link to="/search/apartments?category=commercial&type=rent" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setRentDropdownOpen(false)}>
                      კომერციული ფართები ქირით
                    </Link>
                    <Link to="/search/apartments?category=office&type=rent" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setRentDropdownOpen(false)}>
                      ოფისების გაქირავება
                    </Link>
                    <Link to="/search/apartments?category=warehouse&type=rent" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setRentDropdownOpen(false)}>
                      საწყობების გაქირავება
                    </Link>
                    <Link to="/search/apartments?category=garage&type=rent" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setRentDropdownOpen(false)}>
                      გარაჟების და პარკინგის გაქირავება
                    </Link>
                    <Link to="/realtors" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setRentDropdownOpen(false)}>
                      რიელტორები
                    </Link>
                  </div>
                )}
              </div>

              {/* დღიურად dropdown */}
              <div className="relative">
                <button
                  className="hover:text-blue-500 flex items-center"
                  onClick={() => setDailyDropdownOpen((open) => !open)}
                  onBlur={() => setTimeout(() => setDailyDropdownOpen(false), 150)}
                  type="button"
                >
                  დღიურად
                  <svg className="ml-1 w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {dailyDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-200 rounded shadow-lg z-20">
                    <Link to="/search/apartments?category=flats&type=daily" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setDailyDropdownOpen(false)}>
                      ბინების დღიურად გაქირავება
                    </Link>
                    <Link to="/search/apartments?category=houses&type=daily" className="block px-4 py-2 hover:bg-blue-50 text-gray-700" onClick={() => setDailyDropdownOpen(false)}>
                        სახლების დღიურად გაქირავება
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right Side - Actions */}
          <div className="flex items-center space-x-4 text-gray-700 text-sm">
            <button className="flex items-center bg-gray-900 text-white px-3 py-1 rounded hover:bg-gray-800">
              <FaPlus className="mr-1" /> დამატება
            </button>
            <Link to='/admin-panel'>
              <button className="bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">შესვლა</button>
            </Link>
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
