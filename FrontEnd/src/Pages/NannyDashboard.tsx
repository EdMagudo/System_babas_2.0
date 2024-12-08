import React, { useState, useEffect } from 'react';
import { Home, User, Briefcase } from 'lucide-react';
import axios from 'axios';

const NannyDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [nannyProfile, setNannyProfile] = useState(null);
  const [languagesList, setLanguagesList] = useState([]);  // Estado para armazenar os idiomas disponíveis
  const [formData, setFormData] = useState({
    jobType: '',
    experience: '',
    policeClearance: '',
    policeClearanceFile: null,
    languages: [],
    additionalInfo: '',
  });

  // Função para buscar os dados reais da babá da API
  const fetchNannyProfile = async () => {
    const idUser = localStorage.getItem('idUser');
    if (!idUser) {
      console.error('ID do usuário não encontrado no localStorage');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3005/user/${idUser}`);
      setNannyProfile(response.data);
    } catch (error) {
      console.error('Erro ao buscar o perfil:', error);
    }
  };

  // Função para buscar os idiomas disponíveis da API
  const fetchLanguages = async () => {
    try {
      const response = await axios.get('http://localhost:3005/languages');
      setLanguagesList(response.data);  // Atualiza o estado com os idiomas recebidos
    } catch (error) {
      console.error('Erro ao buscar idiomas:', error);
    }
  };

  useEffect(() => {
    fetchNannyProfile();  // Busca os dados da babá
    fetchLanguages();  // Busca os idiomas disponíveis
  }, []);

  // Verifique se os dados da babá já foram carregados
  if (!nannyProfile || languagesList.length === 0) {
    return <div>Loading...</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      policeClearanceFile: e.target.files[0],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode processar os dados do formulário, como enviá-los para a API
    console.log('Form submitted:', formData);
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'overview':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">Quick Stats</h3>
              <div className="space-y-3">
                <p>Completed Jobs: <span className="font-bold">{nannyProfile.completedJobs}</span></p>
                <p>Rating: <span className="font-bold text-yellow-600">{nannyProfile.rating}/5</span></p>
                <p>Availability: <span className="font-bold text-green-600">{nannyProfile.availabilityStatus}</span></p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">Professional Summary</h3>
              <p>{nannyProfile.professionalSummary}</p>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Name: {nannyProfile.first_name} {nannyProfile.last_name}</p>
                <p>Email: {nannyProfile.email}</p>
                <p>Location: {nannyProfile.province_name}, {nannyProfile.country_name}</p>
              </div>
              <div>
                <p>Education: {nannyProfile.educationLevel}</p>
              </div>
            </div>

            {/* Availability & Experience */}
            <div className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold text-blue-700">Availability & Experience</h2>
              <div className="space-y-2">
                <label className="block mb-2">Job Type</label>
                <div className="flex space-x-4">
                  {["full-time", "temporary"].map((type) => (
                    <label key={type} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="jobType"
                        value={type}
                        checked={formData.jobType === type}
                        onChange={handleChange}
                        className="form-radio"
                      />
                      <span className="ml-2 capitalize">{type.replace("-", " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block mb-2">Experience</label>
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="">Years of Experience</option>
                  <option value="none">None</option>
                  <option value="1-2">1 - 2 years</option>
                  <option value="3-5">3 - 5 years</option>
                  <option value="5+">More than 5 years</option>
                </select>
              </div>
            </div>

            {/* Background Check */}
            <div className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold text-blue-700">Background Check</h2>
              <div className="space-y-2">
                <label className="block mb-2">Do you have a police clearance?</label>
                <div className="flex space-x-4">
                  {["yes", "no"].map((option) => (
                    <label key={option} className="inline-flex items-center">
                      <input
                        type="radio"
                        name="policeClearance"
                        value={option}
                        checked={formData.policeClearance === option}
                        onChange={handleChange}
                        className="form-radio"
                      />
                      <span className="ml-2 capitalize">{option}</span>
                    </label>
                  ))}
                </div>
                <div>
                  <label className="block mb-2">
                    Please upload a copy of your police clearance:
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            </div>

            {/* Languages & Additional Information */}
            <div className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold text-blue-700">Languages & Additional Information</h2>
              <div className="space-y-2">
                <label className="block mb-2">Languages Spoken</label>
                <select
                  multiple
                  value={formData.languages}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      languages: Array.from(e.target.selectedOptions, (opt) => opt.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                >
                  {languagesList.map((language, index) => (
                    <option key={index} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block mb-2">Additional Information</label>
                <textarea
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleChange}
                  placeholder="Please share any other relevant information"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="px-4 py-2 mt-4 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit
            </button>
          </div>
        );
      case 'jobs':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">Job Opportunities</h3>
            <div className="space-y-4">
              {nannyProfile.jobs.map((job, index) => (
                <div key={index} className="border p-4 rounded-md">
                  <h4 className="font-semibold">{job.title}</h4>
                  <p>{job.description}</p>
                  <p className={`text-${job.status === 'Open' ? 'green' : 'yellow'}-600`}>{job.status}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <img 
                src={nannyProfile.profilePicture} 
                alt="Profile" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-2xl font-bold text-blue-700">{nannyProfile.first_name} {nannyProfile.last_name}</h2>
              <p className="text-gray-600">{nannyProfile.education_Level}</p>
            </div>
            <nav className="space-y-4">
              <button 
                onClick={() => setActiveSection('overview')}
                className={`w-full flex items-center p-3 rounded-lg ${activeSection === 'overview' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                <Home className="mr-3" /> Dashboard
              </button>
              <button 
                onClick={() => setActiveSection('profile')}
                className={`w-full flex items-center p-3 rounded-lg ${activeSection === 'profile' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                <User className="mr-3" /> Profile
              </button>
              <button 
                onClick={() => setActiveSection('jobs')}
                className={`w-full flex items-center p-3 rounded-lg ${activeSection === 'jobs' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
              >
                <Briefcase className="mr-3" /> Jobs
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
              <h1 className="text-3xl font-bold text-blue-700">Welcome, {nannyProfile.first_name}!</h1>
              <p className="text-gray-600">Here's an overview of your nanny profile and opportunities.</p>
            </div>

            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NannyDashboard;
