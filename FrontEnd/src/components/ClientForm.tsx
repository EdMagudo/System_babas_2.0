import React, { useState } from 'react';
import { Upload, User, Calendar, Baby } from 'lucide-react';

const NannyFinderForm = () => {
  const [client, setClient] = useState({
    name: '',
    surname: '',
    contactPhone: '',
    contactEmail: '',
    country: '',
    idNumber: '',
    datesTimes: '',
    numChildren: '',
    childrenAgeGroups: [],
    specialNeeds: 'no',
    preferences: '',
  });

  const ageGroups = ['Babies (0 – 12 months)', 'Toddlers (1 – 3yrs)', 'Children (4 – 11yrs)', 'Teenagers (12 or above)'];

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({ ...prev, [id]: value }));
  };

  const handleAgeGroupChange = (group) => {
    setClient((prev) => ({
      ...prev,
      childrenAgeGroups: prev.childrenAgeGroups.includes(group)
        ? prev.childrenAgeGroups.filter((g) => g !== group)
        : [...prev.childrenAgeGroups, group],
    }));
  };

  const handleFileUpload = (e) => {
    console.log(e.target.files[0]);
  };

  const submitForm = (e) => {
    e.preventDefault();
    console.log('Form submitted', client);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-indigo-600 mb-4">Find the Perfect Nanny</h2>
        <p className="text-gray-500">Fill out the form to start your search</p>
      </div>

      <form onSubmit={submitForm} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
            <User className="mr-3 text-indigo-500" />
            Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={client.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">Surname</label>
              <input
                type="text"
                id="surname"
                value={client.surname}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                id="contactPhone"
                value={client.contactPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="contactEmail"
                value={client.contactEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                id="country"
                value={client.country}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">ID / Passport Number</label>
              <input
                type="text"
                id="idNumber"
                value={client.idNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="idCopy" className="block text-sm font-medium text-gray-700 mb-2">Upload ID Copy</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center px-4 py-6 bg-gray-50 text-blue-500 rounded-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-indigo-500 hover:text-white">
                <Upload className="w-8 h-8" />
                <span className="mt-2 text-base leading-normal">Select a file</span>
                <input type="file" className="hidden" onChange={handleFileUpload} required />
              </label>
            </div>
          </div>
        </div>

        {/* Dates and Times */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
            <Calendar className="mr-3 text-indigo-500" />
            Dates and Times Needed
          </h3>
          <textarea
            id="datesTimes"
            value={client.datesTimes}
            onChange={handleInputChange}
            placeholder="Specify dates and times"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
            required
          />
        </div>

        {/* Children Information */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
            <Baby className="mr-3 text-indigo-500" />
            Children Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="numChildren" className="block text-sm font-medium text-gray-700 mb-2">Number of Children</label>
              <input
                type="number"
                id="numChildren"
                value={client.numChildren}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Children's Age Groups</label>
              <div className="flex flex-wrap gap-2">
                {ageGroups.map((group) => (
                  <button
                    key={group}
                    type="button"
                    onClick={() => handleAgeGroupChange(group)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      client.childrenAgeGroups.includes(group)
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {group}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label htmlFor="specialNeeds" className="block text-sm font-medium text-gray-700 mb-2">Children with Special Needs</label>
            <select
              id="specialNeeds"
              value={client.specialNeeds}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              required
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </div>

        {/* Special Requests */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4">Special Requests/Preferences</h3>
          <textarea
            id="preferences"
            value={client.preferences}
            onChange={handleInputChange}
            placeholder="Specify any special preferences (language, qualifications, allergies, routines, etc.)"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
          />
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors text-lg font-semibold"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default NannyFinderForm;
