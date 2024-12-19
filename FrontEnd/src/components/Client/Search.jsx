import React, { useState } from 'react';
import { MapPin, Award, Mail } from 'lucide-react';

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:3005/nanny/in/nanny/');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching nannies:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Find a Nanny</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-gray-700">Location</label>
            <select className="w-full px-3 py-2 border rounded">
              <option>São Paulo</option>
              <option>Rio de Janeiro</option>
              <option>Belo Horizonte</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-gray-700">Child Age</label>
            <select className="w-full px-3 py-2 border rounded">
              <option>Infant (0-1 year)</option>
              <option>Toddler (1-3 years)</option>
              <option>Preschool (3-5 years)</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-gray-700">Availability</label>
            <select className="w-full px-3 py-2 border rounded">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Weekend</option>
            </select>
          </div>
          <div className="col-span-3 mt-4">
            <button 
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
            >
              Search Nannies
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((nanny) => (
            <div key={nanny.nanny_id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-102 transition-all duration-300">
              {/* Top Section with Photo */}
              <div className="relative">
                <img
                  src="/api/placeholder/400/400"
                  alt={`${nanny.first_name}'s profile`}
                  className="w-full h-60 object-cover"
                />
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {nanny.first_name}
                  </h3>
                </div>

                {/* Quick Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm">
                      {nanny.education_level.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm">{nanny.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm">
                      {new Date(nanny.date_of_birth).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Contact Button */}
                <div className="mt-6">
                  <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;