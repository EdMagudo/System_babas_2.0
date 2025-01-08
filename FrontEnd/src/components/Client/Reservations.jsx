import React, { useState, useEffect } from "react";
import { Calendar, Clock, FileText, Mail, DollarSign, Tag, AlertCircle, X } from "lucide-react";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReservations = async () => {
    const clientId = localStorage.getItem("idUser");
    if (!clientId) {
      setMessage({ text: "Client ID not found. Please log in again.", type: "error" });
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3005/reservations/getAll/reservations/client/${clientId}`
      );
      const data = await response.json();
      setReservations(data);
    } catch (error) {
      setMessage({ text: "Error fetching reservations", type: "error" });
    }
  };

  const handleCancel = async (reservation_id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!confirmCancel) return;

    try {
      const response = await fetch(
        `http://localhost:3005/reservations/${reservation_id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
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
      setMessage({ text: "Error cancelling the reservation", type: "error" });
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

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

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
      completed: "bg-blue-100 text-blue-800"
    };
    return colors[status.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const filteredReservations = handleFilter();
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Reservations</h2>
        </div>

        {message.text && (
          <div className={`p-4 flex items-center gap-2 ${
            message.type === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
          }`}>
            <AlertCircle className="h-5 w-5" />
            <p className="text-sm">{message.text}</p>
          </div>
        )}

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-4">
            {currentItems.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No reservations</h3>
                <p className="mt-1 text-sm text-gray-500">No reservations found for the selected period.</p>
              </div>
            ) : (
              currentItems.map((reservation) => (
                <div key={reservation.reservation_id} className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-5 w-5 text-gray-500" />
                          <span className="font-medium">{reservation.serviceRequest.client.email}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.status)}`}>
                          {reservation.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-gray-500" />
                          <span>Start: {new Date(reservation.serviceRequest.start_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-gray-500" />
                          <span>End: {new Date(reservation.serviceRequest.end_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-5 w-5 text-gray-500" />
                          <span>${reservation.value}</span>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <FileText className="h-5 w-5 text-gray-500 mt-1" />
                        <p className="text-gray-600">{reservation.serviceRequest.notes}</p>
                      </div>

                      <div className="flex justify-end space-x-4 pt-4">
                        {reservation.status !== "cancelled" && (
                          <button
                            onClick={() => handleCancel(reservation.reservation_id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            Cancel Reservation
                          </button>
                        )}
                        {reservation.status === "confirmed" && (
                          <form
                            action="http://localhost:3005/sam/pay"
                            method="post"
                            className="inline"
                          >
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
                            <button
                              type="submit"
                              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              Pay Now
                            </button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex justify-between items-center pt-6">
            <button
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservations;