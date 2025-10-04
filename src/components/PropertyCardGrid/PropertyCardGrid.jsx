import React, { useEffect, useState } from 'react';
import { FaPhone, FaRegCommentDots, FaHeart } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import defaultInstance from '../../plugins/axios';

const PropertyCard = ({ property, apiUri }) => {
  // Parse photos JSON string and get first image

  const storage = import.meta.env.VITE_APP_URI + '/storage/';
  property.first_image = property.photos ? JSON.parse(property.photos)[0] : null;

  return (
    <Link to={`/property/${property.id}`}>
      <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer">
        <div className="relative">
          <img src={`${storage}${property.first_image}`} alt={property.development_name} className="w-full h-48 object-cover rounded-t-xl" />
          <FaHeart className="absolute top-3 right-3 text-gray-600 hover:text-red-500 cursor-pointer" />
        </div>
        <div className="p-4 space-y-1">
          <h3 className="font-bold text-gray-900 text-sm">{property.title}</h3>
          <p className="text-xs text-gray-500">{property.city}, {property.address}</p>
          <p className="text-gray-900 font-semibold text-sm">ფასი მოცემულია <span className="text-gray-500 font-normal text-xs">{property.price / 10} ₾/მ²-ზე</span></p>
          <p className="text-xs text-gray-500">{property.development_name}</p>
          {/* <div className="flex space-x-2 pt-2">
            <a
              href={property?.contact_phone ? `tel:${property.contact_phone}` : undefined}
              className="flex items-center text-sm border rounded px-3 py-1 hover:bg-gray-50"
            >
              <FaPhone className="mr-1" /> დარეკვა
            </a>
            <button className="flex items-center text-sm border rounded px-3 py-1 hover:bg-gray-50">
              <FaRegCommentDots className="mr-1" /> მიწერა
            </button>
          </div> */}
        </div>
      </div>
    </Link>
  );
};

const PropertyCardGrid = () => {
  const [propertyData, setPropertyData] = useState(null);
  // Use Vite env variable
  const apiUri = import.meta.env.VITE_APP_URI;

  const fetchProperties = () => {
    defaultInstance.get('/property').then(response => {
      setPropertyData(response.data.data);
    }).catch(error => {
      console.error('Error fetching properties:', error);
    });
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 md:px-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">პოპულარული საცხოვრებელი კომპლექსები</h2>
        <Link to={'/new-buildings'} className="text-sm text-blue-500 hover:underline">ყველა პროექტი</Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {propertyData && propertyData.map((property, idx) => (
          <PropertyCard key={idx} property={property} apiUri={apiUri} />
        ))}
      </div>
    </div>
  );
};

export default PropertyCardGrid;