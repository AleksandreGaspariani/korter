"use client"

import { useState, useEffect } from "react"
import {
  FaBuilding,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaStar,
  FaMapMarkerAlt,
  FaEye,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaDollarSign,
} from "react-icons/fa"
import axios from "../../plugins/axios"

const MyDevelopments = () => {
  const [buildings, setBuildings] = useState([])
  const [developments, setDevelopments] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState("view") // 'view', 'edit', 'create'
  const [filters, setFilters] = useState({
    status: "",
    development: "",
    priceRange: "",
    bedrooms: "",
  })

  useEffect(() => {
    fetchBuildings()
    fetchDevelopments()
    fetchUsers()
  }, [])

  const fetchBuildings = async () => {
    try {
      const response = await axios.get("/admin/buildings")
      setBuildings(response.data)
    } catch (error) {
      console.error("Error fetching buildings:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDevelopments = async () => {
    try {
      const response = await axios.get("/admin/developments")
      setDevelopments(response.data)
    } catch (error) {
      console.error("Error fetching developments:", error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/admin/users")
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const handleCreateBuilding = () => {
    setSelectedBuilding({
      title: "",
      address: "",
      district: "",
      city: "",
      developer: "",
      price: 0,
      pricePerSqm: 0,
      area: 0,
      bedrooms: 0,
      bathrooms: 0,
      floor: 0,
      totalFloors: 0,
      status: "available",
      rating: 0,
      views: 0,
      mainImage: "",
      badge: "",
      location: { lat: 0, lng: 0 },
      description_ge: "",
      description_ru: "",
      description_en: "",
      development_id: null,
    })
    setModalType("create")
    setShowModal(true)
  }

  const handleEditBuilding = (building) => {
    setSelectedBuilding(building)
    setModalType("edit")
    setShowModal(true)
  }

  const handleViewBuilding = (building) => {
    setSelectedBuilding(building)
    setModalType("view")
    setShowModal(true)
  }

  const handleDeleteBuilding = async (buildingId) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      try {
        await axios.delete(`/admin/buildings/${buildingId}`)
        fetchBuildings()
      } catch (error) {
        console.error("Error deleting building:", error)
        alert("Error deleting building")
      }
    }
  }

  const handleSaveBuilding = async (buildingData) => {
    try {
      if (modalType === "create") {
        await axios.post("/admin/buildings", buildingData)
      } else {
        await axios.put(`/admin/buildings/${selectedBuilding.id}`, buildingData)
      }
      fetchBuildings()
      setShowModal(false)
    } catch (error) {
      console.error("Error saving building:", error)
      alert("Error saving building")
    }
  }

  const getDevelopmentName = (developmentId) => {
    const dev = developments.find((d) => d.id === developmentId)
    return dev ? dev.name : "Unknown"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800"
      case "sold":
        return "bg-red-100 text-red-800"
      case "reserved":
        return "bg-yellow-100 text-yellow-800"
      case "under_construction":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBuildings = buildings.filter((building) => {
    const matchesSearch =
      building.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.developer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.city?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = !filters.status || building.status === filters.status
    const matchesDevelopment = !filters.development || building.development_id === Number.parseInt(filters.development)
    const matchesBedrooms = !filters.bedrooms || building.bedrooms === Number.parseInt(filters.bedrooms)

    let matchesPriceRange = true
    if (filters.priceRange) {
      const price = building.price || 0
      switch (filters.priceRange) {
        case "0-100000":
          matchesPriceRange = price <= 100000
          break
        case "100000-300000":
          matchesPriceRange = price > 100000 && price <= 300000
          break
        case "300000-500000":
          matchesPriceRange = price > 300000 && price <= 500000
          break
        case "500000+":
          matchesPriceRange = price > 500000
          break
      }
    }

    return matchesSearch && matchesStatus && matchesDevelopment && matchesBedrooms && matchesPriceRange
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading buildings...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaBuilding className="text-2xl text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-800">Buildings Management</h1>
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
            {filteredBuildings.length} buildings
          </span>
        </div>
        <button
          onClick={handleCreateBuilding}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus />
          Add Building
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search buildings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="reserved">Reserved</option>
              <option value="under_construction">Under Construction</option>
            </select>
          </div>

          {/* Development Filter */}
          <div>
            <select
              value={filters.development}
              onChange={(e) => setFilters((prev) => ({ ...prev, development: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">All Developments</option>
              {developments.map((dev) => (
                <option key={dev.id} value={dev.id}>
                  {dev.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div>
            <select
              value={filters.priceRange}
              onChange={(e) => setFilters((prev) => ({ ...prev, priceRange: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">All Prices</option>
              <option value="0-100000">$0 - $100K</option>
              <option value="100000-300000">$100K - $300K</option>
              <option value="300000-500000">$300K - $500K</option>
              <option value="500000+">$500K+</option>
            </select>
          </div>

          {/* Bedrooms Filter */}
          <div>
            <select
              value={filters.bedrooms}
              onChange={(e) => setFilters((prev) => ({ ...prev, bedrooms: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">All Bedrooms</option>
              <option value="1">1 Bedroom</option>
              <option value="2">2 Bedrooms</option>
              <option value="3">3 Bedrooms</option>
              <option value="4">4+ Bedrooms</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buildings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBuildings.map((building) => (
          <div
            key={building.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Building Image */}
            <div className="relative h-48">
              {building.mainImage ? (
                <img
                  src={building.mainImage || "/placeholder.svg"}
                  alt={building.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FaBuilding className="text-4xl text-gray-400" />
                </div>
              )}
              {building.badge && (
                <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded">
                  {building.badge}
                </span>
              )}
              <span
                className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded ${getStatusColor(building.status)}`}
              >
                {building.status.replace("_", " ").toUpperCase()}
              </span>
            </div>

            {/* Building Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{building.title}</h3>
                <div className="flex items-center gap-1 text-yellow-500">
                  <FaStar className="text-xs" />
                  <span className="text-xs text-gray-600">{building.rating || 0}</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-gray-600 mb-2">
                <FaMapMarkerAlt className="text-xs" />
                <span className="text-sm truncate">{building.address}</span>
              </div>

              <div className="text-sm text-gray-500 mb-3">
                {building.district}, {building.city}
              </div>

              {/* Building Details */}
              <div className="grid grid-cols-3 gap-2 mb-3 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <FaRulerCombined />
                  <span>{building.area}m²</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaBed />
                  <span>{building.bedrooms}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FaBath />
                  <span>{building.bathrooms}</span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  <FaDollarSign className="text-sm" />
                  <span>{building.price?.toLocaleString()}</span>
                </div>
                <div className="text-xs text-gray-500">${building.pricePerSqm}/m²</div>
              </div>

              {/* Development */}
              <div className="text-xs text-gray-500 mb-3">
                <span className="font-medium">Development:</span> {getDevelopmentName(building.development_id)}
              </div>

              {/* Floor Info */}
              <div className="text-xs text-gray-500 mb-4">
                Floor {building.floor} of {building.totalFloors}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleViewBuilding(building)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="View Building"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleEditBuilding(building)}
                    className="text-green-600 hover:text-green-800 p-1"
                    title="Edit Building"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteBuilding(building.id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete Building"
                  >
                    <FaTrash />
                  </button>
                </div>
                <div className="text-xs text-gray-400">{building.views} views</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredBuildings.length === 0 && (
        <div className="text-center py-12">
          <FaBuilding className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No buildings found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || Object.values(filters).some((f) => f)
              ? "Try adjusting your search or filters"
              : "Get started by adding your first building"}
          </p>
          <button
            onClick={handleCreateBuilding}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Add Building
          </button>
        </div>
      )}

      {/* Building Modal */}
      {showModal && (
        <BuildingModal
          building={selectedBuilding}
          developments={developments}
          users={users}
          type={modalType}
          onSave={handleSaveBuilding}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

// Building Modal Component
const BuildingModal = ({ building, developments, users, type, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: building?.title || "",
    address: building?.address || "",
    district: building?.district || "",
    city: building?.city || "",
    developer: building?.developer || "",
    price: building?.price || 0,
    pricePerSqm: building?.pricePerSqm || 0,
    area: building?.area || 0,
    bedrooms: building?.bedrooms || 0,
    bathrooms: building?.bathrooms || 0,
    floor: building?.floor || 0,
    totalFloors: building?.totalFloors || 0,
    status: building?.status || "available",
    rating: building?.rating || 0,
    views: building?.views || 0,
    mainImage: building?.mainImage || "",
    badge: building?.badge || "",
    location: building?.location || { lat: 0, lng: 0 },
    description_ge: building?.description_ge || "",
    description_ru: building?.description_ru || "",
    description_en: building?.description_en || "",
    development_id: building?.development_id || null,
  })

  const [activeTab, setActiveTab] = useState("basic")

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLocationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: Number.parseFloat(value) || 0 },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const isReadOnly = type === "view"
  const statusOptions = ["available", "sold", "reserved", "under_construction"]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {type === "create" ? "Create Building" : type === "edit" ? "Edit Building" : "Building Details"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab("basic")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "basic"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Basic Info
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "details"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Details & Location
          </button>
          <button
            onClick={() => setActiveTab("descriptions")}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === "descriptions"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Descriptions
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info Tab */}
          {activeTab === "basic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Developer</label>
                  <input
                    type="text"
                    value={formData.developer}
                    onChange={(e) => handleInputChange("developer", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Development</label>
                  <select
                    value={formData.development_id || ""}
                    onChange={(e) =>
                      handleInputChange("development_id", e.target.value ? Number.parseInt(e.target.value) : null)
                    }
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  >
                    <option value="">Select Development</option>
                    {developments.map((dev) => (
                      <option key={dev.id} value={dev.id}>
                        {dev.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ").toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => handleInputChange("badge", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    placeholder="e.g., New, Hot Deal, Premium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Image URL</label>
                  <input
                    type="url"
                    value={formData.mainImage}
                    onChange={(e) => handleInputChange("mainImage", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pricing & Statistics</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value) || 0)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price per m² ($)</label>
                    <input
                      type="number"
                      value={formData.pricePerSqm}
                      onChange={(e) => handleInputChange("pricePerSqm", Number.parseFloat(e.target.value) || 0)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating (0-5)</label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => handleInputChange("rating", Number.parseFloat(e.target.value) || 0)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Views</label>
                    <input
                      type="number"
                      value={formData.views}
                      onChange={(e) => handleInputChange("views", Number.parseInt(e.target.value) || 0)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Details & Location Tab */}
          {activeTab === "details" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Location Details</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                    <input
                      type="text"
                      value={formData.district}
                      onChange={(e) => handleInputChange("district", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.location.lat}
                      onChange={(e) => handleLocationChange("lat", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={formData.location.lng}
                      onChange={(e) => handleLocationChange("lng", e.target.value)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Property Details</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Area (m²)</label>
                    <input
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleInputChange("area", Number.parseFloat(e.target.value) || 0)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange("bedrooms", Number.parseInt(e.target.value) || 0)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange("bathrooms", Number.parseInt(e.target.value) || 0)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                    <input
                      type="number"
                      value={formData.floor}
                      onChange={(e) => handleInputChange("floor", Number.parseInt(e.target.value) || 0)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors</label>
                    <input
                      type="number"
                      value={formData.totalFloors}
                      onChange={(e) => handleInputChange("totalFloors", Number.parseInt(e.target.value) || 0)}
                      disabled={isReadOnly}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Descriptions Tab */}
          {activeTab === "descriptions" && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Property Descriptions</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Georgian)</label>
                <textarea
                  value={formData.description_ge}
                  onChange={(e) => handleInputChange("description_ge", e.target.value)}
                  disabled={isReadOnly}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Enter description in Georgian..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Russian)</label>
                <textarea
                  value={formData.description_ru}
                  onChange={(e) => handleInputChange("description_ru", e.target.value)}
                  disabled={isReadOnly}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Enter description in Russian..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (English)</label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => handleInputChange("description_en", e.target.value)}
                  disabled={isReadOnly}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  placeholder="Enter description in English..."
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {isReadOnly ? "Close" : "Cancel"}
            </button>
            {!isReadOnly && (
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                {type === "create" ? "Create Building" : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default MyDevelopments
