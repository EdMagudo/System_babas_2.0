import React, { useState, useEffect } from "react";
import { MapPin, Award, Mail, Calendar } from "lucide-react";
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


  const handleSubmitRequest = async (nannyId) => {
    try {
      // Obtendo dados do localStorage
      const clientId = localStorage.getItem("idUser");
      const email = localStorage.getItem("userEmail");
      const country = localStorage.getItem("userCountry");
      const province = localStorage.getItem("userProvice");
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
        address: address,
        start_date: startDate,
        end_date: endDate,
        notes: notes || '',  // Garantindo que 'notes' não seja undefined
      };
  
      const response = await axios.post("http://localhost:3005/requestServices", requestData);
  
      if (response.status === 200|| response.status ===201) {
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
              <option value="full-time">Full-time</option>
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

              <div className="p-6">
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

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Award className="w-5 h-5 text-indigo-500" />
                    {nanny.nannyProfile.education_level
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail className="w-5 h-5 text-indigo-500" />
                    {nanny.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <MapPin className="w-5 h-5 text-indigo-500" />
                    {nanny.province},{nanny.country}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    onClick={() => handleContact(nanny.user_id)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Contact
                  </button>
                </div>

                {showContactForm === nanny.user_id && (
                  <div className="mt-6">
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

                    <div className="mt-6">
                      <button
                        onClick={() => handleSubmitRequest(nanny.user_id)}
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
