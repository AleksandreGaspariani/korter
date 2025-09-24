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
  FaCalendarAlt,
  FaEye,
} from "react-icons/fa"
import defaultInstance from "../../../plugins/axios"

const AdminDevelopments = () => {
  const [developments, setDevelopments] = useState([])
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDevelopment, setSelectedDevelopment] = useState(null)
  const [selectedBuilding, setSelectedBuilding] = useState(null)
  const [showDevelopmentModal, setShowDevelopmentModal] = useState(false)
  const [showBuildingModal, setShowBuildingModal] = useState(false)
  const [modalType, setModalType] = useState("view") // 'view', 'edit', 'create'
  const [activeTab, setActiveTab] = useState("developments") // 'developments', 'buildings'

  useEffect(() => {
    fetchDevelopments()
    fetchBuildings()
  }, [])

  const fetchDevelopments = async () => {
    try {
      const response = await defaultInstance.get("/admin/developments")
      setDevelopments(response.data.developments)
    } catch (error) {
      console.error("Error fetching developments:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchBuildings = async () => {
    try {
      const response = await defaultInstance.get("/admin/buildings")
      setBuildings(response.data.buildings)
    } catch (error) {
      console.error("Error fetching buildings:", error)
    }
  }

  const handleCreateDevelopment = () => {
    setSelectedDevelopment({
      name: "",
      nameEng: "",
      logo: "",
      location: "",
      established: "",
      specialization: [],
      featured: false,
      rating: 0,
      priceFrom: 0,
      projectCount: 0,
      completedProjects: 0,
    })
    setModalType("create")
    setShowDevelopmentModal(true)
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
    setShowBuildingModal(true)
  }

  const handleEditDevelopment = (development) => {
    setSelectedDevelopment(development)
    setModalType("edit")
    setShowDevelopmentModal(true)
  }

  const handleEditBuilding = (building) => {
    setSelectedBuilding(building)
    setModalType("edit")
    setShowBuildingModal(true)
  }

  const handleViewDevelopment = (development) => {
    setSelectedDevelopment(development)
    setModalType("view")
    setShowDevelopmentModal(true)
  }

  const handleViewBuilding = (building) => {
    setSelectedBuilding(building)
    setModalType("view")
    setShowBuildingModal(true)
  }

  const handleDeleteDevelopment = async (developmentId) => {
    if (window.confirm("Are you sure you want to delete this development? This will also affect related buildings.")) {
      try {
        await defaultInstance.delete(`/admin/developments/${developmentId}`)
        fetchDevelopments()
        fetchBuildings()
      } catch (error) {
        console.error("Error deleting development:", error)
        alert("Error deleting development")
      }
    }
  }

  const handleDeleteBuilding = async (buildingId) => {
    if (window.confirm("Are you sure you want to delete this building?")) {
      try {
        await defaultInstance.delete(`/admin/buildings/${buildingId}`)
        fetchBuildings()
      } catch (error) {
        console.error("Error deleting building:", error)
        alert("Error deleting building")
      }
    }
  }

  const handleSaveDevelopment = async (developmentData) => {
    try {
      if (modalType === "create") {
        await defaultInstance.post("/development", developmentData)
      } else {
        await defaultInstance.put(`/development/${selectedDevelopment.id}`, developmentData)
      }
      fetchDevelopments()
      setShowDevelopmentModal(false)
    } catch (error) {
      console.error("Error saving development:", error)
      alert("Error saving development")
    }
  }

  const handleSaveBuilding = async (buildingData) => {
    try {
      if (modalType === "create") {
        await defaultInstance.post("/building/", buildingData)
      } else {
        await defaultInstance.put(`/building/${selectedBuilding.id}`, buildingData)
      }
      fetchBuildings()
      setShowBuildingModal(false)
    } catch (error) {
      console.error("Error saving building:", error)
      alert("Error saving building")
    }
  }

  const filteredDevelopments = developments.filter(
    (dev) =>
      dev.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.nameEng?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dev.location?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredBuildings = buildings.filter(
    (building) =>
      building.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      building.developer?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getDevelopmentName = (developmentId) => {
    const dev = developments.find((d) => d.id === developmentId)
    return dev ? dev.name : "Unknown"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading developments...</div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaBuilding className="text-2xl text-green-600" />
          <h1 className="text-2xl font-bold text-gray-800">Developments & Buildings Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateDevelopment}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <FaPlus />
            Add Development
          </button>
          <button
            onClick={handleCreateBuilding}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaPlus />
            Add Building
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("developments")}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "developments"
              ? "border-green-500 text-green-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Developments ({developments.length})
        </button>
        <button
          onClick={() => setActiveTab("buildings")}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "buildings"
              ? "border-blue-500 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Buildings ({buildings.length})
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Developments Tab */}
      {activeTab === "developments" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Development
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stats
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
                {filteredDevelopments.map((development) => (
                  <tr key={development.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {development.logo ? (
                            <img
                              src={development.logo || "/placeholder.svg"}
                              alt={development.name}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                              <FaBuilding className="text-green-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{development.name}</div>
                          <div className="text-sm text-gray-500">{development.nameEng}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <FaMapMarkerAlt className="text-xs text-gray-400" />
                        <span className="text-sm text-gray-900">{development.location}</span>
                      </div>
                      {development.established && (
                        <div className="flex items-center gap-1 mt-1">
                          <FaCalendarAlt className="text-xs text-gray-400" />
                          <span className="text-xs text-gray-500">Est. {development.established}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center gap-1 mb-1">
                          <FaStar className="text-yellow-400 text-xs" />
                          <span>{development.rating || 0}/5</span>
                        </div>
                        <div className="text-xs text-gray-500">{development.projectCount || 0} projects</div>
                        <div className="text-xs text-gray-500">{development.completedProjects || 0} completed</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        {development.featured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                        {development.priceFrom > 0 && (
                          <span className="text-xs text-gray-600">From ${development.priceFrom?.toLocaleString()}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDevelopment(development)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Development"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEditDevelopment(development)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Edit Development"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteDevelopment(development.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Development"
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
        </div>
      )}

      {/* Buildings Tab */}
      {activeTab === "buildings" && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Building
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Development
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBuildings.map((building) => (
                  <tr key={building.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {building.mainImage ? (
                            <img
                              src={building.mainImage || "/placeholder.svg"}
                              alt={building.title}
                              className="h-12 w-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                              <FaBuilding className="text-blue-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{building.title}</div>
                          <div className="text-sm text-gray-500">{building.developer}</div>
                          {building.badge && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                              {building.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{building.address}</div>
                      <div className="text-sm text-gray-500">
                        {building.district}, {building.city}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>${building.price?.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          {building.area}m² • {building.bedrooms}bed • {building.bathrooms}bath
                        </div>
                        <div className="text-xs text-gray-500">
                          Floor {building.floor}/{building.totalFloors}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{getDevelopmentName(building.development_id)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewBuilding(building)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="View Building"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => handleEditBuilding(building)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Edit Building"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteBuilding(building.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete Building"
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
        </div>
      )}

      {/* Development Modal */}
      {showDevelopmentModal && (
        <DevelopmentModal
          development={selectedDevelopment}
          type={modalType}
          onSave={handleSaveDevelopment}
          onClose={() => setShowDevelopmentModal(false)}
        />
      )}

      {/* Building Modal */}
      {showBuildingModal && (
        <BuildingModal
          building={selectedBuilding}
          developments={developments}
          type={modalType}
          onSave={handleSaveBuilding}
          onClose={() => setShowBuildingModal(false)}
        />
      )}
    </div>
  )
}

// Development Modal Component
const DevelopmentModal = ({ development, type, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: development?.name || "",
    nameEng: development?.nameEng || "",
    logo: development?.logo || "",
    location: development?.location || "",
    established: development?.established || "",
    specialization: development?.specialization || [],
    featured: development?.featured || false,
    rating: development?.rating || 0,
    priceFrom: development?.priceFrom || 0,
    projectCount: development?.projectCount || 0,
    completedProjects: development?.completedProjects || 0,
  })

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSpecializationChange = (spec) => {
    setFormData((prev) => ({
      ...prev,
      specialization: prev.specialization.includes(spec)
        ? prev.specialization.filter((s) => s !== spec)
        : [...prev.specialization, spec],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const isReadOnly = type === "view"
  const specializationOptions = ["Residential", "Commercial", "Mixed-use", "Luxury", "Affordable", "Green Building"]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {type === "create" ? "Create Development" : type === "edit" ? "Edit Development" : "Development Details"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name (Georgian)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name (English)</label>
                <input
                  type="text"
                  value={formData.nameEng}
                  onChange={(e) => handleInputChange("nameEng", e.target.value)}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="url"
                  value={formData.logo}
                  onChange={(e) => handleInputChange("logo", e.target.value)}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Established Year</label>
                <input
                  type="number"
                  value={formData.established}
                  onChange={(e) => handleInputChange("established", e.target.value)}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Statistics & Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Statistics & Features</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => handleInputChange("rating", Number.parseFloat(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price From</label>
                  <input
                    type="number"
                    value={formData.priceFrom}
                    onChange={(e) => handleInputChange("priceFrom", Number.parseFloat(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Count</label>
                  <input
                    type="number"
                    value={formData.projectCount}
                    onChange={(e) => handleInputChange("projectCount", Number.parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Completed Projects</label>
                  <input
                    type="number"
                    value={formData.completedProjects}
                    onChange={(e) => handleInputChange("completedProjects", Number.parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange("featured", e.target.checked)}
                    disabled={isReadOnly}
                    className="rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Development</span>
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Specialization</label>
                <div className="grid grid-cols-2 gap-2">
                  {specializationOptions.map((spec) => (
                    <label key={spec} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.specialization.includes(spec)}
                        onChange={() => handleSpecializationChange(spec)}
                        disabled={isReadOnly}
                        className="rounded"
                      />
                      <span className="text-sm">{spec}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

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
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                {type === "create" ? "Create Development" : "Save Changes"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

// Building Modal Component
const BuildingModal = ({ building, developments, type, onSave, onClose }) => {
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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLocationChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      location: { ...prev.location, [field]: Number.parseFloat(value) },
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
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

            {/* Location & Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location & Details</h3>

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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Area (m²)</label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", Number.parseFloat(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per m²</label>
                  <input
                    type="number"
                    value={formData.pricePerSqm}
                    onChange={(e) => handleInputChange("pricePerSqm", Number.parseFloat(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange("bedrooms", Number.parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange("bathrooms", Number.parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Floor</label>
                  <input
                    type="number"
                    value={formData.floor}
                    onChange={(e) => handleInputChange("floor", Number.parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Floors</label>
                  <input
                    type="number"
                    value={formData.totalFloors}
                    onChange={(e) => handleInputChange("totalFloors", Number.parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>

            {/* Pricing & Descriptions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing & Descriptions</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", Number.parseFloat(e.target.value))}
                  disabled={isReadOnly}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => handleInputChange("rating", Number.parseFloat(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Views</label>
                  <input
                    type="number"
                    value={formData.views}
                    onChange={(e) => handleInputChange("views", Number.parseInt(e.target.value))}
                    disabled={isReadOnly}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Georgian)</label>
                <textarea
                  value={formData.description_ge}
                  onChange={(e) => handleInputChange("description_ge", e.target.value)}
                  disabled={isReadOnly}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Russian)</label>
                <textarea
                  value={formData.description_ru}
                  onChange={(e) => handleInputChange("description_ru", e.target.value)}
                  disabled={isReadOnly}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (English)</label>
                <textarea
                  value={formData.description_en}
                  onChange={(e) => handleInputChange("description_en", e.target.value)}
                  disabled={isReadOnly}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
                />
              </div>
            </div>
          </div>

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

export default AdminDevelopments
