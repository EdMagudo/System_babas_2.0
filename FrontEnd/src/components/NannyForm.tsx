import React, { useState, useEffect } from "react";
import axios from "axios"; 

const NannyRegistrationForm = () => {
  const [client, setClient] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    contactNumber: "",
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

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');

        const uniqueLanguages = new Set();
        response.data.forEach((country) => {
          if (country.languages) {
            Object.values(country.languages).forEach((lang) => uniqueLanguages.add(lang));
          }
        });

        const options = [...uniqueLanguages].map((lang) => ({
          value: lang,
          label: lang,
        }));
        setLanguages(options);
      } catch (error) {
        console.error('Error fetching languages:', error.message);
      }
    };

    fetchLanguages();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileUpload = (e) => {
    setClient((prev) => ({ ...prev, idCopy: e.target.files[0] }));
  };

  const handleLanguageChange = (selectedOptions) => {
    setSelectedLanguages(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
  
      formData.append('firstName', client.firstName || '');
      formData.append('lastName', client.lastName || '');
      formData.append('email', client.contactNumber || '');
      formData.append('country', client.country || '');
      formData.append('province', client.province || '');
      formData.append('idNumber', client.idNumber || '');
  
      if (client.idCopy) {
        formData.append('idCopy', client.idCopy);
      }
  
      formData.append('languages', JSON.stringify(selectedLanguages.map(lang => lang.value || '')));
      formData.append('educationLevel', document.querySelector('select[name="education-level"]')?.value || '');
      formData.append('jobType', document.querySelector('input[name="job-type"]:checked')?.value || '');
      formData.append('experience', document.querySelector('select[name="experience"]')?.value || '');
  
      formData.append('ageGroups', JSON.stringify(
        Array.from(document.querySelectorAll('input[name="age-groups"]:checked')).map(input => input.value)
      ));
      formData.append('policeClearance', document.querySelector('input[name="police-clearance"]:checked')?.value || '');
      formData.append('workHours', JSON.stringify(
        Array.from(document.querySelectorAll('input[name="work-hours"]:checked')).map(input => input.value)
      ));
      formData.append('preferredAgeGroups', JSON.stringify(
        Array.from(document.querySelectorAll('input[name="preferred-age-groups"]:checked')).map(input => input.value)
      ));
      formData.append('additionalInfo', document.querySelector('textarea[name="additional-info"]')?.value || '');
  
      const response = await axios.post('http://localhost:3005/nanny/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
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
                id="dob"
                value={client.dob}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                id="contactNumber"
                placeholder="nanny@gmail.com"
                value={client.contactNumber}
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

        {/* Availability & Experience */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Availability & Experience
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Job Type</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="job-type"
                    className="form-radio"
                    value="full-time"
                  />
                  <span className="ml-2">Full Time</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="job-type"
                    className="form-radio"
                    value="temporary"
                  />
                  <span className="ml-2">Temporary</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-2">Experience</label>
              <select 
                name="experience" 
                className="w-full px-3 py-2 border rounded"
              >
                <option value="">Years of Experience</option>
                <option value="none">None</option>
                <option value="1-2">1 - 2 years</option>
                <option value="3-5">3 - 5 years</option>
                <option value="5+">More than 5 years</option>
              </select>
            </div>

            <div>
              <label className="block mb-2">Age Groups with Experience</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Babies (0-12 months)",
                  "Toddlers (1-3 years)",
                  "Preschoolers (4-5 years)",
                  "School Age (6-12 years)",
                  "Teenagers (13+ years)",
                ].map((group, index) => (
                  <label key={index} className="inline-flex items-center">
                    <input 
                      type="checkbox" 
                      name="age-groups"
                      className="form-checkbox" 
                      value={group} 
                    />
                    <span className="ml-2">{group}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Background Check */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Background Check
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Do you have a police clearance?</label>
              <div className="flex space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="police-clearance"
                    className="form-radio"
                    value="yes"
                  />
                  <span className="ml-2">Yes</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="police-clearance"
                    className="form-radio"
                    value="no"
                  />
                  <span className="ml-2">No</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block mb-2">
                Please upload a copy of your police clearance:
              </label>
              <input 
                type="file" 
                className="w-full px-3 py-2 border rounded" 
              />
            </div>
          </div>
        </div>

        {/* Work Preferences */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            Work Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Preferred Working Hours</label>
              <div className="grid grid-cols-2 gap-2">
                {["morning", "afternoon", "evening", "overnight"].map((time, index) => (
                  <label key={index} className="inline-flex items-center">
                    <input 
                      type="checkbox" 
                      name="work-hours"
                      className="form-checkbox" 
                      value={time} 
                    />
                    <span className="ml-2">
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block mb-2">Preferred Age Group</label>
              <div className="grid grid-cols-2 gap-2">
                {["babies", "toddlers"].map((group, index) => (
                  <label key={index} className="inline-flex items-center">
                    <input 
                      type="checkbox" 
                      name="preferred-age-groups"
                      className="form-checkbox"value={group} 
                      />
                      <span className="ml-2">
                        {group.charAt(0).toUpperCase() + group.slice(1)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
  
          {/* Languages & Additional Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold text-blue-700 mb-4">
              Languages & Additional Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Languages Spoken</label>
                <div className="relative">
                  <select 
                    multiple 
                    value={selectedLanguages.map(lang => lang.value)}
                    onChange={(e) => {
                      const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);
                      const newSelectedLanguages = languages.filter(lang => 
                        selectedValues.includes(lang.value)
                      );
                      handleLanguageChange(newSelectedLanguages);
                    }}
                    className="w-full px-3 py-2 border rounded"
                  >
                    {languages.map((lang, index) => (
                      <option key={index} value={lang.value}>
                        {lang.label}
                      </option>
                    ))}
                  </select>
                  {selectedLanguages.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {selectedLanguages.map((lang, index) => (
                        <span 
                          key={index} 
                          className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full"
                        >
                          {lang.label}
                          <button 
                            type="button"
                            onClick={() => {
                              handleLanguageChange(
                                selectedLanguages.filter(l => l.value !== lang.value)
                              );
                            }}
                            className="ml-1 text-red-500"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
  
              <div>
                <label className="block mb-2">Additional Information</label>
                <textarea
                  name="additional-info"
                  placeholder="Please share any other relevant information"
                  className="w-full px-3 py-2 border rounded"
                  rows="4"
                />
              </div>
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