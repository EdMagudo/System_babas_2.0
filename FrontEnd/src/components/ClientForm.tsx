import React, { useState, useEffect } from 'react';
import { Upload, User } from 'lucide-react';
import axios from 'axios';

const NannyFinderForm = () => {
  const [client, setClient] = useState({
    name: '',
    surname: '',
    contactPhone: '',
    contactEmail: '',
    country: '',
    idNumber: '',
    datesTimes: '',
    numChildren: '',
    childrenAgeGroups: [],
    specialNeeds: 'no',
    preferences: '',
  });

  const [file, setFile] = useState(null); // Estado para armazenar o arquivo
  const [countries, setCountries] = useState([]); // Estado para armazenar os países
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(""); // Estado para mensagens de erro
  const [successMessage, setSuccessMessage] = useState(""); // Estado para mensagens de sucesso

  // Função para buscar os países da API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:3005/countries'); // Ajuste para a URL correta do seu backend
        setCountries(response.data);
        setLoading(false); // Alterar o estado de carregamento após os países serem carregados
      } catch (error) {
        console.error('Erro ao buscar países:', error);
        setLoading(false); // Alterar o estado de carregamento mesmo após erro
      }
    };

    fetchCountries();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile); // Armazenar o arquivo no estado
  };

  const submitForm = async (e) => {
    e.preventDefault();

    // Verificar se um arquivo foi selecionado
    if (!file) {
      setError("Por favor, faça o upload de um arquivo.");
      return;
    }

    const formData = new FormData();
    formData.append('name', client.name);
    formData.append('surname', client.surname);
    formData.append('contactPhone', client.contactPhone);
    formData.append('contactEmail', client.contactEmail);
    formData.append('country', client.country);
    formData.append('idNumber', client.idNumber);
    formData.append('file', file); // Enviar o arquivo

    
    try {
      if (formData && formData.entries && [...formData.entries()].length === 0) {
        console.log("FormData está vazio");
    } else {
        console.log("FormData não está vazio");
    }
    
      const response = await axios.post('http://localhost:3005/registerClient', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Indica que estamos enviando um formulário com arquivo
        },
      });

      setSuccessMessage("Cliente registrado com sucesso!");
      setError(""); // Limpar mensagens de erro
      console.log(response.data); // Você pode personalizar como deseja tratar a resposta
    } catch (err) {
      setSuccessMessage(""); // Limpar mensagens de sucesso
      setError("Erro ao registrar cliente. Tente novamente mais tarde."+ err);
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-indigo-600 mb-4">Customer Registration Form</h2>
        <p className="text-gray-500">Fill out the form to start your search</p>
      </div>

      <form onSubmit={submitForm} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-gray-50 p-6 rounded-xl">
          <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center">
            <User className="mr-3 text-indigo-500" />
            Personal Information
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                type="text"
                id="name"
                value={client.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700 mb-2">Surname</label>
              <input
                type="text"
                id="surname"
                value={client.surname}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                id="contactPhone"
                value={client.contactPhone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                id="contactEmail"
                value={client.contactEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              {loading ? (
                <p>Loading countries...</p> // Mensagem de carregamento enquanto os países não são carregados
              ) : (
                <select
                  id="country"
                  value={client.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                  required
                >
                  <option value="" disabled>Select a country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700 mb-2">ID / Passport Number</label>
              <input
                type="text"
                id="idNumber"
                value={client.idNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
          </div>

          {/* Upload File */}
          <div className="mt-4">
            <label htmlFor="idCopy" className="block text-sm font-medium text-gray-700 mb-2">Upload ID Copy</label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center px-4 py-6 bg-gray-50 text-blue-500 rounded-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-indigo-500 hover:text-white">
                <Upload className="w-8 h-8" />
                <span className="mt-2 text-base leading-normal">Select a file</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange} // Atualiza o estado do arquivo
                  required
                />
              </label>
            </div>
          </div>
        </div>

        {/* Exibir mensagens de erro ou sucesso */}
        {error && <div className="text-red-600">{error}</div>}
        {successMessage && <div className="text-green-600">{successMessage}</div>}

        <div className="text-center">
          <button
            type="submit"
            className="px-8 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors text-lg font-semibold"
          >
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default NannyFinderForm;
