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
  const [availability, setAvailability] = useState('');
  const [showContactForm, setShowContactForm] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.value);
  };

  const handleSearch = async () => {
    try {
      let queryParams = `?province=${client.province}&availability=${availability}`;
      const response = await fetch(`http://localhost:3005/nanny/in/nanny/${queryParams}`);
      const data = await response.json();
      setSearchResults(data);
      setCurrentPage(1); 
    } catch (error) {
      console.error('Error fetching nannies:', error);
    }
  };

  const handleContact = (nannyId) => {
    setShowContactForm(nannyId); 
  };

  const handleSubmitRequest = async (nannyId) => {
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
        setShowContactForm(null); // Reseta o formulário após o envio
      } else {
        throw new Error('Failed to send service request');
      }
    } catch (error) {
      console.error('Error sending service request:', error);
      alert('Failed to send service request. Please try again.');
    }
  };

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

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < searchResults.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const currentResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Find a Nanny</h3>
        <div className="grid md:grid-cols-3 gap-4">
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

          <div>
            <label className="block mb-2 text-gray-700">Availability</label>
            <select
              value={availability}
              onChange={handleAvailabilityChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Availability</option>
              <option value="full-time">Full-time</option>
              <option value="temporary">Temporary</option>
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

      {searchResults.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {currentResults.map((nanny) => (
            <div
              key={nanny.nanny_id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative">
                <img
                  src="/api/placeholder/400/400"
                  alt={`${nanny.first_name}'s profile`}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
              </div>

              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-indigo-600 mb-1">{nanny.first_name}</h3>
                  <span className="text-sm text-gray-500">
                    {nanny.education_level.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Award className="w-5 h-5 text-indigo-500" />
                    {nanny.education_level.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail className="w-5 h-5 text-indigo-500" />
                    {nanny.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-5 h-5 text-indigo-500" />
                    {new Date(nanny.date_of_birth).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleContact(nanny.nanny_id)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Contact
                  </button>
                </div>

                {showContactForm === nanny.nanny_id && (
                  <div className="mt-6">
                    <div>
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

                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        placeholder="Write any special notes (e.g., preferences, allergies, etc.)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 h-24"
                      />
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => handleSubmitRequest(nanny.nanny_id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        Finalize
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevPage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          disabled={currentPage * itemsPerPage >= searchResults.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Search;
