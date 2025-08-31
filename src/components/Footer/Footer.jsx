"use client"

import { Link } from "react-router-dom"
import { ChevronDown, Instagram, Facebook } from "lucide-react"
import { useState } from "react"

const Footer = () => {
  const [languageOpen, setLanguageOpen] = useState(false)
  const [currencyOpen, setCurrencyOpen] = useState(false)

  const companyLinks = [
    { title: "Homeinfo-ის შესახებ", link: "/about" },
    { title: "Homeinfo საპორტი", link: "/support" },
    { title: "Homeinfo-თან დაკავშირება", link: "/contact" },
    // { title: "გაუნიერი Homeinfo-ში", link: "/join", badge: "ახალი" },
    // { title: "სახლის ყიდვის ნებართვა", link: "/license" },
  ]

  const legalLinks = [
    { title: "გამოყენების პირობა", link: "/terms" },
    { title: "კუკიები cookies", link: "/cookies" },
    { title: "კონფიდენციალობის პოლიტიკა", link: "/privacy" },
    // { title: "გამოყენების პირობები", link: "/usage-terms" },
    // { title: "გამოყენების პირობები", link: "/additional-terms" },
  ]

  return (
    <footer className="bg-white border-t border-gray-200">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Playwrite+AU+QLD:wght@100..400&display=swap');
        `}
      </style>
      <div className="mx-auto px-4 py-8 md:px-12 max-w-7xl">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {/* Logo and Selectors */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">↗</span>
              </div>
              <Link to={'/dashboard'}>
                <span className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Playwrite AU QLD' }}>Homeinfo</span>
              </Link>
            </div>

            {/* Language Selector */}
            <div className="mb-4">
              <div className="relative">
                <button
                  onClick={() => setLanguageOpen(!languageOpen)}
                  className="flex items-center w-full p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors duration-200"
                >
                  <span className="text-2xl mr-3">🇬🇪</span>
                  <span className="text-gray-700 font-medium">საქართველო</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-auto transition-transform duration-200 ${languageOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {languageOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button className="flex items-center w-full p-3 hover:bg-gray-50 transition-colors">
                      <span className="text-2xl mr-3">🇺🇸</span>
                      <span className="text-gray-700">English</span>
                    </button>
                    <button className="flex items-center w-full p-3 hover:bg-gray-50 transition-colors">
                      <span className="text-2xl mr-3">🇷🇺</span>
                      <span className="text-gray-700">Русский</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Currency Selector */}
            <div className="mb-6">
              <div className="relative">
                <button
                  onClick={() => setCurrencyOpen(!currencyOpen)}
                  className="flex items-center w-full p-3 border border-gray-300 rounded-lg hover:border-blue-500 transition-colors duration-200"
                >
                  <span className="text-gray-700 font-medium">GE ქართული</span>
                  <ChevronDown
                    className={`w-4 h-4 ml-auto transition-transform duration-200 ${currencyOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {currencyOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button className="flex items-center w-full p-3 hover:bg-gray-50 transition-colors">
                      <span className="text-gray-700">USD დოლარი</span>
                    </button>
                    <button className="flex items-center w-full p-3 hover:bg-gray-50 transition-colors">
                      <span className="text-gray-700">EUR ევრო</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">კომპანია</h3>
            <ul className="space-y-3">
              {companyLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.link}
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200"
                  >
                    <span>{link.title}</span>
                    {link.badge && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">იურიდიული</h3>
            <ul className="space-y-3">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link to={link.link} className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Only (removed app download section) */}
          <div className="lg:col-span-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">სოციალური ქსელები</h3>
            <div className="flex space-x-4 mb-6">
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-100 hover:text-blue-600 transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">© homeinfo.ge 2018 — 2025</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/map" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
                საიტის რუკა
              </Link>
              <Link to="/rss" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">
                RSS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
              