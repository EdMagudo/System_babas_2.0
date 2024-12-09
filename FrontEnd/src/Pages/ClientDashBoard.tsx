import React, { useState } from 'react';
import { 
  Home, 
  Search, 
  Users, 
  MessageCircle, 
  Star, 
  Calendar 
} from 'lucide-react';

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
        return (
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700">Quick Stats</h3>
              <div className="space-y-3">
                <p>Total Nanny Searches: <span className="font-bold">{clientProfile.totalNannySearches}</span></p>
                <p>Profile Completeness: 
                  <span className="font-bold text-green-600 ml-2">
                    {clientProfile.profileCompleteness}%
                  </span>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{width: `${clientProfile.profileCompleteness}%`}}
                  ></div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4 text-indigo-700">Recent Activity</h3>
              <ul className="space-y-3">
                <li className="border-b pb-2">
                  <p className="font-medium">Searched for nannies in São Paulo</p>
                  <p className="text-sm text-gray-600">2 days ago</p>
                </li>
                <li className="border-b pb-2">
                  <p className="font-medium">Viewed 3 nanny profiles</p>
                  <p className="text-sm text-gray-600">3 days ago</p>
                </li>
                <li>
                  <p className="font-medium">Updated search preferences</p>
                  <p className="text-sm text-gray-600">5 days ago</p>
                </li>
              </ul>
            </div>
          </div>
        );
      case 'search':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">Find a Nanny</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-gray-700">Location</label>
                <select className="w-full px-3 py-2 border rounded">
                  <option>São Paulo</option>
                  <option>Rio de Janeiro</option>
                  <option>Belo Horizonte</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Child Age</label>
                <select className="w-full px-3 py-2 border rounded">
                  <option>Infant (0-1 year)</option>
                  <option>Toddler (1-3 years)</option>
                  <option>Preschool (3-5 years)</option>
                </select>
              </div>
              <div>
                <label className="block mb-2 text-gray-700">Availability</label>
                <select className="w-full px-3 py-2 border rounded">
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Weekend</option>
                </select>
              </div>
              <div className="col-span-3 mt-4">
                <button className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700">
                  Search Nannies
                </button>
              </div>
            </div>
          </div>
        );
      case 'favorites':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-indigo-700">Favorite Nannies</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between border p-4 rounded">
                <div className="flex items-center">
                  <img 
                    src="/api/placeholder/80/80" 
                    alt="Nanny" 
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Ana Rodrigues</h4>
                    <p className="text-gray-600">Early Childhood Educator</p>
                  </div>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800">
                  View Profile
                </button>
              </div>
              <div className="flex items-center justify-between border p-4 rounded">
                <div className="flex items-center">
                  <img 
                    src="/api/placeholder/80/80" 
                    alt="Nanny" 
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">Carlos Santos</h4>
                    <p className="text-gray-600">Experienced Caregiver</p>
                  </div>
                </div>
                <button className="text-indigo-600 hover:text-indigo-800">
                  View Profile
                </button>
              </div>
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
                <Search className="mr-3" /> Find a Nanny
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