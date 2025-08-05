import React from 'react';

const ProfileCard = ({ image, name, title, followers, following }) => {
  return (
    <div className="border border-gray-200 rounded-xl p-5 w-full max-w-xs shadow bg-white flex flex-col items-center hover:shadow-sm">
      <img
        src={image}
        alt={name}
        className="w-16 h-16 rounded-full border-2 border-gray-200 object-cover mb-3"
      />
      <h3 className="text-base font-semibold text-gray-900 text-center">{name}</h3>
      <p className="text-xs text-gray-500 text-center">{title}</p>
      <div className="flex justify-center gap-2 mt-2 text-xs text-gray-700 font-medium">
        <span className="bg-gray-100 rounded px-2 py-0.5">{followers}</span>
        <span className="bg-gray-100 rounded px-2 py-0.5">{following}</span>
      </div>
    </div>
  );
};

export default ProfileCard;