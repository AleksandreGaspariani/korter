"use client"

import { useState } from "react"
import structure from "../PropertyStructure.json"
import { FaBuilding, FaHome, FaCalendarDay, FaCheckCircle } from "react-icons/fa"
import axios from "../../../plugins/axios"
import MapB from "../../../components/Map/MapB"

const typeMap = [
  { key: "Sell", label: "გაყიდვა", icon: FaBuilding },
  { key: "Rent", label: "გაქირავება", icon: FaHome },
  { key: "Daily", label: "დღიურად", icon: FaCalendarDay }
]

const categoryLabels = {
  living: "საცხოვრებელი უძრავი ქონება",
  commercial: "კომერციული უძრავი ქონება",
  garage: "გარაჟი და პარკინგი"
}

const defaultCategory = "living"
const defaultPropertyType = "flat"

const AddProperty = () => {
  const [selectedTab, setSelectedTab] = useState("Sell")
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory)
  const [selectedPropertyType, setSelectedPropertyType] = useState(defaultPropertyType)
  const [formData, setFormData] = useState({})
  const [descLang, setDescLang] = useState("GE")
  const [currentStep, setCurrentStep] = useState("form-filling") // always show form

  const propertyStructure = structure.propertyStructure
  const currentTab = propertyStructure.tabs.find((tab) => tab.name === selectedTab)
  const propertyTypes = currentTab?.PropertyType[0] || {}

  // Reset everything on main type change
  const handleTabSelect = (tabName) => {
    setSelectedTab(tabName)
    setSelectedCategory(defaultCategory)
    setSelectedPropertyType(defaultPropertyType)
    setFormData({})
    setDescLang("GE")
    setCurrentStep("form-filling")
  }

  // Reset form on category/type change
  const handlePropertyTypeSelect = (category, propertyKey) => {
    setSelectedCategory(category)
    setSelectedPropertyType(propertyKey)
    setFormData({})
    setDescLang("GE")
    setCurrentStep("form-filling")
  }

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  // Image upload handler
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      photos: [...(prev.photos || []), ...files]
    }))
  }

  // Remove image handler (optional)
  const handleRemoveImage = (idx) => {
    setFormData(prev => ({
      ...prev,
      photos: (prev.photos || []).filter((_, i) => i !== idx)
    }))
  }

  const getCurrentPropertyConfig = () => {
    if (!selectedCategory || !selectedPropertyType) return null

    const categoryData = propertyTypes[selectedCategory]
    if (!categoryData) return null

    const propertyConfig = categoryData.find((prop) => prop.key === selectedPropertyType)
    return propertyConfig?.inputs?.[0] || null
  }

  const handleSingleSelect = (groupKeys, selectedKey, value) => {
    setFormData(prev => {
      const updated = { ...prev }
      groupKeys.forEach(key => {
        updated[key] = undefined
      })
      updated[selectedKey] = value
      return updated
    })
  }

  const renderFormField = (field) => {
    const { key, type, label, options, prop } = field

    if (type === "string") {
      return (
        <div key={key} className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            {label} {prop !== "disabled_label" && "*"}
          </label>
          <input
            type="text"
            value={formData[key] || ""}
            onChange={(e) => handleInputChange(key, e.target.value)}
            disabled={prop === "disabled_label"}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
          />
        </div>
      )
    }

    if (type === "number") {
      return (
        <div key={key} className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">{label}</label>
          <input
            type="number"
            value={formData[key] || ""}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
          />
        </div>
      )
    }

    if (type === "select") {
      return (
        <div key={key} className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">{label}</label>
          <select
            value={formData[key] || ""}
            onChange={(e) => handleInputChange(key, e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
          >
            <option value="">Select {label}</option>
            {options?.map((option, idx) => (
              <option key={idx} value={typeof option === "object" ? option.value : option}>
                {typeof option === "object" ? option.label : option}
              </option>
            ))}
          </select>
        </div>
      )
    }

    if (type === "boolean") {
      return (
        <div key={key} className="mb-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData[key] || false}
              onChange={(e) => handleInputChange(key, e.target.checked)}
              className="rounded"
            />
            <span className="text-gray-700">{label}</span>
          </label>
        </div>
      )
    }

    return null
  }

  const renderFormSection = (sectionKey, sectionData, title) => {
    if (!sectionData || sectionData.length === 0) return null

    // Single-select groups: plan_type, room_count, bedroom_count, bathroom_count
    const singleSelectGroups = [
      "plan_type",
      "room_count",
      "bedroom_count",
      "bathroom_count"
    ]

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sectionData.map((field, idx) => {
            if (typeof field === "object" && !field.key) {
              return Object.entries(field).map(([nestedKey, nestedFields]) => (
                <div key={`${sectionKey}-${nestedKey}-${idx}`} className="col-span-full">
                  <h4 className="text-md font-medium mb-3 capitalize">{nestedKey.replace("_", " ")}</h4>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {nestedFields.map((nestedField, nestedIdx) => {
                      // Single-select logic for plan_type, room_count, bedroom_count, bathroom_count
                      if (
                        singleSelectGroups.includes(nestedKey)
                      ) {
                        const groupKeys = nestedFields.map(f => f.key)
                        // For boolean type
                        if (nestedField.type === "boolean") {
                          return (
                            <button
                              key={`${nestedKey}-${nestedIdx}`}
                              type="button"
                              onClick={() => handleSingleSelect(groupKeys, nestedField.key, !formData[nestedField.key])}
                              className={`px-4 py-2 rounded-lg border transition-all ${
                                formData[nestedField.key]
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                              }`}
                            >
                              {nestedField.label}
                            </button>
                          )
                        }
                        // For select type
                        if (nestedField.type === "select") {
                          const selected = formData[nestedField.key] !== undefined
                          return (
                            <button
                              key={`${nestedKey}-${nestedIdx}`}
                              type="button"
                              onClick={() => handleSingleSelect(groupKeys, nestedField.key, nestedField.options[0])}
                              className={`px-4 py-2 rounded-lg border transition-all ${
                                selected
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                              }`}
                            >
                              {nestedField.label}
                            </button>
                          )
                        }
                        return null
                      }
                      return renderFormField(nestedField)
                    })}
                  </div>
                </div>
              ))
            }
            return renderFormField(field)
          })}
        </div>
      </div>
    )
  }

  const PropertyPreview = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="relative">
        {(formData.photos && formData.photos.length > 0) ? (
          <img
            src={URL.createObjectURL(formData.photos[0])}
            alt="Property"
            className="w-full h-48 object-cover"
          />
        ) : (
          <img
            src="https://static.vecteezy.com/system/resources/previews/022/059/000/non_2x/no-image-available-icon-vector.jpg"
            alt="Property"
            className="w-full h-48 object-cover"
          />
        )}
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
            <span>{formData.total_area || "60.23"} მ²</span>
          </div>
          <div className="flex items-center gap-1">
            <span>{formData.rooms_4 || formData.rooms_3 || formData.rooms_2 || formData.rooms_1 || "4"} ოთახი</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-3">
          {formData.address || "ალექსანდრე ყაზბეგის გამზირი, 15 (ო..."}
          <br />
          <span className="text-xs">მ² {formData.development_name || "Kazbegi 2"}</span>
        </p>

        <div className="text-xs text-gray-500 mb-3">დღეს</div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span>გვერდის გადახედვა</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
          {formData.photos && formData.photos.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={URL.createObjectURL(img)}
                alt={`Property ${idx + 1}`}
                className="w-full h-20 object-cover rounded border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (currentStep === "type-selection") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-20">
          <h1 className="text-2xl font-bold text-center mb-8 text-gray-800">ობიექტის განთავსება</h1>

          <div className="flex gap-6 justify-center mb-12">
            {propertyStructure.tabs.map((tab) => (
              <button
                key={tab.name}
                className={`px-8 py-4 rounded-xl border-2 transition-all text-lg font-semibold flex items-center gap-3 ${
                  selectedTab === tab.name
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-400"
                }`}
                onClick={() => handleTabSelect(tab.name)}
              >
                {tab.name === "Sell" && <FaBuilding className="text-2xl" />}
                {tab.name === "Rent" && <FaHome className="text-2xl" />}
                {tab.name === "Daily" && <FaCalendarDay className="text-2xl" />}
                {tab.name === "Sell" ? "გაყიდვა" : tab.name === "Rent" ? "გაქირავება" : "დღიურად"}
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {Object.entries(propertyTypes).map(([category, properties]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4 capitalize">
                  {category === "living"
                    ? "საცხოვრებელი უძრავი ქონება"
                    : category === "commercial"
                      ? "კომერციული უძრავი ქონება"
                      : category === "garage"
                        ? "გარაჟი და პარკინგი"
                        : category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {properties.map((property) => (
                    <button
                      key={property.key}
                      className="bg-white border border-gray-200 rounded-lg px-6 py-4 shadow hover:bg-blue-50 hover:border-blue-400 transition-all text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => handlePropertyTypeSelect(category, property.key)}
                    >
                      {property.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const propertyConfig = getCurrentPropertyConfig()
  if (!propertyConfig) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8">
        {/* Left side: Main type selector and category buttons */}
        <div className="lg:w-1/4 flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {typeMap.map((type) => (
              <button
                key={type.key}
                className={`px-8 py-4 rounded-xl border-2 transition-all text-lg font-semibold flex items-center gap-3 ${
                  selectedTab === type.key
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-400"
                }`}
                onClick={() => handleTabSelect(type.key)}
              >
                <type.icon className="text-2xl" />
                {type.label}
              </button>
            ))}
          </div>
          <div className="mt-8">
            {Object.entries(propertyTypes).map(([category, properties]) => (
              <div key={category} className="mb-4">
                <div className="font-semibold text-gray-700 mb-2">{categoryLabels[category] || category}</div>
                <div className="flex flex-wrap gap-2">
                  {properties.map((property) => (
                    <button
                      key={property.key}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                        selectedCategory === category && selectedPropertyType === property.key
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                      }`}
                      onClick={() => handlePropertyTypeSelect(category, property.key)}
                    >
                      {property.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Form and preview */}
        <div className="lg:w-3/4">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <form className="bg-white rounded-xl shadow p-8">
                {propertyConfig.location && renderFormSection("location", propertyConfig.location, "ადგილმდებარეობა")}
                {/* Map placeholder */}
                {propertyConfig.location && (
                  <div className="mb-8">
                    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center border overflow-hidden">
                      <MapB />
                    </div>
                  </div>
                )}
                {propertyConfig.floor && renderFormSection("floor", propertyConfig.floor, "შენობის მონაცემები")}
                {propertyConfig.flat_details &&
                  renderFormSection("flat_details", propertyConfig.flat_details, "ბინის მონაცემები")}
                {/* Description section */}
                {propertyConfig.description && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">აღწერა</h3>
                    <div className="mb-4">
                      <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg mb-4">
                        {propertyConfig.description[0]?.description_top}
                      </p>
                      <div className="flex gap-2 mb-4">
                        {propertyConfig.description[0]?.description_input.map((langField) => (
                          <button
                            key={langField.key}
                            type="button"
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              descLang === langField.label.replace(/[()]/g, "")
                                ? "bg-gray-800 text-white"
                                : "bg-gray-200 text-gray-600"
                            }`}
                            onClick={() => setDescLang(langField.label.replace(/[()]/g, ""))}
                          >
                            {langField.label.replace(/[()]/g, "")}
                          </button>
                        ))}
                      </div>
                      {propertyConfig.description[0]?.description_input.map((langField) =>
                        descLang === langField.label.replace(/[()]/g, "") ? (
                          <textarea
                            key={langField.key}
                            value={formData[langField.key] || ""}
                            onChange={(e) => handleInputChange(langField.key, e.target.value)}
                            placeholder={langField.label}
                            rows={6}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition resize-none"
                          />
                        ) : null
                      )}
                    </div>
                  </div>
                )}
                {/* Photos section */}
                {propertyConfig.photo_video && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-4">ფოტო და ვიდეო</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {(formData.photos || []).map((img, idx) => (
                        <div key={idx} className="relative">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`Property ${idx + 1}`}
                            className="w-full h-32 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs"
                          >
                            x
                          </button>
                        </div>
                      ))}
                      {Array.from({ length: Math.max(0, 4 - (formData.photos ? formData.photos.length : 0)) }).map((_, index) => (
                        <label
                          key={index}
                          className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors"
                        >
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                          <span className="text-gray-400 text-2xl">+</span>
                        </label>
                      ))}
                    </div>
                    {propertyConfig.photo_video_descriptions && (
                      <div className="mb-4">
                        <p className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                          {propertyConfig.photo_video_descriptions[0]?.photo_video_description_two}
                        </p>
                      </div>
                    )}
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Youtube -ს ლინკი</label>
                      <input
                        type="url"
                        value={formData.video || ""}
                        onChange={(e) => handleInputChange("video", e.target.value)}
                        placeholder="https://www.youtube..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                      />
                    </div>
                  </div>
                )}
                {/* Price section */}
                {propertyConfig.price && (
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
                        <select
                          value={formData.currency || ""}
                          onChange={(e) => handleInputChange("currency", e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                        >
                          {propertyConfig.price
                            .find((p) => p.key === "currency")
                            ?.options?.map((option, idx) => (
                              <option key={idx} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                        </select>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">≤ 108 427 ₾</p>
                    </div>
                    <div className="mb-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.comission || false}
                          onChange={(e) => handleInputChange("comission", e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-gray-700">შეთანხმების საკითხისთვის გარიგება</span>
                      </label>
                    </div>
                  </div>
                )}
                {/* Contact section */}
                {propertyConfig.contact && (
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
                        <div className="flex items-start gap-1 text-green-600 mb-1">
                          <FaCheckCircle className="text-green-500 mt-1" />
                          <span>ობიექტის მართვის პანელი Homeinfo -ზე</span>
                        </div>
                        <div className="flex items-start gap-1 text-green-600">
                          <FaCheckCircle className="text-green-500 mt-1" />
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
                        <div className="flex items-start gap-1 text-green-600 mb-1">
                          <FaCheckCircle className="text-green-500 mt-1" />
                          <span>მხოლოდ უძრავი ონქების მესაკუთრეთათვის</span>
                        </div>
                        <small className="text-gray-500">
                          ჩვენ შეგვიძლია ნებისმიერ დროს მოვითხოვოთ საკუთრების უფლების დამადასტურებელი დოკუმენტები
                        </small>
                      </div>
                    </label>
                  </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">როგორ დაგიკავშირდეთ ? *</label>
                      <input
                        type="text"
                        value={formData.contact_name || ""}
                        onChange={(e) => handleInputChange("contact_name", e.target.value)}
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
                          value={formData.contact_phone || ""}
                          onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                          placeholder="579 12 59 16"
                          className="flex-1 border border-gray-300 rounded-r-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                        />
                      </div>
                      {/* <p className="text-xs text-gray-500 mt-1">
                        ჩვენ გამოვიგზავნოთ SMS-ს ამ ნომერზე დადასტურების კოდისთვის
                      </p> */}
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-gray-800 text-white py-4 rounded-lg font-medium hover:bg-gray-900 transition-colors mb-4"
                    >
                      დასრულება
                    </button>
                  </div>
                )}
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
      </div>
    </div>
  )
}

export default AddProperty
