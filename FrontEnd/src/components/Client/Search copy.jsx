import React, { useState, useEffect } from "react";
import axios from "axios";
import NannyCard from "./NannyCard"; // Importa o componente NannyCard

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setClient((prev) => ({
      ...prev,
      [id]: value,
    }));
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

      const requestBody = {
        province: client.province,
        jobType: availability,
      };

      const url = "http://localhost:3005/user/getAllNannyWith/Requirement";

      const response = await axios.post(url, requestBody);

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
      if (error.response && error.response.status === 404) {
        alert("Não encontramos resultados para a sua pesquisa.");
      } else {
        console.error("Error fetching nannies:", error);
        alert("Ocorreu um erro ao buscar as babás. Tente novamente.");
      }
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
            <NannyCard key={nanny.user_id} nanny={nanny} />
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
