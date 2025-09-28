"use client"

import { useEffect } from "react"
import { FaHome, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaUsers, FaAward, FaHandshake } from "react-icons/fa"

export default function AboutUs() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHome className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">ჩვენს შესახებ</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto text-pretty">
            Homeinfo - თქვენი სანდო პარტნიორი უძრავი ქონების სფეროში
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Company Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Homeinfo</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-pretty">
              ჩვენი კომპანია სპეციალიზირებულია უძრავი ქონების სფეროში და გთავაზობთ სრულ სპექტრს სერვისებს. ჩვენ
              ვეხმარებით კლიენტებს იპოვონ სრულყოფილი სახლი ან გაყიდონ თავიანთი ქონება საუკეთესო ფასად.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center p-6 bg-blue-50 rounded-xl">
              <FaUsers className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">500+</h3>
              <p className="text-gray-600">კმაყოფილი კლიენტი</p>
            </div>
            <div className="text-center p-6 bg-indigo-50 rounded-xl">
              <FaAward className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">10+</h3>
              <p className="text-gray-600">წლიანი გამოცდილება</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <FaHandshake className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">1000+</h3>
              <p className="text-gray-600">წარმატებული გარიგება</p>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">ჩვენი სერვისები</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaHome className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">ქონების ყიდვა</h3>
                <p className="text-gray-600">ვეხმარებით იპოვოთ თქვენი ოცნების სახლი ან ბინა საუკეთესო ლოკაციაზე</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaHandshake className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">ქონების გაყიდვა</h3>
                <p className="text-gray-600">გაყიდეთ თქვენი ქონება სწრაფად და მაქსიმალურ ფასად</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaUsers className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">კონსულტაცია</h3>
                <p className="text-gray-600">პროფესიონალური რჩევები უძრავი ქონების ინვესტიციებში</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaAward className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">შეფასება</h3>
                <p className="text-gray-600">ზუსტი ბაზრის ღირებულების განსაზღვრა თქვენი ქონებისთვის</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">დაგვიკავშირდით</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaPhone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ტელეფონი</h3>
              <p className="text-gray-600">+995 555 123 456</p>
              <p className="text-gray-600">+995 555 789 012</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">ელ-ფოსტა</h3>
              <p className="text-gray-600">info@homeinfo.ge</p>
              <p className="text-gray-600">sales@homeinfo.ge</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaMapMarkerAlt className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">მისამართი</h3>
              <p className="text-gray-600">რუსთაველის გამზირი 25</p>
              <p className="text-gray-600">თბილისი, საქართველო</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaClock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">სამუშაო საათები</h3>
              <p className="text-gray-600">ორშ-პარ: 9:00-18:00</p>
              <p className="text-gray-600">შაბ: 10:00-16:00</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHome className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Homeinfo</h3>
          <p className="text-gray-400 mb-4">თქვენი სანდო პარტნიორი უძრავი ქონების სფეროში</p>
          <p className="text-sm text-gray-500">© 2024 Homeinfo. ყველა უფლება დაცულია.</p>
        </div>
      </div>
    </div>
  )
}
