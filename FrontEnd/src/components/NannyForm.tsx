import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, ChevronRight, ChevronLeft, Upload } from 'lucide-react';

const ModernNannyForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
    },
    professionalDetails: {
      experience: 'none',
      languages: [],
      ageGroupsExperience: []
    },
    preferences: {
      jobType: 'fullTime',
      availableForOvernightShifts: false,
      willingToWorkWithSpecialNeeds: false
    }
  });

  const languages = ['English', 'Portuguese', 'Local Languages'];
  const ageGroups = [
    'Infants (0-12 months)', 
    'Toddlers (1-3 years)', 
    'Preschoolers (4-5 years)', 
    'School-aged Children (6-12 years)'
  ];

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="First Name"
            value={formData.personalInfo.firstName}
            onChange={(e) => handleInputChange('personalInfo', 'firstName', e.target.value)}
            className="w-full pl-10 py-3 border-b-2 border-gray-300 focus:border-blue-500 transition-colors"
            required
          />
        </div>
        <div className="relative">
          <User className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.personalInfo.lastName}
            onChange={(e) => handleInputChange('personalInfo', 'lastName', e.target.value)}
            className="w-full pl-10 py-3 border-b-2 border-gray-300 focus:border-blue-500 transition-colors"
            required
          />
        </div>
      </div>

      <div className="relative">
        <Mail className="absolute left-3 top-3 text-gray-400" />
        <input
          type="email"
          placeholder="Email Address"
          value={formData.personalInfo.email}
          onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
          className="w-full pl-10 py-3 border-b-2 border-gray-300 focus:border-blue-500 transition-colors"
          required
        />
      </div>

      <div className="relative">
        <Phone className="absolute left-3 top-3 text-gray-400" />
        <input
          type="tel"
          placeholder="Phone Number"
          value={formData.personalInfo.phone}
          onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
          className="w-full pl-10 py-3 border-b-2 border-gray-300 focus:border-blue-500 transition-colors"
          required
        />
      </div>

      <div className="relative">
        <Calendar className="absolute left-3 top-3 text-gray-400" />
        <input
          type="date"
          placeholder="Date of Birth"
          value={formData.personalInfo.dateOfBirth}
          onChange={(e) => handleInputChange('personalInfo', 'dateOfBirth', e.target.value)}
          className="w-full pl-10 py-3 border-b-2 border-gray-300 focus:border-blue-500 transition-colors"
          required
        />
      </div>
    </div>
  );

  const renderProfessionalDetails = () => (
    <div className="space-y-6">
      <div className="mt-4">
        <p className="mb-2 text-gray-600">Languages</p>
        {languages.map(lang => (
          <label key={lang} className="inline-flex items-center mr-4 mt-2">
            <input
              type="checkbox"
              value={lang}
              checked={formData.professionalDetails.languages.includes(lang)}
              onChange={(e) => {
                const langs = e.target.checked
                  ? [...formData.professionalDetails.languages, lang]
                  : formData.professionalDetails.languages.filter(l => l !== lang);
                handleInputChange('professionalDetails', 'languages', langs);
              }}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">{lang}</span>
          </label>
        ))}
      </div>

      <div className="mt-4">
        <p className="mb-2 text-gray-600">Age Groups Experience</p>
        {ageGroups.map(group => (
          <label key={group} className="inline-flex items-center mr-4 mt-2">
            <input
              type="checkbox"
              value={group}
              checked={formData.professionalDetails.ageGroupsExperience.includes(group)}
              onChange={(e) => {
                const groups = e.target.checked
                  ? [...formData.professionalDetails.ageGroupsExperience, group]
                  : formData.professionalDetails.ageGroupsExperience.filter(g => g !== group);
                handleInputChange('professionalDetails', 'ageGroupsExperience', groups);
              }}
              className="form-checkbox h-5 w-5 text-blue-600"
            />
            <span className="ml-2">{group}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-6">
      <div className="mt-4">
        <label className="block mb-2 text-gray-600">Job Type</label>
        <select
          value={formData.preferences.jobType}
          onChange={(e) => handleInputChange('preferences', 'jobType', e.target.value)}
          className="w-full py-3 px-4 border-b-2 border-gray-300 focus:border-blue-500 transition-colors"
        >
          <option value="fullTime">Full Time</option>
          <option value="partTime">Part Time</option>
          <option value="temporary">Temporary</option>
        </select>
      </div>

      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          checked={formData.preferences.availableForOvernightShifts}
          onChange={(e) => handleInputChange('preferences', 'availableForOvernightShifts', e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600 mr-3"
        />
        <span>Available for Overnight Shifts</span>
      </div>

      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          checked={formData.preferences.willingToWorkWithSpecialNeeds}
          onChange={(e) => handleInputChange('preferences', 'willingToWorkWithSpecialNeeds', e.target.checked)}
          className="form-checkbox h-5 w-5 text-blue-600 mr-3"
        />
        <span>Willing to Work with Special Needs Children</span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">
        <div className="flex justify-between mb-6">
          {[1, 2, 3].map(step => (
            <div 
              key={step} 
              className={`w-10 h-1 rounded-full transition-colors ${
                currentStep === step ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-blue-600">
              {currentStep === 1 ? 'Personal Information' : 
               currentStep === 2 ? 'Professional Details' : 
               'Job Preferences'}
            </h2>
          </div>

          {currentStep === 1 && renderPersonalInfo()}
          {currentStep === 2 && renderProfessionalDetails()}
          {currentStep === 3 && renderPreferences()}

          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={prevStep} 
                className="flex items-center text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-md transition-colors"
              >
                <ChevronLeft className="mr-2" /> Back
              </button>
            )}
            
            {currentStep < 3 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className="ml-auto flex items-center bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Next <ChevronRight className="ml-2" />
              </button>
            ) : (
              <button 
                type="submit" 
                className="ml-auto flex items-center bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
              >
                Submit <Upload className="ml-2" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModernNannyForm;