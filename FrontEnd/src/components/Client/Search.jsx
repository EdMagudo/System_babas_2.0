import React, { useState, useEffect } from "react";
import {
  MapPin,
  Award,
  Calendar,
  DollarSign,
  Clock,
  CalendarClock,
  Users,
  Languages,
  Heart,
  Star,
} from "lucide-react";
import axios from "axios";

const Search = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [children, setChildren] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setSpecialRequests] = useState("");
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [client, setClient] = useState({
    country: "",
    province: "",
  });
  const [availability, setAvailability] = useState("");
  const [showContactForm, setShowContactForm] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [comments, setComments] = useState([]);
  const [averageRating, setAverageRating] = useState(4.5); // Exemplo de avaliação média
  const [showModal, setShowModal] = useState(false); // Controla se a modal está visível
  const [nannyId, setNannyId] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleContact = (nannyId) => {
    // Toggle para mostrar ou esconder o formulário de contato
    setShowContactForm((prev) => (prev === nannyId ? null : nannyId));
  };

  const handleAvailabilityChange = (e) => {
    setAvailability(e.target.value);
  };

  const handleSearch = async () => {
    try {
      if (!client.country || !client.province || !availability) {
        alert("Please select country, province, and availability.");
        return;
      }

      // Criando o corpo da requisição com os parâmetros
      const requestBody = {
        province: client.province,
        jobType: availability,
      };

      console.log(requestBody);

      const url = "http://localhost:3005/user/getAllNannyWith/Requirement";

      // Fazendo a requisição POST com os parâmetros no corpo
      const response = await axios.post(url, requestBody);

      // Verificar se a resposta contém resultados
      if (response.status === 200 && response.data.length === 0) {
        alert("Não encontramos resultados para a sua pesquisa.");
      } else {
        const nannies = response.data.map((nanny) => {
          const filePath = nanny.files?.[0]?.path;
          const fileName = filePath ? filePath.split("\\").pop() : null;
          const profilePictureUrl = fileName
            ? `http://localhost:3005/uploads/${fileName}`
            : "/default-profile.png";

          return { ...nanny, profilePictureUrl };
        });

        setSearchResults(nannies);
        setCurrentPage(1);
      }
    } catch (error) {
      // Verificar se o erro é um 404
      if (error.response && error.response.status === 404) {
        alert("Não encontramos resultados para a sua pesquisa.");
      } else {
        console.error("Error fetching nannies:", error);
        alert("Ocorreu um erro ao buscar as babás. Tente novamente.");
      }
    }
  };

  const openModal = (userId) => {
    setNannyId(userId);
    setShowModal(true);
    fetchComments(userId); // Busca os comentários quando a modal é aberta
  };

  // Função para fechar a modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Função para buscar os comentários
  const fetchComments = async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3005/Review/comments/${userId}`
      );
      setComments(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  };

  const handleSubmitRequest = async (nannyId, em) => {
    try {
      // Obtendo dados do localStorage
      const clientId = localStorage.getItem("idUser");
      const email = localStorage.getItem("userEmail");
      const country = localStorage.getItem("userCountry");
      const province = localStorage.getItem("userProvince");
      const address = `${country}, ${province}`;

      // Validando campos obrigatórios
      if (!clientId || !email || !address || !startDate || !endDate) {
        alert("Please ensure all required fields are filled.");
        return;
      }

      const requestData = {
        client_id: parseInt(clientId),
        nanny_id: nannyId,
        number_of_people: children,
        email: email,
        nanny_email: em,
        address: address,
        start_date: startDate,
        end_date: endDate,
        notes: notes || "", // Garantindo que 'notes' não seja undefined
      };

      const response = await axios.post(
        "http://localhost:3005/requestServices",
        requestData
      );

      if (response.status === 200 || response.status === 201) {
        alert("Service request sent successfully!");
        // Resetando o estado após o envio
        setChildren(1);
        setStartDate("");
        setEndDate("");
        setSpecialRequests("");
        setShowContactForm(null);
      } else {
        throw new Error("Failed to send service request");
      }
    } catch (error) {
      console.error("Error sending service request:", error);
      alert("Failed to send service request. Please try again.");
    }
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:3005/countries");
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (client.country) {
      const fetchProvinces = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3005/provinces/${client.country}`
          );
          setProvinces(response.data);
        } catch (error) {
          console.error("Error fetching provinces:", error);
        }
      };

      fetchProvinces();
    }
  }, [client.country]);

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < searchResults.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const currentResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-indigo-700">
          Find a Nanny
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2">Country</label>
            <select
              id="country"
              value={client.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="" disabled>
                Select Country
              </option>
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2">Province</label>
            <select
              id="province"
              value={client.province}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            >
              <option value="" disabled>
                Select Province
              </option>
              {provinces.map((province, index) => (
                <option key={index} value={province}>
                  {province}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 text-gray-700">Availability</label>
            <select
              value={availability}
              onChange={handleAvailabilityChange}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="">Select Availability</option>
              <option value="full_time">Full-time</option>
              <option value="temporary">Temporary</option>
            </select>
          </div>

          <div className="col-span-3 mt-4">
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Search Nannies
            </button>
          </div>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="grid grid-cols-2 gap-6">
          {currentResults.map((nanny) => (
            <div
              key={nanny.user_id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              {/* Imagem de perfil */}
              <div className="relative">
                <img
                  src={nanny.profilePictureUrl}
                  alt={`${nanny.first_name}'s profile`}
                  className="w-full h-48 object-cover rounded-t-xl"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-profile.png";
                  }}
                />
              </div>

              {/* Informações principais da babá */}
              <div className="p-6">
                {/* Nome e nível de educação */}
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-indigo-600 mb-1">
                    {nanny.first_name}
                  </h3>
                  <span className="text-sm text-gray-500">
                    {nanny.nannyProfile.education_level
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Nível de Educação */}
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Award className="w-5 h-5 text-indigo-500" />
                    {nanny.nannyProfile.education_level
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>

                  {/* Salários (diário e mensal) */}
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <DollarSign className="w-4 h-4 text-indigo-600" />
                      <p className="font-medium">
                        Currency:{" "}
                        <span className="text-indigo-600">
                          {nanny.nannyProfile.currency}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <p className="font-medium">
                        Daily:{" "}
                        <span className="text-indigo-600">
                          {nanny.nannyProfile.daily_salary}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <CalendarClock className="w-4 h-4 text-indigo-600" />
                      <p className="font-medium">
                        Monthly:{" "}
                        <span className="text-indigo-600">
                          {nanny.nannyProfile.monthly_salary}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Data de nascimento */}
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Users className="w-4 h-4 text-indigo-600" />
                    <p className="font-medium">
                      Date of birth:{" "}
                      <span className="text-indigo-600">
                        {nanny.nannyProfile.dob}
                      </span>
                    </p>
                  </div>

                  {/* Idiomas */}
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Languages className="w-5 h-5 text-indigo-600" />
                    <div className="flex flex-wrap gap-2">
                      {nanny.languages && nanny.languages.length > 0 ? (
                        nanny.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded-full"
                          >
                            {language.trim()}
                          </span>
                        ))
                      ) : (
                        <span>No languages available</span>
                      )}
                    </div>
                  </div>

                  {/* Localização */}
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-5 h-5 text-indigo-500" />
                    {nanny.province}, {nanny.country}
                  </div>
                </div>

                {/* Botão para abrir a modal de comentários */}
                <button
                  onClick={() => openModal(nanny.user_id)} // Substitua 1 pelo ID real da babá
                  className="bg-indigo-600 mt-4 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View All Comments and Ratings
                </button>

                {/* Botão para Contatar a Babá */}
                <div className="mt-4">
                  <button
                    onClick={() => handleContact(nanny.user_id)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Contact
                  </button>
                </div>

                {/* Formulário de contato (exibido quando o botão de contatar é clicado) */}
                {showContactForm === nanny.user_id && (
                  <div className="mt-6">
                    {/* Número de crianças */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Children
                      </label>
                      <div className="flex items-center bg-gray-100 rounded-lg">
                        <button
                          onClick={() => setChildren(Math.max(1, children - 1))}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-l-lg"
                        >
                          -
                        </button>
                        <span className="px-4 text-lg font-semibold">
                          {children}
                        </span>
                        <button
                          onClick={() => setChildren(children + 1)}
                          className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-r-lg"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Data de início */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <div className="flex items-center">
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <Calendar className="ml-2 text-gray-500" />
                      </div>
                    </div>

                    {/* Data de término */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <div className="flex items-center">
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <Calendar className="ml-2 text-gray-500" />
                      </div>
                    </div>

                    {/* Notas */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Please mention any allergies, special requests, or other important information."
                        rows={3}
                      />
                    </div>

                    {/* Botão para enviar o pedido */}
                    <div className="mt-6">
                      <button
                        onClick={() =>
                          handleSubmitRequest(nanny.user_id, nanny.email)
                        }
                        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                      >
                        Submit Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

{showModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-white p-6 rounded-lg w-2/3 relative">
      <h3 className="text-xl font-semibold mb-4">Comments</h3>

      {/* Exibindo a Média no canto superior direito */}
      <div className="absolute top-4 right-4 bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-lg">
        <span className="font-semibold">Rate: </span>
        <span className="text-lg">
          {comments.averageRating || "Sem Avaliação"}
        </span>
      </div>

      {/* Renderizando os Comentários */}
      <div className="space-y-4 mt-8">
        {comments && comments.comments && comments.comments.length > 0 ? (
          comments.comments.map((comment, index) => (
            <div key={index} className="border-b pb-4">
              <p className="text-gray-700 text-base">{comment.review_text}</p>
              <div className="flex items-center mt-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="ml-2 text-sm text-gray-600">
                  {comment.rating}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">
No comments available.</p>
        )}
      </div>

      {/* Botão para Fechar o Modal */}
      <button
        onClick={closeModal}
        className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
      >
        Close
      </button>
    </div>
  </div>
)}

      {searchResults.length > itemsPerPage && (
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Previous
          </button>
          <button
            onClick={handleNextPage}
            disabled={currentPage * itemsPerPage >= searchResults.length}
            className={`px-4 py-2 rounded-lg ${
              currentPage * itemsPerPage >= searchResults.length
                ? "bg-gray-300 text-gray-600"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
