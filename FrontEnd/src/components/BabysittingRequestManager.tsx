import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapPin, Users, Check, X, AlertCircle, Mail } from "lucide-react";

// Interface for babysitting service requests
interface BabysittingRequest {
  id: number;
  startDate: string;
  endDate: string;
  numberOfPeople: number;
  address: string;
  email: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
}

const BabysittingRequestManager: React.FC = () => {
  const [requests, setRequests] = useState<BabysittingRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"new" | "approved">("new");

  useEffect(() => {
    fetchRequests(); // Chama a função ao montar o componente
  }, []);

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
      // Transforma os dados recebidos no formato esperado pelo componente
      const data = response.data.map((req: any) => ({
        id: req.request_id,
        startDate: req.start_date,
        endDate: req.end_date,
        numberOfPeople: req.number_of_people || req.num_children,
        address: req.address,
        email: req.email,
        notes: req.special_requests || req.notes,
        status: req.status,
      }));
      setRequests(data);
    } catch (error) {
      console.error("Erro ao buscar as solicitações:", error);
    }
  };

  const handleApprove = async (id: number) => {
    const confirmReject = window.confirm(
      "Are you sure you want to approved this request?"
    );
    if (!confirmReject) {
      return; // Cancela a rejeição se o usuário clicar em "Cancelar"
    }

    try {
      await axios.put(`http://localhost:3005/requestServices/approvedRequest/${id}`);
      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, status: "approved" } : req
        )
      );
    } catch (error) {
      console.error("Erro ao a  provar solicitação:", error);
    }
  };

  const handleReject = async (id: number) => {
    const confirmReject = window.confirm(
      "Are you sure you want to reject this request?"
    );
    if (!confirmReject) {
      return; // Cancela a rejeição se o usuário clicar em "Cancelar"
    }

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

  const filteredRequests =
    activeTab === "new"
      ? requests.filter((req) => req.status === "pending")
      : requests.filter((req) => req.status === "approved");

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Babysitting Service Requests
      </h1>

      {/* Tabs */}
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

      {/* Content */}
      {filteredRequests.length === 0 ? (
        <div className="text-center text-gray-500">
          {activeTab === "new" ? "No new requests" : "No approved requests"}
        </div>
      ) : (
        filteredRequests.map((request) => (
          <div
            key={request.id}
            className="border border-gray-300 rounded-lg p-4 mb-4 shadow-md bg-white"
          >
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              Request for {request.startDate}
            </h2>
            <div className="mb-4 space-y-2">
              <p className="flex items-center gap-2">
                <strong className="font-medium">Date:</strong>{" "}
                {request.startDate}{" "}
                {request.startDate !== request.endDate &&
                  ` - ${request.endDate}`}
              </p>
              <p className="flex items-center gap-2">
                <Users className="w-5 h-5 text-pink-500" />
                <strong className="font-medium">Number of People:</strong>{" "}
                {request.numberOfPeople}
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-500" />
                <strong className="font-medium">Address:</strong>{" "}
                {request.address}
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
            <div
              className={`p-2 rounded-md mb-4 text-sm font-medium flex items-center gap-2 ${
                request.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {request.status === "pending" ? (
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              ) : (
                <Check className="w-5 h-5 text-green-500" />
              )}
              Status: {request.status === "pending" ? "Pending" : "Approved"}
            </div>
            {activeTab === "new" && (
              <div className="flex justify-between">
                <button
                  onClick={() => handleReject(request.id)}
                  className="px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 font-medium flex items-center gap-2"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
                <button
                  onClick={() => handleApprove(request.id)}
                  className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 font-medium flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default BabysittingRequestManager;
