import React, { useEffect, useState } from "react";
import {
  Calendar,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Bookmark,
  DollarSign,
  CheckCircle,
  FileText,
} from "lucide-react";

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [nannyNames, setNannyNames] = useState({});
  const [activeTab, setActiveTab] = useState("confirmed");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch reservations
  useEffect(() => {
    fetch("http://localhost:3005/reservations")
      .then((response) => response.json())
      .then((data) => {
        setReservations(data);
        fetchNannyNames(data);
      })
      .catch((error) => console.error("Error fetching reservations:", error));
  }, []);

  // Fetch nanny names
  const fetchNannyNames = async (reservations) => {
    const names = {};
    for (const reservation of reservations) {
      const nannyId = reservation.nanny_id;
      if (!names[nannyId]) {
        try {
          const response = await fetch(`http://localhost:3005/user/${nannyId}`);
          const data = await response.json();
          names[nannyId] = `${data.first_name} ${data.last_name}`;
        } catch (error) {
          console.error(`Error fetching nanny name for ID ${nannyId}:`, error);
        }
      }
    }
    setNannyNames(names);
  };

  // Filter reservations by tab and dates
  useEffect(() => {
    let filtered = reservations.filter(
      (reservation) => reservation.status === activeTab
    );
    if (startDate) {
      filtered = filtered.filter(
        (reservation) => new Date(reservation.booking_date) >= new Date(startDate)
      );
    }
    if (endDate) {
      filtered = filtered.filter(
        (reservation) => new Date(reservation.booking_date) <= new Date(endDate)
      );
    }
    setFilteredReservations(filtered);
    setCurrentPage(1);
  }, [reservations, activeTab, startDate, endDate]);

  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);
  const currentReservations = filteredReservations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePayment = (reservationId) => {
    alert(`Payment processed for reservation ${reservationId}`);
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Tabs */}
      <div className="flex justify-between items-center">
        <div className="bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("confirmed")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "confirmed"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4" />
              Confirmed
            </div>
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeTab === "completed"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed
            </div>
          </button>
        </div>
        <button
          onClick={clearFilters}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-all duration-200"
        >
          <RefreshCcw className="h-4 w-4" />
          Clear Filters
        </button>
      </div>

      {/* Date Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <div className="relative flex-1">
          <Calendar className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Reservations List */}
      <div className="space-y-4">
        {currentReservations.map((reservation) => (
          <div
            key={reservation.reservation_id}
            className="p-6 rounded-xl bg-white border border-gray-100 hover:border-blue-100 shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  {nannyNames[reservation.nanny_id] || "Loading..."}
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Client:</span>{" "}
                    {reservation.serviceRequest.client.first_name}{" "}
                    {reservation.serviceRequest.client.last_name}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Start Date:</span>{" "}
                    {new Date(reservation.booking_date).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">End Date:</span>{" "}
                    {reservation.serviceRequest.end_date}
                  </p>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">Notes:</span>{" "}
                    {reservation.serviceRequest.notes}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-3">
                <p className="text-lg font-semibold text-blue-600 flex items-center justify-end gap-2">
                  <DollarSign className="h-5 w-5" />
                  {reservation.value}
                </p>
                {activeTab === "confirmed" ? (
                  <button
                    onClick={() => handlePayment(reservation.reservation_id)}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    Process Payment
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-medium text-green-700 bg-green-100">
                    <CheckCircle className="h-4 w-4" />
                    Paid
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>
        <span className="text-sm font-medium text-gray-600">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ReservationList;
