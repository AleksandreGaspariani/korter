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
  FaTag,
  FaUser,
} from "react-icons/fa"
import axios from "../../plugins/axios"
import BuildingFormModal from "./BuildingForms/BuildingForm"

const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 pl-10 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"

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
      location: { lat: null, lng: null }, // always present as object
      images: [], // always present as array
      floorPlans: [], // always present as array
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
        await axios.post("/building", buildingData)
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

  const filteredBuildings = Array.isArray(buildings)
    ? buildings.filter((building) => {
        const matchesSearch =
          building.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          building.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          building.developer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          building.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          building.city?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = !filters.status || building.status === filters.status
        const matchesDevelopment =
          !filters.development || building.development_id === Number.parseInt(filters.development)
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
    : []

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
              {(Array.isArray(developments) ? developments : []).map((dev) => (
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
      <BuildingFormModal
        building={selectedBuilding}
        developments={developments}
        type={modalType}
        isOpen={showModal}
        onSave={handleSaveBuilding}
        onClose={() => setShowModal(false)}
      />
    </div>
  )
}

export default MyDevelopments
