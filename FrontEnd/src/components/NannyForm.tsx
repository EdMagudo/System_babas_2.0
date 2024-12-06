import React, { useState, useEffect } from "react";
// import Select from 'react-select';
import axios from "axios"; 



const NannyRegistrationForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
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

  // Fetch countries from API
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


  // Fetch provinces based on selected country
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


  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');

        // Extract unique languages
        const uniqueLanguages = new Set();
        response.data.forEach((country) => {
          if (country.languages) {
            Object.values(country.languages).forEach((lang) => uniqueLanguages.add(lang));
          }
        });

        // Transform languages into React-Select compatible format
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


  const handleFileUpload = (e) => {
    setClient((prev) => ({ ...prev, idCopy: e.target.files[0] }));
  };

  const steps = [
    {
      title: "Personal Information",
      component: () =>
        PersonalInfoStep({
          client,
          handleInputChange,
          handleFileUpload,
          countries,
          provinces,
          loading,
        }),
    },
    {
      title: "Education & Qualifications",
      component: QualificationsStep,
    },
    {
      title: "Availability & Experience",
      component: AvailabilityStep,
    },
    {
      title: "Background Check",
      component: BackgroundCheckStep,
    },
    {
      title: "Work Preferences",
      component: WorkPreferencesStep,
    },
    {
      title: "Languages & Additional Information",
      component: LanguagesStep,
    },
    {
      title: "Review & Submit",
      component: ReviewStep,
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Implement form submission logic
    console.log("Submitting form", client);
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-2xl rounded-2xl mt-16 mb-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-4">
          Join Our Trusted Nanny Team
        </h1>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {typeof CurrentStepComponent === "function" ? (
        <CurrentStepComponent />
      ) : (
        <CurrentStepComponent />
      )}

      <div className="flex justify-between mt-6">
        {currentStep > 1 && (
          <button
            onClick={prevStep}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50"
          >
            Previous
          </button>
        )}

        {currentStep < steps.length ? (
          <button
            onClick={nextStep}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Application
          </button>
        )}
      </div>
    </div>
  );
};

const PersonalInfoStep = ({
  client,
  handleInputChange,
  handleFileUpload,
  countries,
  provinces,
  loading,
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">
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
    </div>

    <div className="grid grid-cols-2 gap-4">
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
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block mb-2">Country</label>
        {loading ? (
          <p>Loading countries...</p>
        ) : (
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
        )}
      </div>

      <div>
        <label className="block mb-2">Province</label>
        {client.country && provinces.length > 0 ? (
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
        ) : (
          <input
            type="text"
            id="province"
            placeholder="Province"
            value={client.province}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        )}
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
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
);

const QualificationsStep = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">
      Education & Qualifications
    </h2>
    <div>
      <label className="block mb-2">Education Level</label>
      <select className="w-full px-3 py-2 border rounded">
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
);

const AvailabilityStep = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">
      Availability & Experience
    </h2>

    <div className="space-y-2">
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

    <div className="space-y-2">
      <label className="block mb-2">Experience</label>
      <select className="w-full px-3 py-2 border rounded">
        <option value="">Years of Experience</option>
        <option value="none">None</option>
        <option value="1-2">1 - 2 years</option>
        <option value="3-5">3 - 5 years</option>
        <option value="5+">More than 5 years</option>
      </select>
    </div>

    <div className="space-y-2">
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
            <input type="checkbox" className="form-checkbox" value={group} />
            <span className="ml-2">{group}</span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const BackgroundCheckStep = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">Background Check</h2>
    <div className="space-y-2">
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
        <input type="file" className="w-full px-3 py-2 border rounded" />
      </div>
    </div>
  </div>
);

const WorkPreferencesStep = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">Work Preferences</h2>
    <div className="space-y-2">
      <label className="block mb-2">Preferred Working Hours</label>
      <div className="grid grid-cols-2 gap-2">
        {["morning", "afternoon", "evening", "overnight"].map((time, index) => (
          <label key={index} className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" value={time} />
            <span className="ml-2">
              {time.charAt(0).toUpperCase() + time.slice(1)}
            </span>
          </label>
        ))}
      </div>
    </div>

    <div className="space-y-2">
      <label className="block mb-2">Preferred Age Group</label>
      <div className="grid grid-cols-2 gap-2">
        {["babies", "toddlers"].map((group, index) => (
          <label key={index} className="inline-flex items-center">
            <input type="checkbox" className="form-checkbox" value={group} />
            <span className="ml-2">
              {group.charAt(0).toUpperCase() + group.slice(1)}
            </span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const LanguagesStep = ({ languages, selectedLanguages, handleLanguageChange }) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">
      Languages & Additional Information
    </h2>
    <div className="space-y-2">
      <label className="block mb-2">Languages Spoken</label>
      <Select
        isMulti
        options={languages}
        value={selectedLanguages}
        onChange={handleLanguageChange}
        placeholder="Select languages..."
        className="w-full"
      />
    </div>

    <div className="space-y-2">
      <label className="block mb-2">Additional Information</label>
      <textarea
        placeholder="Please share any other relevant information"
        className="w-full px-3 py-2 border rounded"
      />
    </div>
  </div>
);

const ReviewStep = () => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-blue-700">Revisar Inscrição</h2>
    <div className="bg-blue-50 p-4 rounded-lg">
      <p>Por favor, revise cuidadosamente todas as suas informações antes de enviar.</p>
      <p className="mt-2 text-sm text-gray-600">
        Após clicar em 'Enviar Inscrição', processaremos seu registro 
        e entraremos em contato com mais instruções.
      </p>
    </div>
  </div>
);

export default NannyRegistrationForm;
