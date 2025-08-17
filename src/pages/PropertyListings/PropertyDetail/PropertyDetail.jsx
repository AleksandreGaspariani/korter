import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import {
  FiShare2,
  FiHeart,
  FiChevronLeft,
  FiChevronRight,
  FiPhone,
  FiMessageSquare,
  FiMapPin,
  FiCalendar,
  FiHome,
} from "react-icons/fi"
import { BsWhatsapp } from "react-icons/bs"
import FloorPlans from "./FloorPlans"
import MapB from "../../../components/Map/MapB"
import PropertyListings from "../PropertyListings"
import PropertyCardGrid from "../../../components/PropertyCardGrid/PropertyCardGrid"

// Dummy properties array
const properties = [
  {
    id: 1,
    image: '../../../images/flat1.jpg',
    title: 'მეფე მირიანის ქუჩა, 98',
    district: 'საბურთალო',
    price: '99 969 ₾-დან',
    perM2: '2 840 ₾/მ²-ზე',
    developer: 'მალაყოს',
  },
  {
    id: 2,
    image: '../../../images/flat2.jpg',
    title: 'ალბლების ქ., 39',
    district: 'ისანი',
    price: 'ფასი მოცემულია',
    perM2: '2 488 ₾/მ²-ზე',
    developer: 'K3 დეველოპმენტი',
  },
  {
    id: 3,
    image: '../../../images/flat3.jpg',
    title: 'მოსკოვის გამზირი, 9ა',
    district: 'ისანი',
    price: '205 834 ₾-დან',
    perM2: '2 975 ₾/მ²-ზე',
    developer: 'New Line Construction',
  },
  {
    id: 4,
    image: '../../../images/flat4.png',
    title: 'Pillar Park Samgori',
    district: 'კახეთის გზატკეცილი 1ა',
    price: 'ფასი მოცემულია',
    perM2: '3 245 ₾/მ²-ზე',
    developer: 'Pillar Group, Pillar Park',
  },
]

// Helper to get property by id
const getPropertyById = (id) => properties.find(p => p.id === Number(id))

const PropertyDetail = ({ property, id: propId, onBack }) => {
  // Get id from URL params if not provided as prop
  const { id: urlId } = useParams()
  const id = propId || urlId

  const selectedProperty = property || (id ? getPropertyById(id) : null)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  // Use selectedProperty.image if available for main image
  const propertyImages = selectedProperty?.images || [
    selectedProperty?.image,
    "/modern-residential-complex-aerial.png",
    "/modern-apartment-exterior.png",
    "/residential-complex-courtyard.png",
    "/apartment-living-room.png",
    "/modern-kitchen.png",
  ].filter(Boolean)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === propertyImages.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? propertyImages.length - 1 : prev - 1))
  }

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited)
  }

  // Scroll to top when selectedProperty changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [selectedProperty])

  return (
    <div className="min-h-screen bg-gray-50 w-100 w-100">
      {/* Breadcrumb Navigation */}
      {/* <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={onBack} className="hover:text-blue-600 transition-colors">
              Korter
            </button>
            <span>›</span>
            <span>ბინების ნიმუშები თბილისი</span>
            <span>›</span>
            <span className="text-gray-900 font-medium">ნაყოფიერი</span>
          </nav>
        </div>
      </div> */}

      <div className="mx-auto container px-4 py-6 w-100">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={propertyImages[currentImageIndex] || "/placeholder.svg"}
                  alt={`Property view ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />

                {/* Image Navigation */}
                <div className="absolute inset-0 flex items-center justify-between p-4">
                  <button
                    onClick={prevImage}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                  >
                    <FiChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
                  >
                    <FiChevronRight size={20} />
                  </button>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-black/70 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                    {currentImageIndex + 1}/{propertyImages.length}
                  </div>
                </div>
              </div>

              {/* Image Thumbnails */}
              <div className="p-4 bg-gray-50">
                <div className="flex space-x-2 overflow-x-auto">
                  {propertyImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Property Information */}
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{selectedProperty?.title || "Ezo"}</h1>
                  <p className="text-gray-600">{selectedProperty?.district || "თბილისი"}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                    <FiShare2 size={20} />
                  </button>
                  <button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-lg transition-all ${
                      isFavorited ? "text-red-500 bg-red-50" : "text-gray-600 hover:text-red-500 hover:bg-red-50"
                    }`}
                  >
                    <FiHeart size={20} fill={isFavorited ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-700">
                  <FiMapPin className="mr-2 text-blue-600" size={16} />
                  <span>{selectedProperty?.address || "ვაკმათხევის ქუჩა, 20"}</span>
                </div>

                <div className="flex items-center text-gray-700">
                  <FiCalendar className="mr-2 text-green-600" size={16} />
                  <span>3 საზღვრო შენდება, უახლოესი ჩაბარება 4 კვ. 2026</span>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">მთლიანობაში ბინები</p>
                  <p className="text-xl font-bold text-gray-900">{selectedProperty?.price || "$85,361-დან"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">ფასი მ²-ზე</p>
                  <p className="text-xl font-bold text-gray-900">{selectedProperty?.perM2 || "$1,154-დან"}</p>
                </div>
              </div>
            </div>

            {/* Developer */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-3">
                <FiHome className="mr-2 text-blue-600" size={16} />
                <span className="text-sm text-gray-600">საშენებლო კომპანია</span>
              </div>
              <a href="#" className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors">
                {selectedProperty?.developer || "Apart Development"}
              </a>
            </div>

            {/* Agent Contact */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <img
                  src="/professional-woman-agent.png"
                  alt="Agent"
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">ლიდია მჭავარიანი</h3>
                  <p className="text-sm text-gray-600">უძრავი ქონების კონსულტანტი Korter</p>
                </div>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <FiPhone className="mr-2" size={18} />
                  ნომრის ჩვენება
                </button>

                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <FiMessageSquare className="mr-2" size={18} />
                  კითხვის დასმა
                </button>

                <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center">
                  <BsWhatsapp className="mr-2" size={18} />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <FloorPlans property={selectedProperty} />
      </div>

      <div className="m-0 p-0">
        <style>
          {`
            .mapboxgl-canvas {
              height: 400px;
              width: 100%;
            }
          `}
        </style>
        <MapB />
      </div>

      <div className="container mx-auto px-4 py-6 w-100">
        {/* <h2 className="text-2xl font-bold text-gray-900 mb-4">სხვა საცხოვრებელი კომპლექსი</h2> */}
        <PropertyCardGrid />
      </div>

    </div>
  )
}

export default PropertyDetail
