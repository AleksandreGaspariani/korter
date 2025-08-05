import React from 'react';
import { FaPhone, FaRegCommentDots, FaHeart } from 'react-icons/fa';

const properties = [
  {
    image: '../../../images/flat1.jpg',
    title: 'მეფე მირიანის ქუჩა, 98',
    district: 'საბურთალო',
    price: '99 969 ₾-დან',
    perM2: '2 840 ₾/მ²-ზე',
    developer: 'მალაყოს',
  },
  {
    image: '../../../images/flat2.jpg',
    title: 'ალბლების ქ., 39',
    district: 'ისანი',
    price: 'ფასი მოცემულია',
    perM2: '2 488 ₾/მ²-ზე',
    developer: 'K3 დეველოპმენტი',
  },
  {
    image: '../../../images/flat3.jpg',
    title: 'მოსკოვის გამზირი, 9ა',
    district: 'ისანი',
    price: '205 834 ₾-დან',
    perM2: '2 975 ₾/მ²-ზე',
    developer: 'New Line Construction',
  },
  {
    image: '../../../images/flat4.png',
    title: 'Pillar Park Samgori',
    district: 'კახეთის გზატკეცილი 1ა',
    price: 'ფასი მოცემულია',
    perM2: '3 245 ₾/მ²-ზე',
    developer: 'Pillar Group, Pillar Park',
  },
];

const PropertyCard = ({ property }) => {
  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition">
      <div className="relative">
        <img src={property.image} alt={property.title} className="w-full h-48 object-cover rounded-t-xl" />
        <FaHeart className="absolute top-3 right-3 text-gray-600 hover:text-red-500 cursor-pointer" />
      </div>
      <div className="p-4 space-y-1">
        <h3 className="font-bold text-gray-900 text-sm">{property.title}</h3>
        <p className="text-xs text-gray-500">{property.district}</p>
        <p className="text-gray-900 font-semibold text-sm">{property.price} <span className="text-gray-500 font-normal text-xs">{property.perM2}</span></p>
        <p className="text-xs text-gray-500">{property.developer}</p>
        <div className="flex space-x-2 pt-2">
          <button className="flex items-center text-sm border rounded px-3 py-1 hover:bg-gray-50">
            <FaPhone className="mr-1" /> დარეკვა
          </button>
          <button className="flex items-center text-sm border rounded px-3 py-1 hover:bg-gray-50">
            <FaRegCommentDots className="mr-1" /> მიწერა
          </button>
        </div>
      </div>
    </div>
  );
};

const PropertyCardGrid = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">პოპულარული საცხოვრებელი კომპლექსები</h2>
        <a href="/projects" className="text-sm text-blue-500 hover:underline">ყველა პროექტი</a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {properties.map((property, idx) => (
          <PropertyCard key={idx} property={property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyCardGrid;