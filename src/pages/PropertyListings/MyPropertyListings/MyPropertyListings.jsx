import React, { useState, useEffect } from 'react'
import defaultInstance from '../../../plugins/axios'
import { Bed, Square, MapPin, Clock, X } from "lucide-react"
import labels from '../../PropertyListings/PropertyLabels.json'

const API_URI = import.meta.env.VITE_API_URI
  ? import.meta.env.VITE_API_URI.replace(/\/api\/?$/, '')
  : 'http://localhost:8000';

const getLabel = (key) => labels[key] || key

const MyPropertyListings = () => {
  const [listings, setListings] = useState([])
  const [view, setView] = useState('list')
  const [selected, setSelected] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await defaultInstance.get('/property/my/listings')
        setListings(Array.isArray(response.data.properties) ? response.data.properties : [])
      } catch (error) {
        console.error('Error fetching my property listings:', error)
        setListings([])
      }
    }
    fetchListings()
  }, [])

  const openModal = (listing) => {
    setSelected(listing)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelected(null)
  }

  // Helper to render images (array or single)
  const renderImages = (listing) => {
    // If photos is a stringified array, parse it
    let images = [];
    if (Array.isArray(listing.photos)) {
      images = listing.photos;
    } else if (typeof listing.photos === 'string') {
      try {
        images = JSON.parse(listing.photos);
      } catch {
        images = [];
      }
    }
    // Build full URLs for images
    return (
      <div className="flex gap-2 overflow-x-auto mb-4">
        {images.length > 0 ? images.map((img, idx) => (
          <img
            key={idx}
            src={`${API_URI}/storage/${img}`}
            alt={`Property ${idx + 1}`}
            className="h-40 w-56 object-cover rounded-lg border"
          />
        )) : (
          <img src="/placeholder.svg" alt="Property" className="h-40 w-56 object-cover rounded-lg border" />
        )}
      </div>
    )
  }

  // Helper to render all fields
  const renderDetails = (listing) => {
    const fields = [
      // Main info
      { key: 'price', value: listing.price, format: v => v ? `$${v.toLocaleString()}` : '' },
      { key: 'currency', value: listing.currency },
      { key: 'listing_type', value: listing.listing_type },
      { key: 'property_type', value: listing.property_type },
      // Location
      { key: 'city', value: listing.city },
      { key: 'development_name', value: listing.development_name },
      { key: 'address', value: listing.address },
      { key: 'flat_number', value: listing.flat_number },
      { key: 'building_id_mapbox', value: listing.building_id_mapbox },
      // Features
      { key: 'floor_number', value: listing.floor_number },
      { key: 'total_floors', value: listing.total_floors },
      { key: 'build_year', value: listing.build_year },
      { key: 'cadastral_code', value: listing.cadastral_code },
      { key: 'studio', value: listing.studio, format: v => v ? 'Yes' : 'No' },
      { key: 'penthouse', value: listing.penthouse, format: v => v ? 'Yes' : 'No' },
      { key: 'multifloor', value: listing.multifloor, format: v => v ? 'Yes' : 'No' },
      { key: 'freeplan', value: listing.freeplan, format: v => v ? 'Yes' : 'No' },
      { key: 'room_count', value: listing.room_count },
      { key: 'bedroom_count', value: listing.bedroom_count },
      { key: 'bathroom_count', value: listing.bathroom_count },
      { key: 'total_area', value: listing.total_area, format: v => v ? `${v} m²` : '' },
      { key: 'living_area', value: listing.living_area, format: v => v ? `${v} m²` : '' },
      { key: 'kitchen_area', value: listing.kitchen_area, format: v => v ? `${v} m²` : '' },
      { key: 'land_area', value: listing.land_area, format: v => v ? `${v} m²` : '' },
      { key: 'roof_height', value: listing.roof_height, format: v => v ? `${v} m` : '' },
      { key: 'balcony', value: listing.balcony, format: v => v ? 'Yes' : 'No' },
      { key: 'terrace', value: listing.terrace, format: v => v ? 'Yes' : 'No' },
      // Contact
      { key: 'contact_name', value: listing.contact_name },
      { key: 'contact_phone', value: listing.contact_phone },
      { key: 'contact_email', value: listing.contact_email },
      { key: 'is_agent', value: listing.is_agent, format: v => v ? 'Yes' : 'No' },
      // Other
      { key: 'description_ge', value: listing.description_ge },
      { key: 'description_en', value: listing.description_en },
      { key: 'description_ru', value: listing.description_ru },
      { key: 'created_at', value: listing.created_at, format: v => v ? new Date(v).toLocaleString() : '' }
    ]
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
        {fields.filter(f => f.value !== undefined && f.value !== null && f.value !== '').map(f => (
          <div key={f.key} className="flex flex-col mb-2">
            <span className="text-xs text-gray-500">{getLabel(f.key)}</span>
            <span className="font-medium text-gray-900">{f.format ? f.format(f.value) : f.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-10 px-4">
      <h1 className="text-3xl font-extrabold text-blue-900 mb-8 text-center">My Property Listings</h1>
      <div className="flex justify-center mb-8">
        <button
          className={`px-6 py-2 rounded-l-lg border border-blue-600 font-semibold transition-colors ${
            view === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
          }`}
          onClick={() => setView('list')}
        >
          List View
        </button>
        <button
          className={`px-6 py-2 rounded-r-lg border border-blue-600 font-semibold transition-colors ${
            view === 'card' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'
          }`}
          onClick={() => setView('card')}
        >
          Card View
        </button>
      </div>
      {view === 'list' ? (
        <div className="max-w-4xl mx-auto">
          <ul className="divide-y divide-gray-200 bg-white rounded-xl shadow">
            {listings.map((listing) => (
              <li
                key={listing.id || listing._id}
                className="p-6 flex items-center gap-6 cursor-pointer hover:bg-blue-50 transition"
                onClick={() => openModal(listing)}
              >
                <img
                  src={
                    (() => {
                      let img = listing.image;
                      // Try to use first photo from photos array if available
                      let photos = [];
                      if (Array.isArray(listing.photos)) {
                        photos = listing.photos;
                      } else if (typeof listing.photos === 'string') {
                        try { photos = JSON.parse(listing.photos); } catch {}
                      }
                      if (photos.length > 0) img = `${API_URI}/storage/${photos[0]}`;
                      return img || "/placeholder.svg";
                    })()
                  }
                  alt="Property"
                  className="w-24 h-24 object-cover rounded-lg border border-gray-100"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-900">
                      {listing.price ? `$${listing.price.toLocaleString()}` : "No Price"}
                    </span>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">
                      {listing.listing_type?.toUpperCase() || "LISTING"}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm mt-1">
                    {listing.property_type?.replace("_", " ") || "Type"} &middot; {listing.room_count || 0} rooms &middot; {listing.total_area || 0} m²
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.development_name || listing.address || "No Address"}, {listing.city || ""}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <Clock className="w-4 h-4" />
                    <span>
                      {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {listings.map((listing) => (
            <div
              key={listing.id || listing._id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow flex flex-col cursor-pointer"
              onClick={() => openModal(listing)}
            >
              <div className="relative h-56 rounded-t-2xl overflow-hidden">
                <img
                  src={
                    (() => {
                      let img = listing.image;
                      // Try to use first photo from photos array if available
                      let photos = [];
                      if (Array.isArray(listing.photos)) {
                        photos = listing.photos;
                      } else if (typeof listing.photos === 'string') {
                        try { photos = JSON.parse(listing.photos); } catch {}
                      }
                      if (photos.length > 0) img = `${API_URI}/storage/${photos[0]}`;
                      return img || "/placeholder.svg";
                    })()
                  }
                  alt="Property"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-semibold shadow">
                  {listing.listing_type?.toUpperCase() || "LISTING"}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-900">
                      {listing.price ? `$${listing.price.toLocaleString()}` : "No Price"}
                    </h2>
                    <span className="text-sm text-gray-500 font-medium">
                      {listing.property_type?.replace("_", " ") || "Type"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-4 text-gray-700">
                    <div className="flex items-center gap-1">
                      <Bed className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{listing.room_count || 0} rooms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-5 h-5 text-blue-600" />
                      <span className="font-medium">{listing.total_area || 0} m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium">
                        {listing.floor_number || 1}/{listing.total_floors || 1} floor
                      </span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <p className="font-semibold text-gray-900 flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {listing.development_name || listing.address || "No Address"}
                    </p>
                    <p className="text-sm text-gray-500">{listing.city || ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-4">
                  <Clock className="w-4 h-4" />
                  <span>
                    {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : ""}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {listings.length === 0 && (
        <div className="text-center text-gray-500 mt-16 text-lg font-medium">
          No listings found.
        </div>
      )}

      {/* Modal for details */}
      {modalOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 relative overflow-y-auto max-h-[90vh]">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-blue-600"
              onClick={closeModal}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Property Details</h2>
            {renderImages(selected)}
            <div className="mb-6">
              {renderDetails(selected)}
            </div>
            {selected.description_ge && (
              <div className="mb-2">
                <span className="text-xs text-gray-500">{getLabel('description_ge')}</span>
                <p className="text-gray-700">{selected.description_ge}</p>
              </div>
            )}
            {selected.description_en && (
              <div className="mb-2">
                <span className="text-xs text-gray-500">{getLabel('description_en')}</span>
                <p className="text-gray-700">{selected.description_en}</p>
              </div>
            )}
            {selected.description_ru && (
              <div className="mb-2">
                <span className="text-xs text-gray-500">{getLabel('description_ru')}</span>
                <p className="text-gray-700">{selected.description_ru}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default MyPropertyListings
