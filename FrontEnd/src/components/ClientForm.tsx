import React, { useState, useEffect } from "react";
import { Upload, User } from "lucide-react";
import axios from "axios";

const NannyFinderForm = () => {
  const [client, setClient] = useState({
    email: "",
    password_hash: "",
    role: "client",
    first_name: "",
    last_name: "",
    id_number: "",
    country_name: "",
    province_name: "",
  });

  const [file, setFile] = useState(null); // Estado para armazenar o arquivo
  const [filePreview, setFilePreview] = useState(""); // Estado para armazenar a pré-visualização do arquivo
  const [countries, setCountries] = useState([]); // Estado para armazenar os países
  const [provinces, setProvinces] = useState([]); // Estado para armazenar as províncias
  const [loading, setLoading] = useState(true); // Estado de carregamento dos países
  const [loadingProvinces, setLoadingProvinces] = useState(false); // Estado de carregamento das províncias
  const [error, setError] = useState(""); // Estado para mensagens de erro
  const [successMessage, setSuccessMessage] = useState(""); // Estado para mensagens de sucesso
  const [uploadSuccess, setUploadSuccess] = useState(false); // Estado para mostrar sucesso no upload

  // Função para buscar os países da API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:3005/countries");
        setCountries(response.data);
        setLoading(false); // Alterar o estado de carregamento após os países serem carregados
      } catch (error) {
        console.error("Erro ao buscar países:", error);
        setLoading(false); // Alterar o estado de carregamento mesmo após erro
      }
    };

    fetchCountries();
  }, []);

  // Função para buscar as províncias com base no país selecionado
  useEffect(() => {
    if (client.country_name) {
      setLoadingProvinces(true); // Iniciar o carregamento das províncias
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3005/provinces/${client.country_name}`
          );
          setProvinces(response.data);
          setLoadingProvinces(false); // Parar o carregamento após as províncias serem carregadas
        } catch (error) {
          console.error("Erro ao buscar províncias:", error);
          setLoadingProvinces(false); // Parar o carregamento em caso de erro
        }
      };

      fetchProvinces();
    }
  }, [client.country_name]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({ ...prev, [id]: value }));
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile); // Armazenar o arquivo no estado

    // Se o arquivo for uma imagem, criar uma pré-visualização
    if (uploadedFile && uploadedFile.type.startsWith("image/")) {
      const previewUrl = URL.createObjectURL(uploadedFile);
      setFilePreview(previewUrl);
    } else {
      setFilePreview(""); // Limpar a pré-visualização se não for imagem
    }
    setUploadSuccess(false); // Resetar o estado de upload antes de enviar
  };

  const submitForm = async (e) => {
    e.preventDefault();

    // Verificar se um arquivo foi selecionado
    if (!file) {
      setError("Por favor, faça o upload de um arquivo.");
      return;
    }
    

    const formData = new FormData();
    formData.append("email", client.email);
    formData.append("password_hash", client.password_hash);
    formData.append("role", client.role);
    formData.append("first_name", client.first_name);
    formData.append("last_name", client.last_name);
    formData.append("id_number", client.id_number);
    formData.append("country_name", client.country_name);
    formData.append("province_name", client.province_name);
    formData.append("file", file); // Enviar o arquivo

    try {
      const response = await axios.post(
        "http://localhost:3005/user",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMessage("Cliente registrado com sucesso!");
      setError(""); // Limpar mensagens de erro
      setUploadSuccess(true); // Marcar o upload como concluído
      console.log(response.data); // Você pode personalizar como deseja tratar a resposta
    } catch (err) {
      setSuccessMessage(""); // Limpar mensagens de sucesso
      setError("Erro ao registrar cliente. Tente novamente mais tarde.");
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-indigo-600 mb-4">
          Customer Registration Form
        </h2>
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
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                value={client.first_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
                  pattern="[A-Za-z]{3,}" // Aceita apenas letras com 3 ou mais caracteres
                  title="O nome deve conter pelo menos 3 letras e apenas caracteres alfabéticos."
                
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                value={client.last_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
                  pattern="[A-Za-z]{3,}" // Aceita apenas letras com 3 ou mais caracteres
            title="O nome deve conter pelo menos 3 letras e apenas caracteres alfabéticos."
              />
            </div>
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
                value={client.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              />
            </div>
            <div>
              <label
                htmlFor="id_number"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                ID Number
              </label>
              <input
                type="text"
                id="id_number"
                value={client.id_number}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
                  pattern="\d{12}[A-Za-z]|[A-Za-z]{2}\d{7}" // Aceita BI ou passaporte
            title="O ID deve ter 12 dígitos seguidos de uma letra (BI) ou 2 letras seguidas de 7 números (Passaporte)."
              />
            </div>
            <div>
              <label
                htmlFor="country_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Country
              </label>
              <select
                id="country_name"
                value={client.country_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                required
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="province_name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Province
              </label>
              <select
                id="province_name"
                value={client.province_name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
                disabled={loadingProvinces}
                required
              >
                <option value="">Select a province</option>
                {loadingProvinces ? (
                  <option>Loading provinces...</option>
                ) : (
                  provinces.map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Upload File */}
          <div className="mt-4">
            <label
              htmlFor="idCopy"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload ID Copy
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center px-4 py-6 bg-gray-50 text-blue-500 rounded-lg tracking-wide uppercase border border-blue cursor-pointer hover:bg-indigo-500 hover:text-white">
                <Upload className="w-8 h-8" />
                <span className="mt-2 text-base leading-normal">
                  Select a file
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  required
                />
              </label>
            </div>
            {file && (
              <div className="mt-2 text-sm text-gray-600">
                {filePreview ? (
                  <img
                    src={filePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-md"
                  />
                ) : (
                  <span>{file.name}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Exibir mensagens de erro ou sucesso */}
        {(error || successMessage) && (
          <div className="text-center">
            {error && <div className="text-red-600">{error}</div>}
            {successMessage && (
              <div className="text-green-600">{successMessage}</div>
            )}
          </div>
        )}

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
