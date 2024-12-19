import React, { useState } from 'react';
import { 
  Home, 
  Search as SearchIcon, 
  Star 
} from 'lucide-react';
import Overview from '../components/Client/Overview';  // Importe o componente Overview
import Search from '../components/Client/Search';      // Importe o componente Search
import Favorites from '../components/Client/Favorites'; // Importe o componente Favorites

const ClientDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  // Mock data - in a real application, this would come from backend/context
  const clientProfile = {
    firstName: "João",
    lastName: "Silva",
    email: "joao.silva@email.com",
    country: "Brazil",
    province: "São Paulo",
    totalNannySearches: 5,
    profileCompleteness: 85
  };

  const renderSection = () => {
    switch(activeSection) {
      case 'overview':
        return <Overview clientProfile={clientProfile} />;
      case 'search':
        return <Search />;
      case 'favorites':
        return <Favorites />;
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
                src="/api/placeholder/200/200" 
                alt="Profile" 
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-2xl font-bold text-indigo-700">{clientProfile.firstName} {clientProfile.lastName}</h2>
              <p className="text-gray-600">{clientProfile.province}, {clientProfile.country}</p>
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
                <Star className="mr-3" /> Favorites
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="col-span-3">
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
              <h1 className="text-3xl font-bold text-indigo-700">Welcome, {clientProfile.firstName}!</h1>
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
