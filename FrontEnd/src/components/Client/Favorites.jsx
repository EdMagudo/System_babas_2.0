import React from 'react';

const Favorites = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-indigo-700">Favorite Nannies</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between border p-4 rounded">
          <div className="flex items-center">
            <img 
              src="/api/placeholder/80/80" 
              alt="Nanny" 
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h4 className="font-semibold">Ana Rodrigues</h4>
              <p className="text-gray-600">Early Childhood Educator</p>
            </div>
          </div>
          <button className="text-indigo-600 hover:text-indigo-800">
            View Profile
          </button>
        </div>
        <div className="flex items-center justify-between border p-4 rounded">
          <div className="flex items-center">
            <img 
              src="/api/placeholder/80/80" 
              alt="Nanny" 
              className="w-16 h-16 rounded-full mr-4"
            />
            <div>
              <h4 className="font-semibold">Carlos Santos</h4>
              <p className="text-gray-600">Experienced Caregiver</p>
            </div>
          </div>
          <button className="text-indigo-600 hover:text-indigo-800">
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
