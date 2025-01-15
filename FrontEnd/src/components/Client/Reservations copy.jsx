import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, Clock, FileText, Mail, DollarSign, Tag } from "lucide-react";
import MpesaPaymentModal from '../Estrutura/MpesaPaymentModal';
const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mpesaModalOpen, setMpesaModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);

  const fetchReservations = async () => {
    const clientId = localStorage.getItem("idUser");
    if (!clientId) {
      console.error("Client ID not found in localStorage");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3005/reservations/getAll/reservations/client/${clientId}`
      );
      setReservations(response.data);
    } catch (error) {
      console.error("Error fetching reservations:", error);
      setMessage({ text: "Error fetching reservations", type: "error" });
    }
  };

  const handleMpesaPayment = (reservation) => {
    setSelectedReservation(reservation);
    setMpesaModalOpen(true);
  };

  const handleCancel = async (reservation_id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!confirmCancel) return;

    try {
      const response = await axios.delete(
        `http://localhost:3005/reservations/${reservation_id}`
      );
      if (response.status === 204) {
        setMessage({
          text: "Reservation cancelled successfully!",
          type: "success",
        });
        setReservations(
          reservations.filter((res) => res.reservation_id !== reservation_id)
        );
      } else {
        setMessage({ text: "Error cancelling the reservation", type: "error" });
      }
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      setMessage({ text: "Error cancelling the reservation", type: "error" });
    }
  };

  const handleFilter = () => {
    if (!startDate || !endDate) return reservations;

    return reservations.filter((reservation) => {
      const start = new Date(reservation.serviceRequest.start_date);
      const end = new Date(reservation.serviceRequest.end_date);
      const filterStart = new Date(startDate);
      const filterEnd = new Date(endDate);

      return start >= filterStart && end <= filterEnd;
    });
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const filteredReservations = handleFilter();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  return (
    <div className="max-w-5xl mx-auto bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-indigo-700 text-white">
        <h2 className="text-2xl font-bold">Client Reservations</h2>
      </div>

      {message.text && (
        <div
          className={`p-4 my-4 text-center text-white font-semibold ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="p-6">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {currentItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No reservations available
          </div>
        ) : (
          currentItems.map((reservation) => (
            <div
              key={reservation.reservation_id}
              className="bg-white p-6 rounded-lg shadow-md mb-4"
            >
              {/* Informações principais */}
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-lg font-bold text-indigo-700">
                    {reservation.serviceRequest.client.email}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Status: {reservation.status}
                  </p>
                </div>
                <div>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-sm rounded-full">
                    ${reservation.value}
                  </span>
                </div>
              </div>
              <div className="flex gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="text-gray-500" size={18} />
                  <span>
                    {new Date(
                      reservation.serviceRequest.start_date
                    ).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="text-gray-500" size={18} />
                  <span>
                    {new Date(
                      reservation.serviceRequest.end_date
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Notas */}
              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <FileText className="text-gray-500" size={18} />
                <p>{reservation.serviceRequest.notes}</p>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-4">
                {reservation.status !== "cancelled" && (
                  <button
                    onClick={() => handleCancel(reservation.reservation_id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md shadow hover:bg-red-700"
                  >
                    Cancel Reservation
                  </button>
                )}
                {reservation.status === "confirmed" && (
                  <>
                    <form action="http://localhost:3005/sam/pay" method="post">
                    <input
                          type="hidden"
                          name="reservationId"
                          value={reservation.reservation_id}
                        />
                        <input
                          type="hidden"
                          name="amount"
                          value={reservation.value}
                        />
                      
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700">
                        Pay with PayPal
                      </button>
                    </form>
                   
                          <button
        onClick={() => handleMpesaPayment(reservation)}
        className="px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
      >
        Pay with M-Pesa
      </button>
                
                  </>
                )}
              </div>
            </div>
          ))
        )}
          <MpesaPaymentModal
    isOpen={mpesaModalOpen}
    onClose={() => setMpesaModalOpen(false)}
    reservationId={selectedReservation?.reservation_id}
    amount={selectedReservation?.value}
  />

        {/* Paginação */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm font-medium rounded-md shadow ${
              currentPage === 1
                ? "bg-gray-300 text-gray-500"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm font-medium rounded-md shadow ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-500"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reservations;
