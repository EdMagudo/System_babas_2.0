import React, { useState, useEffect } from 'react';
import { MapPin, Award, Mail, Calendar } from 'lucide-react';
import axios from 'axios';

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [children, setChildren] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setSpecialRequests] = useState('');
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [client, setClient] = useState({
    country: '',
    province: '',
  });

  // Função de mudança de entrada para atualizar o estado do cliente
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Função para buscar as nannies
  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:3005/nanny/in/nanny/');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching nannies:', error);
    }
  };

  // Função para enviar os dados de contato
  const handleContact = async (nannyId) => {
    try {
      const clientId = localStorage.getItem('idUser');
      const email = localStorage.getItem('userEmail');
      const country = localStorage.getItem('userCountry');
      const province = localStorage.getItem('userProvice');

      const address = `${province}, ${country}`;

      const requestData = {
        client_id: parseInt(clientId),
        nanny_id: nannyId,
        number_of_people: children,
        email: email,
        address: address,
        start_date: startDate,
        end_date: endDate,
        notes: notes,
      };

      const response = await fetch('http://localhost:3005/requestServices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        alert('Service request sent successfully!');
        setChildren(1);
        setStartDate('');
        setEndDate('');
        setSpecialRequests('');
      } else {
        throw new Error('Failed to send service request');
      }
    } catch (error) {
      console.error('Error sending service request:', error);
      alert('Failed to send service request. Please try again.');
    }
  };

  // Efeito para carregar países
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:3005/countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  // Efeito para carregar províncias com base no país selecionado
  useEffect(() => {
    if (client.country) {
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(`http://localhost:3005/provinces/${client.country}`);
          setProvinces(response.data);
        } catch (error) {
          console.error('Error fetching provinces:', error);
        }
      };

      fetchProvinces();
    }
  }, [client.country]);

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Find a Nanny</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {/* Country Selection */}
          <div>
            <label className="block mb-2">Country</label>
            <select
              id="country"
              value={client.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          {/* Province Selection */}
          <div>
            <label className="block mb-2">Province</label>
            <select
              id="province"
              value={client.province}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="" disabled>
                Select Province
              </option>
              {provinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block mb-2 text-gray-700">Availability</label>
            <select className="w-full px-3 py-2 border rounded-lg">
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Weekend</option>
            </select>
          </div>

          <div className="col-span-3 mt-4">
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
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
            <div
              key={nanny.nanny_id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-102 transition-all duration-300"
            >
              {/* Top Section with Photo */}
              <div className="relative">
                <img
                  src="/api/placeholder/400/400"
                  alt={`${nanny.first_name}'s profile`}
                  className="w-full h-48 object-cover"
                />
              </div>

              {/* Content Section */}
              <div className="p-6">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">{nanny.first_name}</h3>
                </div>

                {/* Quick Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm text-gray-700">
                      {nanny.education_level.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm text-gray-700">{nanny.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm text-gray-700">
                      {new Date(nanny.date_of_birth).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Custom Info */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
                  <div className="flex items-center bg-gray-100 rounded-lg">
                    <button
                      onClick={() => setChildren(Math.max(1, children - 1))}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-l-lg"
                    >
                      -
                    </button>
                    <span className="px-4 text-lg font-semibold">{children}</span>
                    <button
                      onClick={() => setChildren(children + 1)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-r-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Date Pickers */}
                <div className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <div className="flex items-center">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <Calendar className="absolute right-3 text-gray-400" size={20} />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <div className="flex items-center">
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                      <Calendar className="absolute right-3 text-gray-400" size={20} />
                    </div>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Special Requests / Preferences</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Language preferences, qualifications, allergies, routines, etc."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                  />
                </div>

                {/* Contact Button */}
                <div className="mt-6">
                  <button
                    onClick={() => handleContact(nanny.nanny_id)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
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
