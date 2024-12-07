import React, { useState } from 'react';
import { Home, User, Briefcase, Calendar, MessageCircle } from 'lucide-react';

const NannyDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');

  // Mock data - in a real application, this would come from backend/context
  const nannyProfile = {
    firstName: "Maria",
    lastName: "Silva",
    email: "maria.silva@email.com",
    country: "Brazil",
    province: "São Paulo",
    educationLevel: "University Graduate",
    profilePicture: "/api/placeholder/200/200",
    availabilityStatus: "Available",
    completedJobs: 12,
    rating: 4.7
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
              <p>Dedicated and experienced nanny with a background in early childhood education. Passionate about providing high-quality childcare and creating nurturing environments.</p>
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
                <p>Languages: Portuguese, English</p>
              </div>
            </div>
          </div>
        );
      case 'jobs':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">Job Opportunities</h3>
            <div className="space-y-4">
              <div className="border p-4 rounded-md">
                <h4 className="font-semibold">Part-time Nanny - Family in São Paulo</h4>
                <p>2 children, ages 3 and 6</p>
                <p className="text-green-600">Application Open</p>
              </div>
              <div className="border p-4 rounded-md">
                <h4 className="font-semibold">Full-time Nanny - Suburban Family</h4>
                <p>1 infant, need experienced caregiver</p>
                <p className="text-yellow-600">Interview Scheduled</p>
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