"use client"

import { useState, useEffect } from "react"
import { X, Plus, Edit2, Trash2, Save, XCircle, Upload, ImageIcon } from "lucide-react"
import { FiHome, FiLayers, FiDollarSign, FiMaximize2 } from "react-icons/fi"
import { IoBedOutline, IoResizeOutline } from "react-icons/io5"
import { MdBalcony, MdBathroom } from "react-icons/md"
import { TbRulerMeasure } from "react-icons/tb"
import defaultInstance from "../../../../plugins/axios"

const API_URI = import.meta.env.VITE_API_URI
  ? import.meta.env.VITE_API_URI.replace(/\/api\/?$/, "")
  : "http://localhost:8000"

const FloorPlanManager = ({ property, onClose }) => {
  const [floorPlans, setFloorPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)

  const emptyFloorPlan = {
    images: [],
    room_count: "",
    bedroom_count: "",
    ceiling_height: "",
    price_per_sqm: "",
    total_price: "",
    total_area: "",
    living_area: "",
    has_balcony: 0,
    floor: "",
    bathroom_count: "",
    availability: "available",
  }

  const [formData, setFormData] = useState(emptyFloorPlan)
  const [imageFiles, setImageFiles] = useState([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState([])

  useEffect(() => {
    fetchFloorPlans()
  }, [property.id])

  const fetchFloorPlans = async () => {
    try {
      setLoading(true)
      const response = await defaultInstance.get(`/property/${property.id}/floor-plans`)
      // Map response to ensure images array exists
      const plans = Array.isArray(response.data.floor_plans)
        ? response.data.floor_plans.map(plan => ({
            ...plan,
            images: plan.images
              ? plan.images
              : plan.image
                ? (() => {
                    try {
                      const arr = JSON.parse(plan.image)
                      return Array.isArray(arr) ? arr : []
                    } catch {
                      return []
                    }
                  })()
                : [],
          }))
        : []
      setFloorPlans(plans)
    } catch (error) {
      console.error("Error fetching floor plans:", error)
      setFloorPlans([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? name === "has_balcony"
            ? checked ? 1 : 0
            : checked
          : value,
    }))
  }

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles((prev) => [...prev, ...files])

    // Create preview URLs
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreviewUrls((prev) => [...prev, reader.result])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index))
    setImagePreviewUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData()

      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (key !== "images") {
          formDataToSend.append(key, formData[key])
        }
      })

      // Append existing images
      if (formData.images && formData.images.length > 0) {
        formDataToSend.append("existing_images", JSON.stringify(formData.images))
      }

      // Append new image files
      imageFiles.forEach((file, index) => {
        formDataToSend.append(`images[${index}]`, file)
      })

      if (editingPlan) {
        await defaultInstance.post(`/property/${property.id}/floor-plans/${editingPlan.id}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      } else {
        await defaultInstance.post(`/property/${property.id}/floor-plans`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        })
      }

      await fetchFloorPlans()
      cancelEdit()
    } catch (error) {
      console.error("Error saving floor plan:", error)
      alert("Failed to save floor plan. Please try again.")
    }
  }

  const handleDelete = async (planId) => {
    if (!confirm("Are you sure you want to delete this floor plan?")) return

    try {
      await defaultInstance.delete(`/property/${property.id}/floor-plans/${planId}`)
      await fetchFloorPlans()
    } catch (error) {
      console.error("Error deleting floor plan:", error)
      alert("Failed to delete floor plan. Please try again.")
    }
  }

  const startEdit = (plan) => {
    setEditingPlan(plan)
    setFormData({
      images: plan.images || [],
      room_count: plan.room_count || "",
      bedroom_count: plan.bedroom_count || "",
      ceiling_height: plan.ceiling_height || "",
      price_per_sqm: plan.price_per_sqm || "",
      total_price: plan.total_price || "",
      total_area: plan.total_area || "",
      living_area: plan.living_area || "",
      has_balcony: plan.has_balcony || 0,
      floor: plan.floor || "",
      bathroom_count: plan.bathroom_count || "",
      availability: plan.availability || "available",
    })
    setImageFiles([])
    setImagePreviewUrls([])
    setIsAdding(false)
  }

  const startAdd = () => {
    setIsAdding(true)
    setEditingPlan(null)
    setFormData(emptyFloorPlan)
    setImageFiles([])
    setImagePreviewUrls([])
  }

  const cancelEdit = () => {
    setEditingPlan(null)
    setIsAdding(false)
    setFormData(emptyFloorPlan)
    setImageFiles([])
    setImagePreviewUrls([])
  }

  const viewDetails = (plan) => {
    setSelectedPlan(plan)
  }

  console.log('plan ', selectedPlan)

  const closeDetails = () => {
    setSelectedPlan(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "reserved":
        return "bg-yellow-100 text-yellow-800"
      case "sold":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "available":
        return "Available"
      case "reserved":
        return "Reserved"
      case "sold":
        return "Sold"
      default:
        return status
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Floor Plans</h2>
            <p className="text-sm text-gray-600 mt-1">{property.development_name || property.address || "Property"}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-gray-500">Loading floor plans...</div>
            </div>
          ) : (
            <>
              {/* Add Button */}
              {!isAdding && !editingPlan && (
                <button
                  onClick={startAdd}
                  className="mb-6 w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add New Floor Plan
                </button>
              )}

              {/* Add/Edit Form */}
              {(isAdding || editingPlan) && (
                <div className="mb-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    {editingPlan ? "Edit Floor Plan" : "Add New Floor Plan"}
                  </h3>

                  {/* Image Upload */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floor Plan Images</label>
                    <div className="flex flex-wrap gap-3 mb-3">
                      {/* Existing images */}
                      {formData.images &&
                        formData.images.map((img, idx) => (
                          <div key={`existing-${idx}`} className="relative">
                            <img
                              src={`${API_URI}/storage/${img}`}
                              alt={`Floor plan ${idx + 1}`}
                              className="w-32 h-32 rounded-lg border-2 border-gray-200"
                              style={{ objectFit: 'contain' }}
                            />
                            <button
                              onClick={() => removeExistingImage(idx)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      {/* New image previews */}
                      {imagePreviewUrls.map((url, idx) => (
                        <div key={`new-${idx}`} className="relative">
                          <img
                            src={url || "/placeholder.svg"}
                            alt={`New ${idx + 1}`}
                            className="w-32 h-32 object-contain rounded-lg border-2 border-blue-300"
                          />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {/* Upload button */}
                      <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mb-1" />
                        <span className="text-xs text-gray-500">Upload</span>
                        <input type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
                      </label>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Count</label>
                      <input
                        type="number"
                        name="room_count"
                        value={formData.room_count}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bedroom Count</label>
                      <input
                        type="number"
                        name="bedroom_count"
                        value={formData.bedroom_count}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bathroom Count</label>
                      <input
                        type="number"
                        name="bathroom_count"
                        value={formData.bathroom_count}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 2"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ceiling Height (m)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="ceiling_height"
                        value={formData.ceiling_height}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 3.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Area (m²)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="total_area"
                        value={formData.total_area}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 85.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Living Area (m²)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="living_area"
                        value={formData.living_area}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 65.0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price per m²</label>
                      <input
                        type="number"
                        step="0.01"
                        name="price_per_sqm"
                        value={formData.price_per_sqm}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 1500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Price</label>
                      <input
                        type="number"
                        step="0.01"
                        name="total_price"
                        value={formData.total_price}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 128250"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Floor Number</label>
                      <input
                        type="number"
                        name="floor"
                        value={formData.floor}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      <select
                        name="availability"
                        value={formData.availability}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                      </select>
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="has_balcony"
                          checked={formData.has_balcony}
                          onChange={handleInputChange}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Has Balcony</span>
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSave}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <Save className="w-5 h-5" />
                      Save Floor Plan
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors flex items-center justify-center gap-2 font-medium"
                    >
                      <XCircle className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Floor Plans List */}
              {floorPlans.length === 0 && !isAdding && !editingPlan ? (
                <div className="text-center py-16 text-gray-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">No floor plans yet</p>
                  <p className="text-sm">Click the button above to add your first floor plan</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {floorPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Image */}
                      <div className="relative h-48 bg-gray-100">
                        {plan.images && plan.images.length > 0 ? (
                          <img
                            src={`${API_URI}/storage/${plan.images[0]}`}
                            alt="Floor plan"
                            className="w-full h-full object-contain cursor-pointer"
                            onClick={() => viewDetails(plan)}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-12 h-12" />
                          </div>
                        )}
                        <span
                          className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(plan.availability)}`}
                        >
                          {getStatusText(plan.availability)}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <FiHome className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">{plan.room_count || 0} rooms</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <IoBedOutline className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">{plan.bedroom_count || 0} beds</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FiMaximize2 className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">{plan.total_area || 0} m²</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FiDollarSign className="w-4 h-4 text-blue-600" />
                            <span className="text-gray-700">${plan.total_price?.toLocaleString() || 0}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => viewDetails(plan)}
                            className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => startEdit(plan)}
                            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(plan.id)}
                            className="px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Detail View Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between z-10">
              <h3 className="text-2xl font-bold text-gray-900">Floor Plan Details</h3>
              <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Images Gallery */}
              {selectedPlan.images && selectedPlan.images.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Images</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedPlan.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={`${API_URI}/storage/${img}`}
                        alt={`Floor plan ${idx + 1}`}
                        className="w-full h-48 object-contain rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiHome className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Room Count</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedPlan.room_count || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IoBedOutline className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bedroom Count</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedPlan.bedroom_count || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MdBathroom className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Bathroom Count</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedPlan.bathroom_count || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TbRulerMeasure className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ceiling Height</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedPlan.ceiling_height ? `${selectedPlan.ceiling_height} m` : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiMaximize2 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Area</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedPlan.total_area ? `${selectedPlan.total_area} m²` : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <IoResizeOutline className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Living Area</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedPlan.living_area ? `${selectedPlan.living_area} m²` : "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiDollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price per m²</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${selectedPlan.price_per_sqm?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiDollarSign className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Price</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ${selectedPlan.total_price?.toLocaleString() || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FiLayers className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Floor Number</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedPlan.floor || "N/A"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <MdBalcony className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Balcony</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedPlan.has_balcony ? "Yes" : "No"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getStatusColor(selectedPlan.availability)}`}>
                    <span className="text-lg font-semibold">Status</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Availability</p>
                    <p className="text-lg font-semibold text-gray-900">{getStatusText(selectedPlan.availability)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FloorPlanManager
