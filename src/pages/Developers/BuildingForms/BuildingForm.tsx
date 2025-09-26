"use client"

import type React from "react"

import { useState } from "react"
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaBed,
  FaBath,
  FaDollarSign,
  FaTag,
  FaUser,
  FaTimes,
} from "react-icons/fa"

interface BuildingFormData {
  title: string
  address: string
  district: string
  city: string
  developer: string
  price: number
  pricePerSqm: number
  area: number
  bedrooms: number
  bathrooms: number
  floor: number
  totalFloors: number
  status: string
  rating: number
  views: number
  mainImage: string
  badge: string
  location: { lat: number | null; lng: number | null }
  images: File[]
  floorPlans: File[]
  description_ge: string
  description_ru: string
  description_en: string
  development_id: number | null
}

interface BuildingFormModalProps {
  building?: Partial<BuildingFormData>
  developments: Array<{ id: number; name: string }>
  type: "view" | "edit" | "create"
  isOpen: boolean
  onSave: (data: BuildingFormData) => void
  onClose: () => void
}

const BuildingFormModal = ({ building, developments, type, isOpen, onSave, onClose }: BuildingFormModalProps) => {
  const [formData, setFormData] = useState<BuildingFormData>({
    title: building?.title ?? "",
    address: building?.address ?? "",
    district: building?.district ?? "",
    city: building?.city ?? "",
    developer: building?.developer ?? "",
    price: building?.price ?? 0,
    pricePerSqm: building?.pricePerSqm ?? 0,
    area: building?.area ?? 0,
    bedrooms: building?.bedrooms ?? 0,
    bathrooms: building?.bathrooms ?? 0,
    floor: building?.floor ?? 0,
    totalFloors: building?.totalFloors ?? 0,
    status: building?.status ?? "available",
    rating: building?.rating ?? 0,
    views: building?.views ?? 0,
    mainImage: building?.mainImage ?? "",
    badge: building?.badge ?? "",
    location: building?.location ?? { lat: null, lng: null },
    images: building?.images ?? [],
    floorPlans: building?.floorPlans ?? [],
    description_ge: building?.description_ge ?? "",
    description_ru: building?.description_ru ?? "",
    description_en: building?.description_en ?? "",
    development_id: building?.development_id ?? null,
  })

  const [activeTab, setActiveTab] = useState("basic")
  const [descLang, setDescLang] = useState("GE")

  const handleInputChange = (field: keyof BuildingFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLocationChange = (field: "lat" | "lng", value: string) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: Number.parseFloat(value) || null },
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }))
  }

  const handleRemoveImage = (idx: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const isReadOnly = type === "view"
  const statusOptions = ["available", "sold", "reserved", "under_construction"]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-[90%] h-[90%] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FaBuilding className="text-blue-600" />
            {type === "create" ? "შენობის დამატება" : type === "edit" ? "შენობის რედაქტირება" : "შენობის დეტალები"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 px-6">
          {[
            { key: "basic", label: "ძირითადი ინფორმაცია", icon: FaTag },
            { key: "details", label: "დეტალები და ადგილმდებარეობა", icon: FaMapMarkerAlt },
            { key: "descriptions", label: "აღწერები", icon: FaBuilding },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-6 py-4 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Title */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <div className="relative">
                      <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        disabled={isReadOnly}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                        required
                      />
                    </div>
                  </div>

                  {/* Developer */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Developer</label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.developer}
                        onChange={(e) => handleInputChange("developer", e.target.value)}
                        disabled={isReadOnly}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Development */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Development</label>
                    <select
                      value={formData.development_id || ""}
                      onChange={(e) =>
                        handleInputChange("development_id", e.target.value ? Number.parseInt(e.target.value) : null)
                      }
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                    >
                      <option value="">Select Development</option>
                      {developments.length > 0 ? (
                        developments.map((dev) => (
                          <option key={dev.id} value={dev.id}>
                            {dev.name}
                          </option>
                        ))
                      ) : (
                        <option value="">No Developments Available</option>
                      )}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.replace("_", " ").toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <div className="relative">
                      <FaDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                        disabled={isReadOnly}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                      />
                    </div>
                  </div>

                  {/* Price per sqm */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per m² ($)</label>
                    <input
                      type="number"
                      value={formData.pricePerSqm}
                      onChange={(e) => handleInputChange("pricePerSqm", Number.parseFloat(e.target.value) || 0)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                    />
                  </div>

                  {/* Badge */}
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
                    <div className="relative">
                      <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={formData.badge}
                        onChange={(e) => handleInputChange("badge", e.target.value)}
                        disabled={isReadOnly}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                        placeholder="e.g., New, Hot Deal, Premium"
                      />
                    </div>
                  </div>

                  {/* Main Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Main Image URL</label>
                    <input
                      type="url"
                      value={formData.mainImage}
                      onChange={(e) => handleInputChange("mainImage", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Images Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">ფოტოები</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={typeof img === "string" ? img : URL.createObjectURL(img)}
                          alt={`Building ${idx + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        {!isReadOnly && (
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    {!isReadOnly && (
                      <label className="border-2 border-dashed border-gray-300 rounded-lg h-24 flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors">
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                        <span className="text-gray-400 text-2xl">+</span>
                      </label>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Details & Location Tab */}
            {activeTab === "details" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Location Details */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold flex items-center gap-2 mb-6">
                    <FaMapMarkerAlt className="text-red-500" />
                    Location Details
                  </h3>

                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          disabled={isReadOnly}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                        <input
                          type="text"
                          value={formData.district}
                          onChange={(e) => handleInputChange("district", e.target.value)}
                          disabled={isReadOnly}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                          disabled={isReadOnly}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                        <input
                          type="number"
                          step="any"
                          value={formData.location.lat || ""}
                          onChange={(e) => handleLocationChange("lat", e.target.value)}
                          disabled={isReadOnly}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                        <input
                          type="number"
                          step="any"
                          value={formData.location.lng || ""}
                          onChange={(e) => handleLocationChange("lng", e.target.value)}
                          disabled={isReadOnly}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Property Details */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold mb-6">Property Details</h3>

                  <div className="space-y-4">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Area (m²)</label>
                      <div className="relative">
                        <FaRulerCombined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          value={formData.area}
                          onChange={(e) => handleInputChange("area", Number.parseFloat(e.target.value) || 0)}
                          disabled={isReadOnly}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                        <div className="relative">
                          <FaBed className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            value={formData.bedrooms}
                            onChange={(e) => handleInputChange("bedrooms", Number.parseInt(e.target.value) || 0)}
                            disabled={isReadOnly}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                          />
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                        <div className="relative">
                          <FaBath className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            value={formData.bathrooms}
                            onChange={(e) => handleInputChange("bathrooms", Number.parseInt(e.target.value) || 0)}
                            disabled={isReadOnly}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                        <input
                          type="number"
                          value={formData.floor}
                          onChange={(e) => handleInputChange("floor", Number.parseInt(e.target.value) || 0)}
                          disabled={isReadOnly}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors</label>
                        <input
                          type="number"
                          value={formData.totalFloors}
                          onChange={(e) => handleInputChange("totalFloors", Number.parseInt(e.target.value) || 0)}
                          disabled={isReadOnly}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          max="5"
                          value={formData.rating}
                          onChange={(e) => handleInputChange("rating", Number.parseFloat(e.target.value) || 0)}
                          disabled={isReadOnly}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Views</label>
                        <input
                          type="number"
                          value={formData.views}
                          onChange={(e) => handleInputChange("views", Number.parseInt(e.target.value) || 0)}
                          disabled={isReadOnly}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Descriptions Tab */}
            {activeTab === "descriptions" && (
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-6">Property Descriptions</h3>

                <div className="flex gap-2 mb-6">
                  {[
                    { key: "GE", label: "Georgian" },
                    { key: "RU", label: "Russian" },
                    { key: "EN", label: "English" },
                  ].map((lang) => (
                    <button
                      key={lang.key}
                      type="button"
                      onClick={() => setDescLang(lang.key)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        descLang === lang.key ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  {descLang === "GE" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description in Georgian</label>
                      <textarea
                        value={formData.description_ge}
                        onChange={(e) => handleInputChange("description_ge", e.target.value)}
                        disabled={isReadOnly}
                        rows={6}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100 resize-none"
                        placeholder="Description in Georgian..."
                      />
                    </div>
                  )}

                  {descLang === "RU" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description in Russian</label>
                      <textarea
                        value={formData.description_ru}
                        onChange={(e) => handleInputChange("description_ru", e.target.value)}
                        disabled={isReadOnly}
                        rows={6}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100 resize-none"
                        placeholder="Description in Russian..."
                      />
                    </div>
                  )}

                  {descLang === "EN" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description in English</label>
                      <textarea
                        value={formData.description_en}
                        onChange={(e) => handleInputChange("description_en", e.target.value)}
                        disabled={isReadOnly}
                        rows={6}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition disabled:bg-gray-100 resize-none"
                        placeholder="Description in English..."
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </form>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          {/* Data Preview */}
          <div className="text-sm text-gray-600">
            <details className="cursor-pointer">
              <summary className="font-medium hover:text-gray-800">View Form Data (Backend Values)</summary>
              <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto max-h-32 max-w-md">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </details>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isReadOnly ? "დახურვა" : "გაუქმება"}
            </button>
            {!isReadOnly && (
              <button
                type="submit"
                onClick={handleSubmit}
                className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900 transition-colors"
              >
                {type === "create" ? "დამატება" : "შენახვა"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BuildingFormModal
