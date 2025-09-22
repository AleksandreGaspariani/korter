"use client"

import {React, useState } from "react"
import { MapPin, SlidersHorizontal, Heart, Bed, Square, Clock, ChevronDown } from "lucide-react"
import MapB from "../../../components/Map/MapB"
import modernApartmentExterior from '../../../../public/images/modern-apartment-exterior.png'
import modernApartmentLivingRoom from '../../../../public/images/modern-apartment-living-room.png'
import defaultInstance from "../../../plugins/axios"

const propertyData = [
  {
    id: 1,
    price: 179000,
    pricePerSqm: 1902,
    image: modernApartmentExterior,
    rooms: 3,
    area: 94.1,
    floor: 4,
    totalFloors: 15,
    address: "Villa Residence Apartments",
    location: "Saburtalo District, 14",
    timeAgo: "Today, 10:58",
    badge: "Premium Listing",
  },
  {
    id: 2,
    price: 94000,
    pricePerSqm: 1567,
    image: modernApartmentLivingRoom,
    rooms: 2,
    area: 60,
    floor: 9,
    totalFloors: 11,
    address: "Modern Plaza Apartments",
    location: "Vake District, 13",
    timeAgo: "14 January 2025",
    badge: "Premium Listing",
  },
]

export default function SearchProperty() {
  const [searchLocation, setSearchLocation] = useState("")
  const [sortBy, setSortBy] = useState("recommended")

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Panel - Property Listings */}
      <div className="w-1/2 flex flex-col border-r border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Apartments for Sale</h1>

          {/* Search and Filter Controls */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Location, district, or address"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 flex items-center gap-2 text-gray-700">
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Results Count and Sort */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">16,834 listings, 16,834 apartments</p>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-64 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="area">Area: Large to Small</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Property Cards */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {propertyData.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="flex">
                {/* Property Image */}
                <div className="relative w-80 h-64 flex-shrink-0">
                  <img
                    src={property.image || "/placeholder.svg"}
                    alt="Property"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-md font-medium">
                    {property.badge}
                  </span>
                  <button className="absolute top-3 right-3 bg-white/80 hover:bg-white p-2 rounded-md transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Property Details */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">${property.price.toLocaleString()}</h3>
                      <p className="text-sm text-gray-600">${property.pricePerSqm.toLocaleString()} per m²</p>
                    </div>
                  </div>

                  {/* Property Features */}
                  <div className="flex items-center gap-6 mb-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      <span>{property.rooms} rooms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Square className="w-4 h-4" />
                      <span>{property.area} m²</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>
                        {property.floor}/{property.totalFloors} floor
                      </span>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-3">
                    <p className="font-medium text-gray-900">{property.address}</p>
                    <p className="text-sm text-gray-600">{property.location}</p>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Clock className="w-3 h-3" />
                    <span>{property.timeAgo}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="w-1/2 relative">
        <MapB height={'100%'}/>
      </div>
    </div>
  )
}
