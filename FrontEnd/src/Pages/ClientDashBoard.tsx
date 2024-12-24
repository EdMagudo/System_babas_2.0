import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Home, 
  Search as SearchIcon, 
  Star 
} from 'lucide-react';
import Overview from '../components/Client/Overview';  // Importe o componente Overview
import Search from '../components/Client/Search';      // Importe o componente Search
import Favorites from '../components/Client/Requirements'; // Importe o componente Favorites
import ProfilePictureUploader from '../components/Nanny/ProfilePictureUploader';
import Reservations from '../components/Client/Reservations';

const ClientDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [clientProfile, setClientProfile] = useState(null); // Estado para armazenar os dados do perfil
  const [loading, setLoading] = useState(true); // Estado para controle de carregamento

  const userId = 2; // ID do usuário logado (substitua conforme necessário)

  // Função para buscar os dados do cliente
  useEffect(() => {
    const fetchClientData = async () => {
      try {
        // Alterando a URL para a correta
        const response = await axios.get(`http://localhost:3005/client/${userId}`);
        setClientProfile(response.data); // Armazenando os dados no estado
        setLoading(false); // Finaliza o carregamento
      } catch (error) {
        console.error('Erro ao buscar dados do cliente:', error);
        setLoading(false); // Finaliza o carregamento mesmo em caso de erro
      }
    };

    fetchClientData();
  }, [userId]);

  const renderSection = () => {
    switch(activeSection) {
      case 'overview':
        return <Overview clientProfile={clientProfile} />;
      case 'search':
        return <Search />;
      case 'favorites':
        return <Favorites />;
      case  'reservations':
          return <Reservations/>
      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Exibe uma mensagem de carregamento até os dados estarem prontos
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
            <ProfilePictureUploader
                uploadEndpoint={`http://localhost:3005/user/uploadProfile/Picture/${clientProfile.user_id}`}
                fetchImageEndpoint={`http://localhost:3005/user/${clientProfile.user_id}/profile-picture`}
                onUploadSuccess={(newImageUrl) => {
                  console.log("Foto atualizada com sucesso:", newImageUrl);
                }}
              />
              <h2 className="text-2xl font-bold text-indigo-700">{clientProfile.first_name} {clientProfile.last_name}</h2>
              <p className="text-gray-600">{clientProfile.province_name}, {clientProfile.country_name}</p>
            </div>
            <nav className="space-y-4">
              <button 
                onClick={() => setActiveSection('overview')}
                className={`w-full flex items-center p-3 rounded-lg ${activeSection === 'overview' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
              >
                <Home className="mr-3" /> Dashboard
              </button>
              <button 
                onClick={() => setActiveSection('search')}
                className={`w-full flex items-center p-3 rounded-lg ${activeSection === 'search' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
              >
                <SearchIcon className="mr-3" /> Find a Nanny
              </button>
              <button 
                onClick={() => setActiveSection('favorites')}
                className={`w-full flex items-center p-3 rounded-lg ${activeSection === 'favorites' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
              >
                <Star className="mr-3" /> Requeriments
              </button>

              <button 
                onClick={() => setActiveSection('reservations')}
                className={`w-full flex items-center p-3 rounded-lg ${activeSection === 'reservations' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-100'}`}
              >
                <Star className="mr-3" /> Reservations
              </button>
              
            </nav>
          </div>

          {/* Main Content */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
              <h1 className="text-3xl font-bold text-indigo-700">Welcome, {clientProfile.first_name}!</h1>
              <p className="text-gray-600">Explore and find the perfect nanny for your family.</p>
            </div>

            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
