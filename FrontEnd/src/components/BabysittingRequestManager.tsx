import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MapPin,
  Users,
  Check,
  X,
  AlertCircle,
  Mail,
  DollarSign,
} from "lucide-react";

interface BabysittingRequest {
  id: number;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  address: string;
  email: string;
  notes?: string;
  value?: number;
  status: "pending" | "approved" | "rejected";
}

const BabysittingRequestManager: React.FC = () => {
  const [requests, setRequests] = useState<BabysittingRequest[]>([]);
  const [reservations, setReservations] = useState<BabysittingRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"new" | "approved">("new");
  const [editingRequest, setEditingRequest] = useState<number | null>(null);
  const [value, setValue] = useState<string>("");
  const [startDateFilter, setStartDateFilter] = useState<string>("");
  const [endDateFilter, setEndDateFilter] = useState<string>("");

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchReservations = async () => {
    const idUser = localStorage.getItem("idUser");
    if (!idUser) {
      console.error("ID do usuário não encontrado no localStorage");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3005/reservations/getAll/reservations/${idUser}`
      );
      setReservations(response.data);
    } catch (error) {
      console.error("Erro ao buscar as reservas:", error);
    }
  };

  const fetchRequests = async () => {
    const idUser = localStorage.getItem("idUser");
    if (!idUser) {
      console.error("ID do usuário não encontrado no localStorage");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3005/requestServices/allRequest/${idUser}`
      );
      const data = response.data.map((req: any) => ({
        id: req.request_id,
        startDate: req.start_date,
        endDate: req.end_date,
        numberOfPeople: req.number_of_people || req.num_children,
        address: req.address,
        email: req.email,
        notes: req.special_requests || req.notes,
        value: req.value || null,
        status: req.status,
      }));
      setRequests(data);
    } catch (error) {
      console.error("Erro ao buscar as solicitações:", error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0'); // Adiciona zero à esquerda
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleFilter = () => {
    // Converte as datas de filtro para o formato dd-MM-YYYY
    const startDate = formatDate(startDateFilter);
    const endDate = formatDate(endDateFilter);
    

    console.log('Start Date:', startDate);
    console.log('End Date:', endDate);

    // Filtrando as reservas com base na data de reserva
    const filtered = reservations.filter((reservation) => {
      const bookingDate = formatDate(reservation.booking_date); // Converte para formato dd-MM-YYYY

      console.log(bookingDate)

      console.log(bookingDate >= startDate && bookingDate <= endDate)
      // Verifica se a data de reserva está entre as datas de início e fim
      return bookingDate >= startDate && bookingDate <= endDate;
    });

    // Atualiza o estado das reservas filtradas
    setReservations(filtered);
  };

  const handleApproveClick = (id: number) => {
    setEditingRequest(id);
    setValue("");
  };

  const handleFinalize = async (id: number) => {
    if (!value || isNaN(Number(value))) {
      alert("Please enter a valid service value.");
      return;
    }

    const confirmApprove = window.confirm(
      "Are you sure you want to approve this request?"
    );
    if (!confirmApprove) return;

    try {
      await axios.put(
        `http://localhost:3005/requestServices/approvedRequest/${id}`,
        { value: Number(value) }
      );
      setRequests(
        requests.map((req) =>
          req.id === id
            ? { ...req, status: "approved", value: Number(value) }
            : req
        )
      );
      setEditingRequest(null);
      setValue("");
    } catch (error) {
      console.error("Erro ao finalizar aprovação:", error);
    }
  };

  const handleReject = async (id: number) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this request?"
    );
    if (!confirmReject) return;

    try {
      await axios.put(
        `http://localhost:3005/requestServices/rejectRequest/${id}`
      );
      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, status: "rejected" } : req
        )
      );
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error);
    }
  };

  const handleCancelReservation = async (reservationId: number) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this reservation?"
    );
    if (!confirmCancel) return;

    try {
      await axios.put(
        `http://localhost:3005/reservations/cancel/reservation/${reservationId}`
      );
      setReservations(
        reservations.filter(
          (reservation) => reservation.reservation_id !== reservationId
        )
      );
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
    }
  };

  const filteredRequests =
    activeTab === "new"
      ? requests.filter((req) => req.status === "pending")
      : []; // Exibe apenas as solicitações com status "pending" para a aba "new"

  const filteredReservations =
    activeTab === "approved"
      ? reservations.filter((reservation) => reservation.status != "")
      : []; // Exibe apenas as reservas com status "confirmed" para a aba "approved"


  const filteredReserv= reservations.filter((reservation) => {
        const bookingDate = new Date(reservation.booking_date); // Usando booking_date em vez de startDate
        const startDate = startDateFilter ? new Date(startDateFilter) : null;
        const endDate = endDateFilter ? new Date(endDateFilter) : null;
      
        // Verifica se está dentro do intervalo de datas
        return (
          (!startDate || bookingDate >= startDate) &&
          (!endDate || bookingDate <= endDate)
        );
      });
      


  const getStatusBackground = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-300 text-yellow-800";
      case "approved":
        return "bg-green-300 text-green-800";
      case "rejected":
        return "bg-red-300 text-red-800";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Babysitting Service Requests
      </h1>

      <div className="flex justify-center mb-6 space-x-4">
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "new"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("new")}
        >
          New Requests
        </button>
        <button
          className={`px-4 py-2 rounded-md font-medium ${
            activeTab === "approved"
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveTab("approved")}
        >
          Approved Requests
        </button>
      </div>

      {/* Filtro de Data (somente para reservas) */}
      {activeTab === "approved" && (
        <div className="flex gap-4 mb-6">
        <div className="flex items-center">
          <label htmlFor="startDateFilter" className="mr-2">
            Start Date:
          </label>
          <input
            type="date"
            id="startDateFilter"
            className="border border-gray-300 rounded-md p-2"
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="endDateFilter" className="mr-2">
            End Date:
          </label>
          <input
            type="date"
            id="endDateFilter"
            className="border border-gray-300 rounded-md p-2"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
          />
        </div>
      
        <div className="flex items-center">
          <button
             onClick={handleFilter}
            className="bg-blue-500 text-white rounded-md px-6 py-2 font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Filter
          </button>
        </div>
      </div>
      
      )}

      {activeTab === "new" && filteredRequests.length === 0 ? (
        <div className="text-center text-gray-500">No new requests</div>
      ) : (
        filteredRequests.map((request) => (
          <div
          key={request.id}
          className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md bg-white"
        >
          <h2 className="text-lg font-semibold mb-3">
            Request for {request.startDate}
          </h2>
          <div className="mb-4 space-y-2">
            <p className="flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-500" />
              <strong className="font-medium">Number of People:</strong>{" "}
              {request.numberOfPeople}
            </p>
            <p className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              <strong className="font-medium">Address:</strong> {request.address}
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <strong className="font-medium">Email:</strong> {request.email}
            </p>
            <p className="flex items-center gap-2 text-gray-700 mt-2">
              <strong className="font-medium text-blue-600">Note:</strong>
              <span className="text-sm text-gray-600 italic">{request.notes}</span>
            </p>
          </div>
          <div className="mt-4">
            {editingRequest === request.id ? (
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    placeholder="Enter service value"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="border border-gray-300 rounded-md p-2 flex-1"
                  />
                  <button
                    onClick={() => handleFinalize(request.id)}
                    className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 font-medium"
                  >
                    Finalize
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleApproveClick(request.id)}
                  className="px-4 py-2 rounded-md text-white bg-blue-500 hover:bg-blue-600 font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 font-medium"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
        

        ))
      )}

      {activeTab === "approved" && filteredReservations.length === 0 ? (
        <div className="text-center text-gray-500">
          No approved reservations
        </div>
      ) : (
        filteredReservations.map((reservation) => (
          <div
            key={reservation.reservation_id}
            className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md bg-white"
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              Reservation for {reservation.serviceRequest.client.first_name}{" "}
              {reservation.serviceRequest.client.last_name}
            </h2>
            <div className="mb-4 space-y-2">
              <p className="flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                <strong className="font-medium">Number of People:</strong>{" "}
                {reservation.serviceRequest.number_of_people}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" />
                <strong className="font-medium">Address:</strong>{" "}
                {reservation.serviceRequest.address}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                <strong className="font-medium">Email:</strong>{" "}
                {reservation.serviceRequest.client.email}
              </p>
              <p className="flex items-center gap-2 text-gray-700 mt-2">
                <strong className="font-medium text-blue-600">Note:</strong>
                <span className="text-sm text-gray-600 italic">
                  {reservation.serviceRequest.notes}
                </span>
              </p>
              {reservation.status === "confirmed" && (
                <p className="flex items-center gap-2 text-green-700 mt-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <strong className="font-medium">Service Value:</strong> $
                  {parseFloat(reservation.value).toFixed(2)}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div
                className={`px-4 py-2 rounded-md ${getStatusBackground(
                  reservation.status
                )}`}
              >
                Reservation Status:{" "}
                {reservation.status.charAt(0).toUpperCase() +
                  reservation.status.slice(1)}
              </div>
              {reservation.status !== "cancelled" &&
                reservation.status !== "completed" && (
                  <button
                    onClick={() =>
                      handleCancelReservation(reservation.reservation_id)
                    }
                    className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 font-medium flex items-center gap-2"
                  >
                    <X className="w-4 h-4" /> Cancel
                  </button>
                )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default BabysittingRequestManager;
