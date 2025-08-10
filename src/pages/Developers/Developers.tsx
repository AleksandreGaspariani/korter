"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  Filter,
  Building2,
  MapPin,
  Star,
  Grid3X3,
  List,
  ChevronDown,
  ExternalLink,
  Award,
  TrendingUp,
} from "lucide-react"

interface Developer {
  id: number
  name: string
  nameEng: string
  logo: string
  priceFrom: number
  projectCount: number
  projects: string[]
  rating: number
  completedProjects: number
  location: string
  established: number
  specialization: string[]
  featured: boolean
}

const DevelopersListing = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("featured")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSpecialization, setSelectedSpecialization] = useState("all")

  const developers: Developer[] = [
    {
      id: 1,
      name: "არქი",
      nameEng: "Arqi",
      logo: "../../../public/images/next.svg",
      priceFrom: 2162,
      projectCount: 15,
      projects: ["Archi Universi", "Archi Kikvidze Garden", "Archi Isani", "Archi Varketili"],
      rating: 4.8,
      completedProjects: 12,
      location: "თბილისი",
      established: 2010,
      specialization: ["Residential", "Commercial"],
      featured: true,
    },
    {
      id: 2,
      name: "Next Group",
      nameEng: "Next Group",
      logo: "../../../public/images/next.svg",
      priceFrom: 4717,
      projectCount: 8,
      projects: ["Tbilisi Downtown", "Next Saburtalo", "Next Dighomi"],
      rating: 4.6,
      completedProjects: 6,
      location: "თბილისი",
      established: 2015,
      specialization: ["Luxury", "Commercial"],
      featured: true,
    },
    {
      id: 3,
      name: "იეორი კაპიტალი",
      nameEng: "Ieori Capital",
      logo: "../../../public/images/next.svg",
      priceFrom: 1981,
      projectCount: 6,
      projects: ["Filigreen 2", "White Square Mindeli", "Green Valley"],
      rating: 4.5,
      completedProjects: 4,
      location: "თბილისი",
      established: 2018,
      specialization: ["Eco-friendly", "Residential"],
      featured: false,
    },
    {
      id: 4,
      name: "Apart Development",
      nameEng: "Apart Development",
      logo: "../../../public/images/next.svg",
      priceFrom: 3111,
      projectCount: 10,
      projects: ["Ezo", "Krtsanisi Margaliti", "Apart Vake", "Apart Saburtalo"],
      rating: 4.7,
      completedProjects: 8,
      location: "თბილისი",
      established: 2012,
      specialization: ["Premium", "Residential"],
      featured: true,
    },
    {
      id: 5,
      name: "m²",
      nameEng: "m²",
      logo: "../../../public/images/next.svg",
      priceFrom: 2695,
      projectCount: 12,
      projects: ["m² Highlight", "m² Mtatsminda Park", "m² Vera", "m² Digomi"],
      rating: 4.4,
      completedProjects: 9,
      location: "თბილისი",
      established: 2016,
      specialization: ["Modern", "Residential"],
      featured: false,
    },
    {
      id: 6,
      name: "X2 დეველოპმენტი",
      nameEng: "X2 Development",
      logo: "../../../public/images/next.svg",
      priceFrom: 2156,
      projectCount: 7,
      projects: ["Kazbegi Residence", "ZenX Dighomi", "X2 Towers"],
      rating: 4.3,
      completedProjects: 5,
      location: "თბილისი",
      established: 2019,
      specialization: ["Contemporary", "Mixed-use"],
      featured: false,
    },
    {
      id: 7,
      name: "Metropol",
      nameEng: "Metropol",
      logo: "../../../public/images/next.svg",
      priceFrom: 2873,
      projectCount: 9,
      projects: ["Metropol Ortachala", "Metropol Kavtaradze", "Metro Plaza"],
      rating: 4.6,
      completedProjects: 7,
      location: "თბილისი",
      established: 2014,
      specialization: ["Urban", "Commercial"],
      featured: true,
    },
    {
      id: 8,
      name: "Blox",
      nameEng: "Blox",
      logo: "../../../public/images/next.svg",
      priceFrom: 2830,
      projectCount: 11,
      projects: ["Blox Krtsanisi", "Blox Didi Dighomi", "Blox Center", "Blox Residence"],
      rating: 4.5,
      completedProjects: 8,
      location: "თბილისი",
      established: 2017,
      specialization: ["Innovative", "Residential"],
      featured: false,
    },
  ]

  const specializations = ["all", "Residential", "Commercial", "Luxury", "Eco-friendly", "Premium", "Modern"]

  const filteredDevelopers = developers.filter((developer) => {
    const matchesSearch =
      developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      developer.nameEng.toLowerCase().includes(searchTerm.toLowerCase()) ||
      developer.projects.some((project) => project.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesSpecialization =
      selectedSpecialization === "all" || developer.specialization.includes(selectedSpecialization)

    return matchesSearch && matchesSpecialization
  })

  const sortedDevelopers = [...filteredDevelopers].sort((a, b) => {
    switch (sortBy) {
      case "featured":
        return b.featured ? 1 : -1
      case "rating":
        return b.rating - a.rating
      case "projects":
        return b.projectCount - a.projectCount
      case "price-low":
        return a.priceFrom - b.priceFrom
      case "price-high":
        return b.priceFrom - a.priceFrom
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen py-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">სამშენებლო კომპანიები თბილისში</h1>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="ძებნა კომპანიის სახელით ან პროექტით"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200 font-medium"
              >
                <Filter className="w-5 h-5 mr-2" />
                ფილტრები
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-3 gap-4">
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">ყველა სპეციალიზაცია</option>
                  {specializations.slice(1).map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>ფასის დიაპაზონი</option>
                  <option>1000-2000 ₾/მ²</option>
                  <option>2000-3000 ₾/მ²</option>
                  <option>3000+ ₾/მ²</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>პროექტების რაოდენობა</option>
                  <option>1-5 პროექტი</option>
                  <option>6-10 პროექტი</option>
                  <option>10+ პროექტი</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              <span className="font-semibold text-blue-600">{filteredDevelopers.length}</span> კომპანია
            </p>

            {/* View Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "grid" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === "list" ? "bg-white shadow-sm text-blue-600" : "text-gray-500"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="featured">რეკომენდებული</option>
              <option value="rating">რეიტინგით</option>
              <option value="projects">პროექტების რაოდენობით</option>
              <option value="price-low">ფასი: დაბალიდან მაღალამდე</option>
              <option value="price-high">ფასი: მაღალიდან დაბალამდე</option>
              <option value="name">სახელით</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Developers Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {sortedDevelopers.map((developer) => (
            <div
              key={developer.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              {/* Developer Logo */}
              <div className={`relative ${viewMode === "list" ? "w-32 flex-shrink-0" : ""}`}>
                <div
                  className={`bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center ${
                    viewMode === "list" ? "h-full" : "h-32"
                  }`}
                >
                  <img
                    src={developer.logo || "/placeholder.svg"}
                    alt={developer.nameEng}
                    className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Featured Badge */}
                {developer.featured && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                      <Award className="w-3 h-3 mr-1" />
                      VIP
                    </div>
                  </div>
                )}

                {/* Rating */}
                <div className="absolute bottom-2 left-2">
                  <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-xs font-medium">{developer.rating}</span>
                  </div>
                </div>
              </div>

              {/* Developer Details */}
              <div className="p-6 flex-1">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                    {developer.name}
                  </h3>
                  {developer.nameEng !== developer.name && (
                    <p className="text-sm text-gray-500 font-medium">{developer.nameEng}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <div className="font-semibold text-blue-700">{developer.projectCount}</div>
                    <div className="text-blue-600 text-xs">პროექტი</div>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-700">{developer.completedProjects}</div>
                    <div className="text-green-600 text-xs">დასრულებული</div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="text-lg font-bold text-gray-900">{developer.priceFrom.toLocaleString()} ₾-დან</div>
                  <div className="text-sm text-gray-500">მ²-ზე</div>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {developer.specialization.slice(0, 2).map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Projects */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">პროექტები:</h4>
                  <div className="space-y-1">
                    {developer.projects.slice(0, viewMode === "list" ? 4 : 3).map((project, index) => (
                      <Link
                        key={index}
                        to={`/project/${project.toLowerCase().replace(/\s+/g, "-")}`}
                        className="block text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                      >
                        {project}
                      </Link>
                    ))}
                    {developer.projects.length > (viewMode === "list" ? 4 : 3) && (
                      <span className="text-xs text-gray-500">
                        +{developer.projects.length - (viewMode === "list" ? 4 : 3)} მეტი
                      </span>
                    )}
                  </div>
                </div>

                {/* Company Info */}
                <div className="mb-4 pb-4 border-b border-gray-100 text-xs text-gray-500">
                  <div className="flex items-center mb-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{developer.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Building2 className="w-3 h-3 mr-1" />
                    <span>დაარსდა {developer.established} წელს</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/developer/${developer.id}`}
                  className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-all duration-200 font-medium group"
                >
                  <span>დეტალურად</span>
                  <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1">
            მეტის ნახვა
          </button>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
            <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-blue-600">150+</div>
            <div className="text-sm text-gray-600">აქტიური დეველოპერი</div>
          </div>
          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
            <Building2 className="w-8 h-8 text-indigo-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-indigo-600">2,500+</div>
            <div className="text-sm text-gray-600">პროექტი</div>
          </div>
          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
            <Award className="w-8 h-8 text-cyan-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-cyan-600">45,000+</div>
            <div className="text-sm text-gray-600">ბინა</div>
          </div>
          <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
            <Star className="w-8 h-8 text-yellow-500 mx-auto mb-3" />
            <div className="text-2xl font-bold text-yellow-600">4.6</div>
            <div className="text-sm text-gray-600">საშუალო რეიტინგი</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DevelopersListing
