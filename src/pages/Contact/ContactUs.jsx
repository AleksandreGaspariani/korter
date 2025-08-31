"use client"

import { useState, useEffect } from "react"
import {
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaPaperPlane,
  FaUser,
  FaComments,
} from "react-icons/fa"

const ContactUs = () => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [])

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: "",
    message: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  }

  const openWhatsApp = () => {
    const phoneNumber = "+995555123456" // Replace with actual WhatsApp number
    const message = "გამარჯობა! მაინტერესებს თქვენი სერვისები." // Hello! I'm interested in your services.
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-blue-300 from-primary to-secondary text-white py-16 px-4 shadow-lg rounded-b-3xl">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance drop-shadow-lg">
            დაგვიკავშირდით
          </h1>
          <p className="text-xl md:text-2xl opacity-95 text-pretty drop-shadow">
            ჩვენ აქ ვართ თქვენი უძრავი ქონების საჭიროებების დასაკმაყოფილებლად
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Methods */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">საკონტაქტო ინფორმაცია</h2>
              <p className="text-muted-foreground text-lg mb-8">აირჩიეთ თქვენთვის მოსახერხებელი კომუნიკაციის გზა</p>
            </div>

            {/* WhatsApp */}
            <div
              onClick={openWhatsApp}
              className="bg-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-border hover:border-primary group"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-green-500 text-white p-4 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <FaWhatsapp className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground">WhatsApp</h3>
                  <p className="text-muted-foreground">+995 555 123 456</p>
                  <p className="text-sm text-primary font-medium">დააჭირეთ ჩატის გასახსნელად</p>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <div className="flex items-center space-x-4">
                <div className="bg-primary text-primary-foreground p-4 rounded-full">
                  <FaPhone className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground">ტელეფონი</h3>
                  <a href="tel:+995555123456" className="text-muted-foreground hover:text-primary transition-colors">
                    +995 555 123 456
                  </a>
                  <p className="text-sm text-muted-foreground">ორშაბათი - პარასკევი: 9:00 - 18:00</p>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <div className="flex items-center space-x-4">
                <div className="bg-secondary text-secondary-foreground p-4 rounded-full">
                  <FaEnvelope className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground">ელ-ფოსტა</h3>
                  <a
                    href="mailto:info@homeinfo.ge"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    info@homeinfo.ge
                  </a>
                  <p className="text-sm text-muted-foreground">24 საათის განმავლობაში პასუხი</p>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <div className="flex items-center space-x-4">
                <div className="bg-accent text-accent-foreground p-4 rounded-full">
                  <FaMapMarkerAlt className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground">მისამართი</h3>
                  <p className="text-muted-foreground">რუსთაველის გამზირი 25</p>
                  <p className="text-muted-foreground">თბილისი 0108, საქართველო</p>
                </div>
              </div>
            </div>

            {/* Working Hours */}
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <div className="flex items-center space-x-4">
                <div className="bg-primary text-primary-foreground p-4 rounded-full">
                  <FaClock className="text-2xl" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-card-foreground">სამუშაო საათები</h3>
                  <p className="text-muted-foreground">ორშაბათი - პარასკევი: 9:00 - 18:00</p>
                  <p className="text-muted-foreground">შაბათი: 10:00 - 16:00</p>
                  <p className="text-muted-foreground">კვირა: დახურულია</p>
                </div>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-card rounded-lg p-6 shadow-lg border border-border">
              <h3 className="text-xl font-semibold text-card-foreground mb-4">გამოგვყევით</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
                  <FaFacebookF className="text-lg" />
                </a>
                <a href="#" className="bg-pink-600 text-white p-3 rounded-full hover:bg-pink-700 transition-colors">
                  <FaInstagram className="text-lg" />
                </a>
                <a href="#" className="bg-blue-800 text-white p-3 rounded-full hover:bg-blue-900 transition-colors">
                  <FaLinkedinIn className="text-lg" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-card rounded-lg p-8 shadow-lg border border-border">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-primary text-primary-foreground p-3 rounded-full">
                <FaComments className="text-xl" />
              </div>
              <h2 className="text-3xl font-bold text-card-foreground">გამოგვწერეთ</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-2">
                  სახელი და გვარი *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    placeholder="შეიყვანეთ თქვენი სახელი"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                  ელ-ფოსტა *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-card-foreground mb-2">
                  ტელეფონი
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                    placeholder="+995 555 123 456"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="inquiryType" className="block text-sm font-medium text-card-foreground mb-2">
                  მოთხოვნის ტიპი
                </label>
                <select
                  id="inquiryType"
                  name="inquiryType"
                  value={formData.inquiryType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                >
                  <option value="">აირჩიეთ მოთხოვნის ტიპი</option>
                  <option value="buying">ყიდვა</option>
                  <option value="selling">გაყიდვა</option>
                  <option value="renting">ქირავნობა</option>
                  <option value="evaluation">შეფასება</option>
                  <option value="consultation">კონსულტაცია</option>
                  <option value="general">ზოგადი კითხვა</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-card-foreground mb-2">
                  შეტყობინება *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="დაწერეთ თქვენი შეტყობინება აქ..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground py-4 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <FaPaperPlane className="text-lg" />
                <span>გაგზავნა</span>
              </button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                ჩვენ პატივს ვცემთ თქვენს პრივატულობას და არასოდეს გავუზიარებთ თქვენს ინფორმაციას მესამე მხარეს.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactUs
