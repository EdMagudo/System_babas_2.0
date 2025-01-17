import React, { useState } from 'react';
import { MapPin, Award, DollarSign, Clock, CalendarClock, Users, Languages, Star, Calendar } from 'lucide-react';
import axios from 'axios';

const NannyCard = ({
  nanny
}) => {
  // Gerenciamento de estado
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [showContactForm, setShowContactForm] = useState(false);
  const [children, setChildren] = useState(1);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');

  // Método para abrir a modal de comentários
  const openModal = async () => {
    setShowModal(true);
    const response = await axios.get(`http://localhost:3005/Review/comments/${nanny.user_id}`);
    setComments(response.data);
  };

  // Método para fechar a modal
  const closeModal = () => setShowModal(false);

  // Método para abrir o formulário de contato
  const handleContactClick = () => {
    setShowContactForm(!showContactForm);
  };

  // Método para enviar a solicitação
  const handleSubmitRequest = async (nannyId, em) => {
    try {
      console.log("Nanny email:", em);  // Verifique o valor de 'em' antes de usá-lo
  
      const clientId = localStorage.getItem("idUser");
      const email = localStorage.getItem("userEmail");
      const country = localStorage.getItem("userCountry");
      const province = localStorage.getItem("userProvince");
      const address = `${country}, ${province}`;
      const nanny_email = nanny.email;
      const nanny_Id = nanny.user_id;
      
      console.log("Nanny email:", nanny_email);
      // Validando campos obrigatórios
      if (!clientId || !email || !address || !startDate || !endDate || !nanny_email) {
        alert("Please ensure all required fields are filled.");
        return;
      }
  
      const requestData = {
        client_id: parseInt(clientId),
        nanny_id: nanny_Id,
        number_of_people: children,
        email: email,
        nanny_email: nanny_email,  // Certifique-se de que 'em' é um e-mail válido
        address: address,
        start_date: startDate,
        end_date: endDate,
        notes: notes || "",
      };
  
      console.log("Request data:", requestData);
  
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
        setShowContactForm(false);
      } else {
        throw new Error("Failed to send service request");
      }
    } catch (error) {
      console.error("Error sending service request:", error);
      alert("Failed to send service request. Please try again.");
    }
  };
  
  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="relative">
          <img
            src={nanny.profilePictureUrl || "/default-profile.png"}
            alt={`${nanny.first_name}'s profile`}
            className="w-full h-48 object-cover rounded-t-xl"
          />
        </div>

        <div className="p-6">
          <h3 className="text-xl font-semibold text-indigo-600 mb-1">{nanny.first_name}</h3>
          <span className="text-sm text-gray-500">{nanny.nannyProfile.education_level.replace(/_/g, " ").toUpperCase()}</span>

          <div className="space-y-4 mt-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Award className="w-5 h-5 text-indigo-500" />
              {nanny.nannyProfile.education_level.replace(/_/g, " ").toUpperCase()}
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <DollarSign className="w-4 h-4 text-indigo-600" />
                <p className="font-medium">
                  Currency: <span className="text-indigo-600">{nanny.nannyProfile.currency}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Clock className="w-4 h-4 text-indigo-600" />
                <p className="font-medium">
                  Daily: <span className="text-indigo-600">{nanny.nannyProfile.daily_salary}</span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <CalendarClock className="w-4 h-4 text-indigo-600" />
                <p className="font-medium">
                  Monthly: <span className="text-indigo-600">{nanny.nannyProfile.monthly_salary}</span>
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

            <div className="flex items-center gap-2 text-sm text-gray-700">
              <MapPin className="w-5 h-5 text-indigo-500" />
              {nanny.province}, {nanny.country}
            </div>

            <button
              onClick={openModal}
              className="bg-indigo-600 mt-4 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View All Comments and Ratings
            </button>

            {/* Botão de contato */}
            <div className="mt-4">
              <button
                onClick={handleContactClick}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Contact
              </button>
            </div>

            {/* Formulário de contato */}
            {showContactForm && (
              <ContactForm
                children={children}
                setChildren={setChildren}
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
                notes={notes}
                setNotes={setNotes}
                onSubmit={handleSubmitRequest}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modal de comentários */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-2/3 relative">
            <h3 className="text-xl font-semibold mb-4">Comments</h3>

            <div className="absolute top-4 right-4 bg-yellow-400 text-white px-4 py-2 rounded-lg shadow-lg">
              <span className="font-semibold">Rate: </span>
              <span className="text-lg">
                {comments.averageRating || "No Rating"}
              </span>
            </div>

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
                <p className="text-gray-500">No comments available.</p>
              )}
            </div>

            <button
              onClick={closeModal}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Formulário de contato
const ContactForm = ({
  children,
  setChildren,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  notes,
  setNotes,
  onSubmit
}) => {
  return (
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
          <span className="px-4 text-lg font-semibold">{children}</span>
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
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          End Date
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Please mention any allergies, special requests, or other important information."
          rows={3}
        />
      </div>

      <button
        onClick={onSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
      >
        Submit Request
      </button>
    </div>
  );
};

export default NannyCard;
