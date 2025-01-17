import React, { useState, useEffect } from "react";
import axios from "axios";
import { Home, Search as SearchIcon, Star } from "lucide-react";
import Overview from "../components/Client/Overview";
import Search from "../components/Client/Search";
import Favorites from "../components/Client/Requirements";
import ProfilePictureUploader from "../components/Nanny/ProfilePictureUploader";
import Reservations from "../components/Client/Reservations";

const ClientDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [clientProfile, setClientProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("idUser");

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3005/client/${userId}`
        );
        setClientProfile(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
        setLoading(false);
      }
    };

    fetchClientData();
  }, [userId]);

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <Overview clientProfile={clientProfile} />;
      case "search":
        return <Search />;
      case "favorites":
        return <Favorites />;
      case "reservations":
        return <Reservations />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Layout Responsivo */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <div className="text-center mb-6">
              <ProfilePictureUploader
                uploadEndpoint={`http://localhost:3005/user/uploadProfile/Picture/${clientProfile.user_id}`}
                fetchImageEndpoint={`http://localhost:3005/user/${clientProfile.user_id}/profile-picture`}
                onUploadSuccess={(newImageUrl) => {
                  console.log("Foto atualizada com sucesso:", newImageUrl);
                }}
              />
              <h2 className="text-lg sm:text-2xl font-bold text-indigo-700">
                {clientProfile.first_name} {clientProfile.last_name}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {clientProfile.province_name}, {clientProfile.country_name}
              </p>
            </div>
            <nav className="space-y-4">
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full flex items-center p-2 sm:p-3 rounded-lg ${
                  activeSection === "overview"
                    ? "bg-indigo-100 text-indigo-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Home className="mr-2 sm:mr-3" /> Dashboard
              </button>
              <button
                onClick={() => setActiveSection("search")}
                className={`w-full flex items-center p-2 sm:p-3 rounded-lg ${
                  activeSection === "search"
                    ? "bg-indigo-100 text-indigo-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <SearchIcon className="mr-2 sm:mr-3" /> Find a Nanny
              </button>
              <button
                onClick={() => setActiveSection("favorites")}
                className={`w-full flex items-center p-2 sm:p-3 rounded-lg ${
                  activeSection === "favorites"
                    ? "bg-indigo-100 text-indigo-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Star className="mr-2 sm:mr-3" /> Requeriments
              </button>
              <button
                onClick={() => setActiveSection("reservations")}
                className={`w-full flex items-center p-2 sm:p-3 rounded-lg ${
                  activeSection === "reservations"
                    ? "bg-indigo-100 text-indigo-700"
                    : "hover:bg-gray-100"
                }`}
              >
                <Star className="mr-2 sm:mr-3" /> Reservations
              </button>
            </nav>
          </div>

          {/* Conteúdo Principal */}
          <div className="col-span-1 lg:col-span-3">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md mb-6">
              <h1 className="text-lg sm:text-3xl font-bold text-indigo-700">
                Welcome, {clientProfile.first_name}!
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Explore and find the perfect nanny for your family.
              </p>
            </div>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
