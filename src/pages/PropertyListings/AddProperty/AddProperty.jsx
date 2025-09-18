"use client"

import { useState } from "react"
import { FaBuilding, FaHome, FaCalendarDay, FaMapMarkerAlt, FaCamera, FaPlus, FaEye, FaBed, FaCheckCircle } from "react-icons/fa"
import defaultInstance from "../../../plugins/axios"

const propertyTypes = [
  { key: "sale", label: "გაყიდვა", icon: FaBuilding },
  { key: "rent", label: "გაქირავება", icon: FaHome },
  { key: "daily", label: "დღიურად", icon: FaCalendarDay },
]

const propertyCategories = ["ბინა", "სახლი", "კომერცი", "ოფისები", "დუპლექსი", "აგარაკი", "ნაკვეთი"]

const propertySubCategories = ["კომერციული ფართი", "ოფისი", "საწარმოო", "მაღაზია", "კაფე", "სასტუმრო"]

const AddProperty = () => {
  const [selectedType, setSelectedType] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    district: "",
    city: "",
    price: "",
    area: "",
    bedrooms: "",
    bathrooms: "",
    floor: "",
    totalFloors: "",
    yearBuilt: "",
    description: { GE: "", RU: "", EN: "" },
    mainImage: null,
    images: [],
    category: "",
    subCategory: "",
    hasBalcony: false,
    userType: "agent",
  })
  const [descLang, setDescLang] = useState("GE")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleTypeSelect = (type) => {
    setSelectedType(type)
  }

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        mainImage: files[0],
        images: [...prev.images, ...files],
      }))
    }
  }

  const handleDescriptionChange = (lang, value) => {
    setFormData(prev => ({
      ...prev,
      description: {
        ...prev.description,
        [lang]: value
      }
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    // Prepare payload
    const payload = {
      ...formData,
      description_ge: formData.description.GE,
      description_ru: formData.description.RU,
      description_en: formData.description.EN,
    }
    // Remove the nested description object
    delete payload.description

    // Handle images (if you need to send files, use FormData)
    let dataToSend = payload
    let config = {}
    if (formData.images.length > 0 || formData.mainImage) {
      dataToSend = new FormData()
      Object.entries(payload).forEach(([key, value]) => {
        dataToSend.append(key, value)
      })
      if (formData.mainImage) {
        dataToSend.append("mainImage", formData.mainImage)
      }
      formData.images.forEach((img, idx) => {
        dataToSend.append(`images[${idx}]`, img)
      })
      config = { headers: { "Content-Type": "multipart/form-data" } }
    }

    try {
      await defaultInstance.post("building", dataToSend, config)
      setSuccess(true)
    } catch (err) {
      setError("დაფიქსირდა შეცდომა. სცადეთ თავიდან.")
    } finally {
      setLoading(false)
    }
  }

  const PropertyPreview = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        {formData.mainImage ? (
          <img
            src={URL.createObjectURL(formData.mainImage) || "/placeholder.svg"}
            alt="Property"
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <FaCamera className="text-gray-400 text-3xl" />
          </div>
        )}
        {/* <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
          100%
        </div> */}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900">${formData.price || "40,000"}</h3>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <FaBuilding className="text-xs" />
            <span>ოფისი</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{formData.area || "60.23"} მ²</span>
          </div>
          <div className="flex items-center gap-1">
            <FaBed className="text-xs" />
            <span>{formData.bedrooms || "4"} ოთახი</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          {formData.address || "ალექსანდრე ყაზბეგის გამზირი, 15 (ო..."}
          <br />
          <span className="text-xs">მ² Kazbegi 2</span>
        </p>

        <div className="text-xs text-gray-500 mb-3">დღეს</div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <FaEye />
            <span>გვერდის გადახედვა</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {!selectedType ? (
        <div className="max-w-4xl mx-auto py-20">
          <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">ობიექტის განთავსება</h1>
          <div className="flex gap-6 justify-center">
            {propertyTypes.map((type) => {
              const IconComponent = type.icon
              return (
                <button
                  key={type.key}
                  className="bg-white border border-gray-200 rounded-xl px-8 py-8 shadow hover:bg-blue-50 hover:border-blue-400 transition-all text-lg font-semibold text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 flex flex-col items-center gap-3"
                  onClick={() => handleTypeSelect(type.key)}
                  type="button"
                >
                  <IconComponent className="text-3xl text-blue-500" />
                  {type.label}
                </button>
              )
            })}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <button
                type="button"
                onClick={() => setSelectedType(null)}
                className="text-blue-600 hover:underline flex items-center gap-2"
              >
                <span className="text-xl">←</span> უკან
              </button>
            </div>

            {/* Progress steps - make them clickable */}
            <div className="flex gap-4 mb-8">
              {propertyTypes.map((type) => {
                const IconComponent = type.icon
                const isActive = selectedType === type.key
                return (
                  <button
                    key={type.key}
                    type="button"
                    onClick={() => setSelectedType(type.key)}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 font-semibold transition-all
                      ${isActive
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 text-gray-600 hover:bg-blue-100"}
                    `}
                  >
                    <IconComponent />
                    <span>{type.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form className="bg-white rounded-xl shadow p-8" onSubmit={handleSubmit}>
                {/* Property Categories */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">საცხოვრებელი უძრავი ქონება</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {propertyCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => handleInputChange("category", category)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          formData.category === category
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  <h4 className="text-md font-medium mb-3">კომერციული უძრავი ქონება</h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {propertySubCategories.map((subCategory) => (
                      <button
                        key={subCategory}
                        type="button"
                        onClick={() => handleInputChange("subCategory", subCategory)}
                        className={`px-4 py-2 rounded-lg border transition-all ${
                          formData.subCategory === subCategory
                            ? "bg-gray-800 text-white border-gray-800"
                            : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        {subCategory}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">ადგილმდებარეობა</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">ქალაქი *</label>
                      <input
                        type="text"
                        value={formData.city || ""}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder="თბილისი"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">საცხოვრებელი კომპლექსის დასახელება</label>
                      <input
                        type="text"
                        value={formData.district || ""}
                        onChange={(e) => handleInputChange("district", e.target.value)}
                        placeholder="მ² Kazbegi 2"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">ქუჩა *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.address || ""}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="ალექსანდრე ყაზბეგის გამზირი"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">კორპუსის ნომერი</label>
                      <input
                        type="text"
                        placeholder="15 (ბლოკი 4)"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">სახლის ნომერი</label>
                      <input
                        type="text"
                        placeholder="#12"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                      />
                    </div>
                  </div>

                  {/* Map placeholder */}
                  <div className="mt-6 h-64 bg-gray-100 rounded-lg flex items-center justify-center border">
                    <div className="text-center">
                      <FaMapMarkerAlt className="text-4xl text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">რუკის ჩატვირთვა</p>
                    </div>
                  </div>
                </div>

                {/* Building Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">შენობის მონაცემები</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">სართული</label>
                      <input
                        type="number"
                        value={formData.floor || ""}
                        onChange={(e) => handleInputChange("floor", e.target.value)}
                        placeholder="4"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">სართულების რაოდენობა *</label>
                      <input
                        type="number"
                        value={formData.totalFloors || ""}
                        onChange={(e) => handleInputChange("totalFloors", e.target.value)}
                        placeholder="21"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-gray-700 font-medium mb-2">მშენებლობის წელი</label>
                    <select
                      value={formData.yearBuilt || ""}
                      onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                    >
                      <option value="">2019</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                      <option value="2021">2021</option>
                      <option value="2020">2020</option>
                    </select>
                  </div>
                </div>

                {/* Property Details */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">შენობის მონაცემები</h3>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">სრული ფართი *</label>
                      <input
                        type="text"
                        value={formData.area || ""}
                        onChange={(e) => handleInputChange("area", e.target.value)}
                        placeholder="60.23 მ²"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">ოთახის რაოდენობა</label>
                      <input
                        type="number"
                        value={formData.bedrooms || ""}
                        onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                        placeholder="4"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.hasBalcony}
                        onChange={(e) => handleInputChange("hasBalcony", e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-gray-700">ფასადის ფართი</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">აღწერა</h3>
                  <div className="mb-4">
                    <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg mb-4">
                      მყიდველების 60% კითხულობს აღწერას. მიუთითეთ მნიშვნელოვანი რამ: განლაგებისა და რემონტის მახასიათებლები, 
                      ფანჯრის გასასვლელები, ობიექტისა და ტერიტორიის უპირატესობები
                    </p>

                    <div className="flex gap-2 mb-4">
                      {["GE", "RU", "EN"].map(lang => (
                        <button
                          key={lang}
                          type="button"
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            descLang === lang
                              ? "bg-gray-800 text-white"
                              : "bg-gray-200 text-gray-600"
                          }`}
                          onClick={() => setDescLang(lang)}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>

                    <textarea
                      value={formData.description[descLang] || ""}
                      onChange={e => handleDescriptionChange(descLang, e.target.value)}
                      placeholder="ტექსტი"
                      rows={6}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition resize-none"
                    />
                  </div>
                </div>

                {/* Photos Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">ფოტო და ვიდეო</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {formData.images.length > 0 &&
                      formData.images.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={URL.createObjectURL(image) || "/placeholder.svg"}
                            alt={`Property ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
                              მთავარი ფოტო
                            </div>
                          )}
                        </div>
                      ))}

                    {Array.from({ length: Math.max(0, 4 - formData.images.length) }).map((_, index) => (
                      <label
                        key={index}
                        className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                      >
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <FaPlus className="text-gray-400 text-2xl" />
                      </label>
                    ))}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                      სჯობს ერთხელ აჩვენო, ვიდრე რამდენჯერმე თქვა: ბუნებრივი განათება, მოვლილი შენობა და ზოგადი ხედები მყიდველისთვის ბევრად გასაგები ხდება
                    </p>
                    <small className="text-xs text-gray-500">
                        ობიექტები რომლებსაც თან ახლავთ ვიდეო 20 % უფრო მეტ გამოხმაურებას იღებენ
                    </small>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">ამჟღავნე Youtube-ზე</label>
                    <input
                      type="url"
                      placeholder="https://www.youtube..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                    />
                  </div>
                </div>

                {/* Price Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">ფასი და შეძენის პირობები</h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">ობიექტის ფასი *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.price || ""}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        placeholder="$ 40 000"
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                      />
                      <select className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition">
                        <option>GEL</option>
                        <option>USD</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-gray-700">შეთანხმების საკითხისთვის გარიგება</span>
                    </label>
                  </div>
                </div>

                {/* Contact Section */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">კონტაქტები</h3>
                  <p className="text-sm text-gray-600 mb-4">აარჩიეთ აქაუნთის ტიპი Homeinfo-ზე</p>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <label className={`border border-gray-300 rounded-lg p-4 cursor-pointer flex flex-col gap-2 ${formData.userType === "agent" ? "ring-2 ring-blue-500" : ""}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          name="userType"
                          value="agent"
                          checked={formData.userType === "agent"}
                          onChange={() => handleInputChange("userType", "agent")}
                          className="accent-blue-600"
                        />
                        <span className="font-medium">აგენტი</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1 text-green-600 mb-1">
                          <FaCheckCircle className="text-green-500" />
                          <span>ობიექტის მართვის პანელი Homeinfo -ზე</span>
                        </div>
                        <div className="flex items-center gap-1 text-green-600">
                          <FaCheckCircle className="text-green-500" />
                          <span>მეტი განცხადების დადების საშვალება.</span>
                        </div>
                      </div>
                    </label>

                    <label className={`border border-gray-300 rounded-lg p-4 cursor-pointer flex flex-col gap-2 ${formData.userType === "owner" ? "ring-2 ring-blue-500" : ""}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="radio"
                          name="userType"
                          value="owner"
                          checked={formData.userType === "owner"}
                          onChange={() => handleInputChange("userType", "owner")}
                          className="accent-blue-600"
                        />
                        <span className="font-medium">მესაკუთრე</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div className="flex items-center gap-1 text-green-600 mb-1">
                          <FaCheckCircle className="text-green-500" />
                          <span>მხოლოდ უძრავი ონქების მესაკუთრეთათვის</span>
                        </div>
                        <div className="text-gray-500">
                          ჩვენ შეგვიძლია ნებისმიერ დროს მოვითხოვოთ საკუთრების უფლების დამადასტურებელი დოკუმენტები
                        </div>
                      </div>
                    </label>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">როგორ დაგიკავშირდეთ? *</label>
                    <input
                      type="text"
                      placeholder="Aleksandre Gasparyan"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">ტელეფონის ნომერი *</label>
                    <div className="flex">
                      <div className="flex items-center gap-2 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg px-3">
                        <span className="text-red-500">🇬🇪</span>
                        <span>+995</span>
                      </div>
                      <input
                        type="tel"
                        placeholder="579 12 59 16"
                        className="flex-1 border border-gray-300 rounded-r-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                      />
                    </div>
                    {/* <p className="text-xs text-gray-500 mt-1">
                      ჩვენ გამოვიგზავნოთ SMS-ს ამ ნომერზე დადასტურების კოდისთვის
                    </p> */}
                  </div>

                  {error && <div className="mb-4 text-red-500">{error}</div>}
                  {success && <div className="mb-4 text-green-600">განცხადება წარმატებით გაიგზავნა!</div>}
                  <button
                    type="submit"
                    className="w-full bg-gray-800 text-white py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors mb-4"
                    disabled={loading}
                  >
                    {loading ? "იტვირთება..." : "გამოქვეყნება"}
                  </button>

                {/*  <button type="button" className="w-full text-blue-600 py-2 text-center hover:underline">
                    მაქვს ნაბეჯების შეცვლა
                  </button> */}
                </div>
              </form>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <h3 className="text-lg font-semibold mb-4">ობიექტი განცხადება</h3>
                <PropertyPreview />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AddProperty
