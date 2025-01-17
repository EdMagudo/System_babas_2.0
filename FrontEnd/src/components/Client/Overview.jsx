import React, { useState, useEffect } from "react";
import axios from "axios";

const Overview = ({ clientProfile, idUser }) => {
  const {
    totalNannySearches = 0,
    profileCompleteness = 0,
    recentActivities = [],
  } = clientProfile;

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [completedJobs, setCompletedJobs] = useState("");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
  });
  const [saving, setSaving] = useState({ phone: false });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const idUser = localStorage.getItem("idUser");
      try {
        const response = await axios.get(`http://localhost:3005/client/${idUser}`);
        setEmail(response.data.email);
        setPhone(response.data.phone);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setMessage({ type: "error", text: "Erro ao carregar perfil do usuário." });
      }
    };

    const fetchCompletedJobs = async () => {
      const idUser = localStorage.getItem("idUser");
      try {
        const response = await axios.get(
          `http://localhost:3005/reservations/countReservationsC/${idUser}`
        );
        setCompletedJobs(response.data.count || 0);
      } catch (error) {
        console.error("Erro ao buscar trabalhos concluídos:", error);
      }
    };

    fetchUserProfile();
    fetchCompletedJobs();
  }, [idUser]);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleSavePhone = async () => {
    const idUser = localStorage.getItem("idUser");
    setSaving((prev) => ({ ...prev, phone: true }));
    try {
      const response = await axios.put(
        `http://localhost:3005/user/save/Phone/${idUser}`,
        { phone }
      );
  
      if (response.status === 200) {
        setMessage({ type: "success", text: "Número de telefone atualizado com sucesso!" });
        setPhone("");
      } else {
        throw new Error("Falha ao atualizar número de telefone");
      }
    } catch (error) {
      console.error("Erro ao atualizar número de telefone:", error);
      setMessage({ type: "error", text: "Falha ao atualizar número de telefone." });
    } finally {
      setSaving((prev) => ({ ...prev, phone: false }));
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      setMessage({ type: "error", text: "Por favor, preencha todos os campos." });
      return;
    }

    try {
      const response = await axios.put("http://localhost:3005/user/upd/Pas", {
        email,
        currentPassword,
        newPassword,
      });

      if (response.status === 200) {
        setMessage({ type: "success", text: "Senha atualizada com sucesso!" });
      }
    } catch (error) {
      console.error("Erro ao atualizar senha:", error);
      setMessage({ type: "error", text: "Houve um erro ao atualizar a senha." });
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Seção de Estatísticas Rápidas */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">Estatísticas Rápidas</h3>
        <p>
          Total de reservas pagas:{" "}
          <span className="font-bold text-gray-800">{completedJobs}</span>
        </p>
      </div>

      {/* Seção de Alteração de Senha */}
      <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">
          Alterar Email e Senha
        </h3>
        <form onSubmit={handlePasswordChange} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Seu endereço de email"
            />
          </div>

          <div>
            <label
              htmlFor="current-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Senha Atual
            </label>
            <div className="relative">
              <input
                type={showPassword.current ? "text" : "password"}
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Digite sua senha atual"
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

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nova Senha
            </label>
            <div className="relative">
              <input
                type={showPassword.new ? "text" : "password"}
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Digite sua nova senha"
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

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Atualizar Senha
            </button>
          </div>
        </form>
      </div>

      {/* Informações de Contato */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Informações de Contato</h2>
          <button
            onClick={handleSavePhone}
            disabled={saving.phone}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {saving.phone ? "Salvando..." : "Salvar"}
          </button>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Por favor, atualize seu número de telefone abaixo. Certifique-se de incluir o código do país.
        </p>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
          Número de Telefone
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={handlePhoneChange}
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          placeholder="Ex: +55 (11) 99999-9999"
        />
      </div>

      {/* Mensagem de feedback */}
      {message.text && (
        <div
          className={`mt-4 text-sm ${
            message.type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default Overview;