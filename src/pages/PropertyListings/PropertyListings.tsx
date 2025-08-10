import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  Filter,
  Map,
  Heart,
  Phone,
  MessageCircle,
  ChevronDown,
  MapPin,
  Building2,
  Star,
  Eye,
  Grid3X3,
  List,
} from "lucide-react"

interface Property {
  id: number
  title: string
  address: string
  price: number
  pricePerSqm: number
  area: number
  developer: string
  image: string
  rating: number
  views: number
  isFavorite: boolean
  status: "new" | "construction" | "completed"
  bedrooms: number
  bathrooms: number
  floor: string
  totalFloors: number
}

const PropertyListings = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("recommended")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  const properties: Property[] = [
    {
      id: 1,
      title: "Crystal Tbilisi",
      address: "დიღმის გზის ქუჩა, 1 კორპუსი",
      price: 111360,
      pricePerSqm: 3450,
      area: 32.3,
      developer: "კრისტალ ბილდინგი",
      image: "../../../images/flat1.jpg",
      rating: 4.8,
      views: 1250,
      isFavorite: false,
      status: "construction",
      bedrooms: 2,
      bathrooms: 1,
      floor: "15",
      totalFloors: 25,
    },
    {
      id: 2,
      title: "Monolith Ethno City",
      address: "ნაძალადევის ქუჩა N 34-ის მიმდებარე ტერიტორია",
      price: 178339,
      pricePerSqm: 3774,
      area: 47.2,
      developer: "მონოლითი ჯგუფი",
      image: "../../../images/flat2.jpg",
      rating: 4.6,
      views: 980,
      isFavorite: false,
      status: "new",
      bedrooms: 3,
      bathrooms: 2,
      floor: "8",
      totalFloors: 12,
    },
    {
      id: 3,
      title: "Avlabari by Index",
      address: "ბოტანიკის ქუჩა, 23 ისანი",
      price: 183248,
      pricePerSqm: 4313,
      area: 42.5,
      developer: "Index I Wealth Management",
      image: "../../../images/flat3.jpg",
      rating: 4.9,
      views: 1580,
      isFavorite: false,
      status: "construction",
      bedrooms: 2,
      bathrooms: 2,
      floor: "12",
      totalFloors: 18,
    },
    {
      id: 4,
      title: "Barcelo Tbilisi",
      address: "რიჩარდ ჰოლბრუკის ქუჩა, 12 ისანი",
      price: 237208,
      pricePerSqm: 3369,
      area: 70.4,
      developer: "ელიტ ბილდინგი",
      image: "../../../images/flat4.png",
      rating: 4.7,
      views: 2100,
      isFavorite: false,
      status: "completed",
      bedrooms: 3,
      bathrooms: 2,
      floor: "5",
      totalFloors: 20,
    },
    {
      id: 5,
      title: "Green Palace Residence",
      address: "ვაჟა-ფშაველას გამზირი, 45",
      price: 195500,
      pricePerSqm: 3850,
      area: 50.8,
      developer: "გრინ დეველოპმენტი",
      image: "../../../images/flat1.jpg",
      rating: 4.5,
      views: 890,
      isFavorite: false,
      status: "construction",
      bedrooms: 2,
      bathrooms: 1,
      floor: "10",
      totalFloors: 16,
    },
    {
      id: 6,
      title: "Sky Tower Premium",
      address: "აღმაშენებლის გამზირი, 156",
      price: 289000,
      pricePerSqm: 4200,
      area: 68.8,
      developer: "სკაი დეველოპერები",
      image: "../../../images/flat2.jpg",
      rating: 4.8,
      views: 1750,
      isFavorite: false,
      status: "new",
      bedrooms: 3,
      bathrooms: 2,
      floor: "22",
      totalFloors: 30,
    },
    {
      id: 7,
      title: "Urban Living Complex",
      address: "თბილისის ზღვის ქუჩა, 8",
      price: 156780,
      pricePerSqm: 3200,
      area: 49.0,
      developer: "ურბან ლაივინგი",
      image: "../../../images/flat3.jpg",
      rating: 4.4,
      views: 670,
      isFavorite: false,
      status: "construction",
      bedrooms: 2,
      bathrooms: 1,
      floor: "7",
      totalFloors: 14,
    },
    {
      id: 8,
      title: "Elite Residence Saburtalo",
      address: "ალექსანდრე ყაზბეგის გამზირი, 19",
      price: 312450,
      pricePerSqm: 4500,
      area: 69.4,
      developer: "ელიტ რეზიდენსი",
      image: "../../../images/flat4.png",
      rating: 4.9,
      views: 2300,
      isFavorite: false,
      status: "completed",
      bedrooms: 3,
      bathrooms: 3,
      floor: "18",
      totalFloors: 25,
    },
  ]

  const toggleFavorite = (propertyId: number) => {
    setFavorites((prev) => (prev.includes(propertyId) ? prev.filter((id) => id !== propertyId) : [...prev, propertyId]))
  }

  const getStatusBadge = (status: Property["status"]) => {
    const badges = {
      new: { text: "ახალი", color: "bg-green-100 text-green-700" },
      construction: { text: "მშენებარე", color: "bg-blue-100 text-blue-700" },
      completed: { text: "დასრულებული", color: "bg-gray-100 text-gray-700" },
    }
    return badges[status]
  }

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.developer.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen py-8 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ახალაშენებული და მშენებარე ბინები თბილისში
          </h1>
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
                placeholder="რაიონები, მიკრორაიონები და შენობა"
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

              <Link
                to="/map"
                className="flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 font-medium"
              >
                <Map className="w-5 h-5 mr-2" />
                რუკაზე
              </Link>
            </div>
          </div>

          {/* Advanced Filters (Collapsible) */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid md:grid-cols-4 gap-4">
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>ფასი</option>
                  <option>50,000 - 100,000</option>
                  <option>100,000 - 200,000</option>
                  <option>200,000+</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>ოთახები</option>
                  <option>1 ოთახი</option>
                  <option>2 ოთახი</option>
                  <option>3+ ოთახი</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>სტატუსი</option>
                  <option>ახალი</option>
                  <option>მშენებარე</option>
                  <option>დასრულებული</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>ფართობი</option>
                  <option>30-50 მ²</option>
                  <option>50-70 მ²</option>
                  <option>70+ მ²</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <p className="text-gray-600">
              <span className="font-semibold text-blue-600">{filteredProperties.length}</span> სამშენებლო კომპლექსი
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
              <option value="recommended">Homeinfo-ს რეკომენდაციით</option>
              <option value="price-low">ფასი: დაბალიდან მაღალამდე</option>
              <option value="price-high">ფასი: მაღალიდან დაბალამდე</option>
              <option value="newest">ყველაზე ახალი</option>
              <option value="rating">რეიტინგით</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Property Grid */}
        <div
          className={`grid gap-6 ${
            viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden group ${
                viewMode === "list" ? "flex" : ""
              }`}
            >
              {/* Property Image */}
              <div className={`relative ${viewMode === "list" ? "w-80 flex-shrink-0" : ""}`}>
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                    viewMode === "list" ? "h-full" : "h-48"
                  }`}
                />

                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(property.status).color}`}
                  >
                    {getStatusBadge(property.status).text}
                  </span>
                </div>

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(property.id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors duration-200"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favorites.includes(property.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                    }`}
                  />
                </button>

                {/* Rating and Views */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                    <span className="text-xs font-medium">{property.rating}</span>
                  </div>
                  <div className="flex items-center bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <Eye className="w-3 h-3 text-gray-600 mr-1" />
                    <span className="text-xs font-medium">{property.views}</span>
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="p-6 flex-1">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {property.title}
                  </h3>
                  <div className="flex items-start text-gray-600 text-sm">
                    <MapPin className="w-4 h-4 mr-1 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{property.address}</span>
                  </div>
                </div>

                {/* Property Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4 text-sm">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                    <div className="text-gray-500 text-xs">ოთახი</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">{property.area}მ²</div>
                    <div className="text-gray-500 text-xs">ფართობი</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="font-semibold text-gray-900">
                      {property.floor}/{property.totalFloors}
                    </div>
                    <div className="text-gray-500 text-xs">სართული</div>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{property.price.toLocaleString()} ₾</div>
                  <div className="text-sm text-gray-500">
                    {property.pricePerSqm.toLocaleString()} ₾/მ² • {property.area} მ²
                  </div>
                </div>

                {/* Developer */}
                <div className="mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building2 className="w-4 h-4 mr-2" />
                    <span>{property.developer}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium">
                    <Phone className="w-4 h-4 mr-2" />
                    დარეკვა
                  </button>
                  <button className="flex items-center justify-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors duration-200">
                    <MessageCircle className="w-4 h-4" />
                  </button>
                </div>
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
      </div>
    </div>
  )
}

export default PropertyListings
