import React, { useState, useEffect } from "react";
import axios from "axios";

const Overview = ({ clientProfile, idUser }) => {
  const {
    totalNannySearches = 0,
    profileCompleteness = 0,
    recentActivities = [],
  } = clientProfile;

  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(""); // Novo estado para feedback
    new: false,
    confirm: false,
  });

  // Carregar o email ao montar o componente
  useEffect(() => {
    const fetchUserProfile = async () => {
      const idUser = localStorage.getItem("idUser");
      try {
        const response = await axios.get(`http://localhost:3005/client/${idUser}`);
        setEmail(response.data.email); // Definir o email no estado
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setFeedbackMessage("Error loading user profile.");
        setFeedbackType("error"); // Definir tipo de feedback como erro
      }
    };
    
    fetchUserProfile();
  }, [idUser]);

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      setFeedbackMessage("Please fill in all fields.");
      setFeedbackType("error"); // Tipo de feedback erro
      return;
    }

    try {
      // Realizar a requisição para mudar a senha
      const response = await axios.put("http://localhost:3005/user/upd/Pas", {
        email: email, // Passar o email do estado
        currentPassword: currentPassword, // Passar a senha atual
        newPassword: newPassword, // Passar a nova senha
      });
      
      if (response.status === 200) {
        setFeedbackMessage("Password updated successfully!");
        setFeedbackType("success"); // Tipo de feedback sucesso
      }
    } catch (error) {
      console.error("Error updating password:", error);
      setFeedbackMessage("There was an error updating the password.");
      setFeedbackType("error"); // Tipo de feedback erro
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Stats Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">
          Quick Stats
        </h3>
        <div className="space-y-4">
          <p>
            Total Nanny Searches:{" "}
            <span className="font-bold text-gray-800">{totalNannySearches}</span>
          </p>
        </div>
      </div>

      {/* Recent Activity Section */}

      {/* Change Password Section */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">
          Change Email and Password
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-6">
          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              disabled
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter your email"
            />
          </div>

          {/* Current Password field */}
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter current password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword.current ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          {/* New Password field */}
          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                {showPassword.new ? "👁️" : "🔒"}
              </button>
            </div>
          </div>

          {/* Feedback message */}
          {feedbackMessage && (
            <div
              className={`text-sm mt-8 ${
                feedbackType === "success" ? "text-green-500" : "text-red-500"
              }`}
            >
              {feedbackMessage}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Overview;
