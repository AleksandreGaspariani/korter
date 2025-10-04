"use client"

import { useState, useEffect } from "react"
import {
  FaHome,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaEye,
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaImage,
  FaDollarSign,
  FaFilter,
} from "react-icons/fa"
import defaultInstance from "../../../plugins/axios"

// Use import.meta.env for Vite, process.env for CRA, fallback to default
const BACK_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.REACT_APP_API_URL) ||
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
  "http://localhost:8000"

// Move helpers outside component so both can use them
// Helper to get array of photo URLs from property
function getPhotoArray(photos) {
  if (!photos) return []
  if (Array.isArray(photos)) return photos
  if (typeof photos === "string") {
    try {
      // Try to parse JSON string
      const parsed = JSON.parse(photos)
      if (Array.isArray(parsed)) return parsed
      // If not array, fallback to comma split
      return photos.split(",").map((p) => p.trim()).filter(Boolean)
    } catch {
      // Fallback: comma separated
      return photos.split(",").map((p) => p.trim()).filter(Boolean)
    }
  }
  return []
}

// Helper to get full image URL
function getImageUrl(path) {
  if (!path) return "/placeholder.svg"
  // Remove leading slash if present
  const cleanPath = path.replace(/^\//, "")
  return `${BACK_URL.replace(/\/$/, "")}/storage/${cleanPath}`
}

const PropertyManagement = () => {
  const [properties, setProperties] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("view") // 'view', 'edit', 'create'
  const [filters, setFilters] = useState({
    listing_type: "",
    property_type: "",
    property_status: "",
    city: "",
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchProperties()
    fetchUsers()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await defaultInstance.get("/admin/properties")
      setProperties(response.data.properties)
    } catch (error) {
      console.error("Error fetching properties:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await defaultInstance.get("/admin/users")
      setUsers(response.data.users)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleCreateProperty = () => {
    setSelectedProperty({
      listing_type: "sell",
      property_type: "flat",
      city: "",
      development_name: "",
      address: "",
      flat_number: "",
      building_id_mapbox: "",
      floor_number: 0,
      total_floors: 0,
      build_year: new Date().getFullYear(),
      cadastral_code: "",
      studio: false,
      penthouse: false,
      multifloor: false,
      freeplan: false,
      room_count: 1,
      bedroom_count: 1,
      bathroom_count: 1,
      total_area: 0,
      living_area: 0,
      kitchen_area: 0,
      land_area: 0,
      roof_height: 0,
      balcony: false,
      terrace: false,
      garage: false,
      playground: false,
      underground_parking: false,
      public_parking: false,
      no_parking: false,
      description_ge: "",
      description_ru: "",
      description_en: "",
      photos: [],
      video: "",
      price: 0,
      currency: "USD",
      commission: false,
      contact_name: "",
      contact_phone: "",
      contact_email: "",
      is_agent: false,
      status: "active",
      user_id: null,
    })
    setModalType("create")
    setShowModal(true)
  }

  const handleEditProperty = (property) => {
    setSelectedProperty(property)
    setModalType("edit")
    setShowModal(true)
  }

  const handleViewProperty = (property) => {
    setSelectedProperty(property)
    setModalType("view")
    setShowModal(true)
  }

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await defaultInstance.delete(`/admin/properties/${propertyId}`)
        fetchProperties()
      } catch (error) {
        console.error("Error deleting property:", error)
        alert("Error deleting property")
      }
    }
  }

  const handleSaveProperty = async (propertyData) => {
    try {
      if (modalType === "create") {
        await defaultInstance.post("/admin/properties", propertyData)
      } else {
        await defaultInstance.put(`/admin/properties/${selectedProperty.id}`, propertyData)
      }
      fetchProperties()
      setShowModal(false)
    } catch (error) {
      console.error("Error saving property:", error)
      alert("Error saving property")
    }
  }

  const handleFilterChange = (filterKey, value) => {
    setFilters((prev) => ({ ...prev, [filterKey]: value }))
  }

  const clearFilters = () => {
    setFilters({
      listing_type: "",
      property_type: "",
      property_status: "",
      city: "",
    })
  }

  const filteredProperties = Array.isArray(properties)
    ? properties.filter((property) => {
        const matchesSearch =
          property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.development_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.contact_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.city?.toLowerCase().includes(searchTerm.toLowerCase())

        // Use property_status and property_type for filtering
        const matchesFilters =
          (!filters.property_type || property.property_type === filters.property_type) &&
          (!filters.property_status || property.property_status === filters.property_status) &&
          (!filters.city || property.city?.toLowerCase().includes(filters.city.toLowerCase()))

        return matchesSearch && matchesFilters
      })
    : []

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId)
    return user ? user.name : "Unknown User"
  }

  const getPropertyTypeLabel = (type) => {
    const typeLabels = {
      building_complex: "Building Complex",
      cottage: "Cottage",
      commercial: "Commercial",
    }
    return typeLabels[type] || type
  }

  const getListingTypeLabel = (type) => {
    const typeLabels = {
      sell: "For Sale"
    }
    return typeLabels[type] || type
  }

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      sold: "bg-red-100 text-red-800",
      rented: "bg-blue-100 text-blue-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading properties...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaHome className="text-2xl text-purple-600" />
          <h1 className="text-2xl font-bold text-gray-800">Property Management</h1>
        </div>
        <button
          onClick={handleCreateProperty}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <FaPlus />
          Add Property
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search properties by address, development, contact, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FaFilter />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select
                  value={filters.property_type}
                  onChange={(e) => handleFilterChange("property_type", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
                >
                  <option value="">All Properties</option>
                  <option value="building_complex">Building Complex</option>
                  <option value="cottage">Cottage</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.property_status}
                  onChange={(e) => handleFilterChange("property_status", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
                >
                  <option value="">All Status</option>
                  <option value="available">Available</option>
                  <option value="sold">Sold</option>
                  <option value="pending">Pending</option>
                  {/* <option value="rented">Rented</option> */}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="Filter by city"
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button onClick={clearFilters} className="text-sm text-purple-600 hover:text-purple-800">
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* /* Properties Table */ }
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Property
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Details
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProperties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center">
                <div className="flex-shrink-0 h-12 w-12">
              {getPhotoArray(property.photos).length > 0 ? (
                <img
                  src={getImageUrl(getPhotoArray(property.photos)[0])}
                  alt="Property"
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <FaHome className="text-purple-600" />
                </div>
              )}
                </div>
                <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {getPropertyTypeLabel(property.property_type)}
              </div>
              <div className="text-sm text-gray-500">{getListingTypeLabel(property.listing_type)}</div>
              <div className="text-xs text-gray-400">ID: {property.id}</div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                <div className="flex items-center gap-1 mb-1">
              <FaMapMarkerAlt className="text-xs text-gray-400" />
              <span>{property.address || "No address"}</span>
                </div>
                <div className="text-xs text-gray-500">
              {property.city && `${property.city}, `}
              {property.development_name}
                </div>
                {property.flat_number && (
              <div className="text-xs text-gray-500">Flat: {property.flat_number}</div>
                )}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                <div>{property.total_area}m²</div>
                <div className="text-xs text-gray-500">
              {property.room_count} rooms • {property.bedroom_count} bed • {property.bathroom_count} bath
                </div>
                {property.floor_number && (
              <div className="text-xs text-gray-500">
                Floor {property.floor_number}/{property.total_floors}
              </div>
                )}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">
                {property.currency} {Number(property.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              {property.commission && <div className="text-xs text-green-600">Commission</div>}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">
                <div className="flex items-center gap-1 mb-1">
              <FaUser className="text-xs text-gray-400" />
              <span>{property.contact_name}</span>
                </div>
                {property.contact_phone && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <FaPhone className="text-xs" />
                <span>{property.contact_phone}</span>
              </div>
                )}
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                {property.is_agent === 0 ? "მესაკუთრე" : "აგენტი"}
              </span>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap flex justify-center flex-col items-start">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}
              >
                {property.property_status?.toUpperCase()}
              </span>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(property.created_at).toLocaleDateString()}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div className="flex items-center gap-2">
                <button
              onClick={() => handleViewProperty(property)}
              className="text-blue-600 hover:text-blue-900 p-1"
              title="View Property"
                >
              <FaEye />
                </button>
                <button
              onClick={() => handleEditProperty(property)}
              className="text-green-600 hover:text-green-900 p-1"
              title="Edit Property"
                >
              <FaEdit />
                </button>
                <button
              onClick={() => handleDeleteProperty(property.id)}
              className="text-red-600 hover:text-red-900 p-1"
              title="Delete Property"
                >
              <FaTrash />
                </button>
              </div>
            </td>
              </tr>
            ))}
          </tbody>
            </table>
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
          <FaHome className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || Object.values(filters).some((f) => f)
              ? "Try adjusting your search or filters."
              : "Get started by creating a new property."}
          </p>
            </div>
          )}
        </div>

        {/* Property Modal */}
      {showModal && (
        <PropertyModal
          property={selectedProperty}
          users={users}
          type={modalType}
          onSave={handleSaveProperty}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

// Property Modal Component
const PropertyModal = ({ property, users, type, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    listing_type: property?.listing_type || "sell",
    property_type: property?.property_type || "flat",
    city: property?.city || "",
    development_name: property?.development_name || "",
    address: property?.address || "",
    flat_number: property?.flat_number || "",
    building_id_mapbox: property?.building_id_mapbox || "",
    floor_number: property?.floor_number || 0,
    total_floors: property?.total_floors || 0,
    build_year: property?.build_year || new Date().getFullYear(),
    cadastral_code: property?.cadastral_code || "",
    studio: property?.studio || false,
    penthouse: property?.penthouse || false,
    multifloor: property?.multifloor || false,
    freeplan: property?.freeplan || false,
    room_count: property?.room_count || 1,
    bedroom_count: property?.bedroom_count || 1,
    bathroom_count: property?.bathroom_count || 1,
    total_area: property?.total_area || 0,
    living_area: property?.living_area || 0,
    kitchen_area: property?.kitchen_area || 0,
    land_area: property?.land_area || 0,
    roof_height: property?.roof_height || 0,
    balcony: property?.balcony || false,
    terrace: property?.terrace || false,
    garage: property?.garage || false,
    playground: property?.playground || false,
    underground_parking: property?.underground_parking || false,
    public_parking: property?.public_parking || false,
    no_parking: property?.no_parking || false,
    description_ge: property?.description_ge || "",
    description_ru: property?.description_ru || "",
    description_en: property?.description_en || "",
    photos: property?.photos || [],
    video: property?.video || "",
    price: property?.price || 0,
    currency: property?.currency || "USD",
    commission: property?.commission || false,
    contact_name: property?.contact_name || "",
    contact_phone: property?.contact_phone || "",
    contact_email: property?.contact_email || "",
    is_agent: property?.is_agent || false,
    status: property?.status || "active",
    user_id: property?.user_id || null,
  })

  const [activeTab, setActiveTab] = useState("basic")

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const isReadOnly = type === "view"

  const tabs = [
    { id: "basic", label: "Basic Info", icon: FaHome },
    { id: "location", label: "Location", icon: FaMapMarkerAlt },
    { id: "details", label: "Details", icon: FaHome },
    { id: "media", label: "Media", icon: FaImage },
    { id: "pricing", label: "Pricing", icon: FaDollarSign },
    { id: "contact", label: "Contact", icon: FaUser },
  ]

  // Helper for modal photo array
  const modalPhotoArray = getPhotoArray(formData.photos)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {type === "create" ? "Create Property" : type === "edit" ? "Edit Property" : "Property Details"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b bg-gray-50 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <tab.icon className="text-sm" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit}>
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Listing Type</label>
                    <select
                      value={formData.listing_type}
                      onChange={(e) => handleInputChange("listing_type", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    >
                      <option value="sell">For Sale</option>
                      <option value="rent">For Rent</option>
                      <option value="daily">Daily Rent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Type</label>
                    <select
                      value={formData.property_type}
                      onChange={(e) => handleInputChange("property_type", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    >
                      <option value="building_complex">Complex</option>
                      <option value="cottage">Cottage</option>
                      <option value="commercial">Commercial</option>
                      {/* <option value="land">Land</option> */}
                      {/* <option value="garage">Garage</option> */}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange("status", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="sold">Sold</option>
                      <option value="rented">Rented</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Owner</label>
                    <select
                      value={formData.user_id || ""}
                      onChange={(e) =>
                        handleInputChange("user_id", e.target.value ? Number.parseInt(e.target.value) : null)
                      }
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    >
                      <option value="">Select Owner</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Build Year</label>
                    <input
                      type="number"
                      value={formData.build_year}
                      onChange={(e) => handleInputChange("build_year", Number.parseInt(e.target.value))}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cadastral Code</label>
                    <input
                      type="text"
                      value={formData.cadastral_code}
                      onChange={(e) => handleInputChange("cadastral_code", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                {/* Property Features */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Property Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { key: "studio", label: "Studio" },
                      { key: "penthouse", label: "Penthouse" },
                      { key: "multifloor", label: "Multi-floor" },
                      { key: "freeplan", label: "Free Plan" },
                      { key: "balcony", label: "Balcony" },
                      { key: "terrace", label: "Terrace" },
                      { key: "garage", label: "Garage" },
                      { key: "playground", label: "Playground" },
                    ].map((feature) => (
                      <label key={feature.key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData[feature.key]}
                          onChange={(e) => handleInputChange(feature.key, e.target.checked)}
                          disabled={isReadOnly}
                          className="rounded"
                        />
                        <span className="text-sm">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Location Tab */}
            {activeTab === "location" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Development Name</label>
                    <input
                      type="text"
                      value={formData.development_name}
                      onChange={(e) => handleInputChange("development_name", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Flat Number</label>
                    <input
                      type="text"
                      value={formData.flat_number}
                      onChange={(e) => handleInputChange("flat_number", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floor Number</label>
                    <input
                      type="number"
                      value={formData.floor_number}
                      onChange={(e) => handleInputChange("floor_number", Number.parseInt(e.target.value))}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors</label>
                    <input
                      type="number"
                      value={formData.total_floors}
                      onChange={(e) => handleInputChange("total_floors", Number.parseInt(e.target.value))}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Building ID (Mapbox)</label>
                  <input
                    type="text"
                    value={formData.building_id_mapbox}
                    onChange={(e) => handleInputChange("building_id_mapbox", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Count</label>
                    <input
                      type="number"
                      value={formData.room_count}
                      onChange={(e) => handleInputChange("room_count", Number.parseInt(e.target.value))}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedroom Count</label>
                    <input
                      type="number"
                      value={formData.bedroom_count}
                      onChange={(e) => handleInputChange("bedroom_count", Number.parseInt(e.target.value))}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathroom Count</label>
                    <input
                      type="number"
                      value={formData.bathroom_count}
                      onChange={(e) => handleInputChange("bathroom_count", Number.parseInt(e.target.value))}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Area (m²)</label>
                    <input
                      type="number"
                      value={formData.total_area}
                      onChange={(e) => handleInputChange("total_area", Number.parseFloat(e.target.value))}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Living Area (m²)</label>
                    <input
                      type="number"
                      value={formData.living_area}
                      onChange={(e) => handleInputChange("living_area", Number.parseFloat(e.target.value))}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kitchen Area (m²)</label>
                    <input
                      type="number"
                      value={formData.kitchen_area}
                      onChange={(e) => handleInputChange("kitchen_area", Number.parseFloat(e.target.value))}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Land Area (m²)</label>
                    <input
                      type="number"
                      value={formData.land_area}
                      onChange={(e) => handleInputChange("land_area", Number.parseFloat(e.target.value))}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Roof Height (m)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.roof_height}
                    onChange={(e) => handleInputChange("roof_height", Number.parseFloat(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                  />
                </div>

                {/* Parking Options */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Parking Options</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { key: "underground_parking", label: "Underground Parking" },
                      { key: "public_parking", label: "Public Parking" },
                      { key: "no_parking", label: "No Parking" },
                    ].map((parking) => (
                      <label key={parking.key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData[parking.key]}
                          onChange={(e) => handleInputChange(parking.key, e.target.checked)}
                          disabled={isReadOnly}
                          className="rounded"
                        />
                        <span className="text-sm">{parking.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Descriptions */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Descriptions</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description (Georgian)</label>
                      <textarea
                        value={formData.description_ge}
                        onChange={(e) => handleInputChange("description_ge", e.target.value)}
                        disabled={isReadOnly}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description (Russian)</label>
                      <textarea
                        value={formData.description_ru}
                        onChange={(e) => handleInputChange("description_ru", e.target.value)}
                        disabled={isReadOnly}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Description (English)</label>
                      <textarea
                        value={formData.description_en}
                        onChange={(e) => handleInputChange("description_en", e.target.value)}
                        disabled={isReadOnly}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div className="space-y-6">
                {/* <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Photos (URLs, comma-separated or JSON array)</label>
                  <textarea
                    value={modalPhotoArray.join(", ")}
                    onChange={(e) =>
                      handleInputChange(
                        "photos",
                        e.target.value.trim().startsWith("[")
                          ? e.target.value
                          : e.target.value.split(",").map((url) => url.trim()).filter(Boolean)
                      )
                    }
                    disabled={isReadOnly}
                    rows={4}
                    placeholder='["property_photos/abc.jpg", "property_photos/def.jpg"] or property_photos/abc.jpg, property_photos/def.jpg'
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                  />
                </div> */}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (YouTube)</label>
                  <input
                    type="url"
                    value={formData.video}
                    onChange={(e) => handleInputChange("video", e.target.value)}
                    disabled={isReadOnly}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                  />
                </div>

                {/* Photo Preview */}
                {modalPhotoArray.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Photo Preview</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {modalPhotoArray.slice(0, 8).map((photo, index) => (
                        <div key={index} className="relative">
                          <img
                            src={getImageUrl(photo)}
                            alt={`Property photo ${index + 1}`}
                            className="w-full h-50 object-cover rounded-lg border"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=96&width=96&text=Image+Error"
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === "pricing" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange("currency", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GEL">GEL</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.commission}
                      onChange={(e) => handleInputChange("commission", e.target.checked)}
                      disabled={isReadOnly}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Commission Negotiable</span>
                  </label>
                </div>
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                    <input
                      type="text"
                      value={formData.contact_name}
                      onChange={(e) => handleInputChange("contact_name", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <input
                      type="tel"
                      value={formData.contact_phone}
                      onChange={(e) => handleInputChange("contact_phone", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                    <input
                      type="email"
                      value={formData.contact_email}
                      onChange={(e) => handleInputChange("contact_email", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-purple-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.is_agent}
                      onChange={(e) => handleInputChange("is_agent", e.target.checked)}
                      disabled={isReadOnly}
                      className="rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Is Agent</span>
                  </label>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                {isReadOnly ? "Close" : "Cancel"}
              </button>
              {!isReadOnly && (
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                  {type === "create" ? "Create Property" : "Save Changes"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PropertyManagement
