import React from 'react'
import { Link } from 'react-router-dom';

const PromotionalSection = () => {

    const carouselItems = [
        { title: "საცხოვრებელი კომპლექსები", count: "541 მშენებარე", icon: "🏢" },
        { title: "იყიდება ბინები", count: "16 437 ბინა", icon: "📦" },
        { title: "კოტეჯები", count: "24 კოტეჯი", icon: "🏠" },
        { title: "სახლების გაყიდვა", count: "583 სახლი", icon: "🏡" },
        { title: "ქირავდება ბინები", count: "27 445 ბინა", icon: "🛋️" },
        { title: "ქირავდება სახლები", count: "774 სახლი", icon: "🪟" },
    ];

  return (
    <div className="bg-white py-6 px-4 md:px-12">
      {/* Top section */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Left Card */}
        <div className="bg-orange-500 rounded-xl p-6 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="px-8 py-12 z-10 relative">
                <h2 className="text-2xl font-bold mb-4">ახალი აშენებული კომპლექსები და ბინები თბილისში</h2>
                <button className="bg-white text-orange-500 font-semibold py-2 px-4 rounded shadow hover:bg-gray-100 transition">
                    <Link to="/map">რუკაზე ნახვა</Link>
                </button>
            </div>
            <img
                src="https://korter.ge/images/banners/map-banner-illustration.webp"
                alt=""
                className="absolute right-[-60px] bottom-[-40px] w-56 h-56 object-contain pointer-events-none select-none"
                style={{ zIndex: 1 }}
                draggable="false"
            />
        </div>

        {/* Right Card */}
        <div className="bg-gray-50 rounded-xl p-6 flex flex-col justify-between">
            <h2 className="text-lg text-gray-900 font-semibold mb-2">
              გსურთ ბინის, სახლის ან ნაკვეთის გაყიდვა?
            </h2>
            <p className="text-lg text-gray-600 mb-4">
              განათავსეთ უფასოდ ქონება Korter-ზე და სარგებლეთ მომგებიანი მახასიათებლებით
            </p>
            <div className='w-100'>
                <button className="bg-gray-900 text-white py-2 px-4 rounded hover:bg-black transition">
                    + ქონების დამატება
                </button>
            </div>
          </div>
      </div>

      {/* Carousel Section */}
      <div className="relative">
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex space-x-4 px-1 md:px-2">
            {carouselItems.map((item, index) => (
              <div key={index} className="min-w-[190px] bg-white border border-gray-200 rounded-lg shadow-sm p-4 hover:shadow transition">
                <div className="text-3xl mb-2">{item.icon}</div>
                <h4 className="font-semibold text-gray-800 text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gradient mask for disappearing border effect */}
        <div className="pointer-events-none absolute top-0 left-0 w-10 h-full bg-gradient-to-r from-white via-white to-transparent" />
        <div className="pointer-events-none absolute top-0 right-0 w-10 h-full bg-gradient-to-l from-white via-white to-transparent" />
      </div>
    </div>
  )
}

export default PromotionalSection