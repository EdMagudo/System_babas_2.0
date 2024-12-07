import React, { useState, useEffect } from 'react';
import { Home, User, Briefcase } from 'lucide-react';
import axios from 'axios';

const NannyDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [nannyProfile, setNannyProfile] = useState(null);  // Estado para armazenar os dados reais da babá

  // Função para buscar os dados reais da babá da API
  const fetchNannyProfile = async () => {
    try {
      const response = await axios.get('http://localhost:3005/user/');  // Rota para buscar o perfil de usuário
      setNannyProfile(response.data);  // Atualiza o estado com os dados recebidos
    } catch (error) {
      console.error('Erro ao buscar o perfil:', error);
    }
  };

  useEffect(() => {
    fetchNannyProfile();  // Chama a função para buscar os dados quando o componente for montado
  }, []);

  // Verifique se os dados da babá já foram carregados
  if (!nannyProfile) {
    return <div>Loading...</div>;  // Exibe uma mensagem enquanto os dados não são carregados
  }

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
                <p className="font-medium">Name: {nannyProfile.firstName} {nannyProfile.lastName}</p>
                <p>Email: {nannyProfile.email}</p>
                <p>Location: {nannyProfile.province}, {nannyProfile.country}</p>
              </div>
              <div>
                <p>Education: {nannyProfile.educationLevel}</p>
                <p>Languages: {nannyProfile.languages.join(', ')}</p>
              </div>
            </div>
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
              <h2 className="text-2xl font-bold text-blue-700">{nannyProfile.firstName} {nannyProfile.lastName}</h2>
              <p className="text-gray-600">{nannyProfile.educationLevel}</p>
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
              <h1 className="text-3xl font-bold text-blue-700">Welcome, {nannyProfile.firstName}!</h1>
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
