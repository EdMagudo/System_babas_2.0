import React, { useState, useEffect } from "react";
import axios from "axios"; 

const NannyRegistrationForm = () => {
  const [client, setClient] = useState({
    firstName: "",
    lastName: "",
    email: "",
    data_of_birth:null,
    country: "",
    province: "",
    idNumber: "",
    idCopy: null,
  });

  const [languages, setLanguages] = useState([]);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch countries, provinces, languages - same as original code
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:3005/countries");
        setCountries(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching countries:", error);
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (client.country) {
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3005/provinces/${client.country}`
          );
          setProvinces(response.data);
        } catch (error) {
          console.error("Error fetching provinces:", error);
        }
      };

      fetchProvinces();
    }
  }, [client.country]);



  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = (e) => {
    setClient((prev) => ({ ...prev, idCopy: e.target.files[0] }));
  };

 

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append('firstName', client.firstName || '');
      formData.append('lastName', client.lastName || '');
      formData.append('email', client.email || '');
      formData.append('date_of_birth', client.date_of_birth || '');
      formData.append('country', client.country || '');
      formData.append('province', client.province || '');
      formData.append('idNumber', client.idNumber || '');
  
      if (client.idCopy) {
        formData.append('idCopy', client.idCopy);
      }
  
      const educationLevel = document.querySelector('select[name="education-level"]')?.value || '';
      formData.append('educationLevel', educationLevel);
  
      // Imprime os dados no console
      const dataToLog = {
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        date_of_birth: client.date_of_birth,
        country: client.country,
        province: client.province,
        idNumber: client.idNumber,
        educationLevel,
        idCopy: client.idCopy ? client.idCopy.name : null, // Apenas o nome do arquivo
      };
  
      console.log('Form Data:', dataToLog);
  
      // Envia ao backend
      const response = await axios.post('http://localhost:3005/user/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
  
      alert('Registration submitted successfully!');
      console.log('Backend response:', response.data);
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      alert('Failed to submit registration. Please try again.');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-2xl rounded-2xl mt-16 mb-8">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Join Our Trusted Nanny Team
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Personal Information
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2">First Name</label>
              <input
                type="text"
                id="firstName"
                placeholder="First Name"
                value={client.firstName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Last Name</label>
              <input
                type="text"
                id="lastName"
                placeholder="Last Name"
                value={client.lastName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Date of Birth</label>
              <input
                type="date"
                id="date_of_birth"
                value={client.date_of_birth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                id="email"
                placeholder="nanny@gmail.com"
                value={client.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Country</label>
              <select
                id="country"
                value={client.country}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              >
                <option value="" disabled>Select Country</option>
                {countries.map((country, index) => (
                  <option key={index} value={country}>{country}</option>
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
                <option value="" disabled>Select Province</option>
                {provinces.map((province, index) => (
                  <option key={index} value={province}>{province}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2">ID/Passport</label>
              <input
                type="text"
                id="idNumber"
                placeholder="ID or Passport Number"
                value={client.idNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">ID Copy</label>
              <input
                type="file"
                id="idCopy"
                 name="idCopy"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
          </div>
        </div>

        {/* Education & Qualifications */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Education & Qualifications
          </h2>
          <div>
            <label className="block mb-2">Education Level</label>
            <select 
              name="education-level" 
              className="w-full px-3 py-2 border rounded"
            >
              <option value="">Select Education Level</option>
              <option value="none">None</option>
              <option value="secondary">High School Student</option>
              <option value="grade10">High School Incomplete</option>
              <option value="grade12">High School Graduate</option>
              <option value="tvet-student">Technical or University Student</option>
              <option value="tvet-graduate">Technical Graduate</option>
              <option value="university-graduate">University Graduate</option>
            </select>
          </div>
        </div>

        
          {/* Review & Submit */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Review Registration
            </h2>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <p className="mb-2">Please carefully review all of your information before submitting.</p>
              <p className="text-sm text-gray-600">
                After clicking 'Submit Application', we will process your registration 
                and contact you with further instructions.
              </p>
            </div>
          </div>
  
          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 text-lg font-semibold"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    );
  };
  
  export default NannyRegistrationForm;