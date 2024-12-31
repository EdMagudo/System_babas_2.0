import React, { useEffect, useState } from "react";
import { Search, UserCheck, CheckCircle2, AlertCircle, FileText } from "lucide-react";

const UserCard = ({ user, alterarStatus }) => {
  const statusColors = {
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    rejected: "bg-rose-50 text-rose-700 border-rose-200"
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:border-gray-200 transition-all duration-200 p-6">
      <div className="flex justify-between gap-4">
        <div className="flex gap-4">
          <div className="bg-indigo-50 rounded-lg p-3 h-fit">
            <UserCheck className="h-5 w-5 text-indigo-600" />
          </div>
          <div className="space-y-1">
            <h3 className="font-medium text-gray-900">
              {user.first_name} {user.last_name}
            </h3>
            <div className="space-y-1 text-sm text-gray-500">
              <p className="flex items-center gap-1">
                📍 {user.province_name}, {user.country_name}
              </p>
              <p className="flex items-center gap-1">
                ✉️ {user.email}
              </p>
              <p className="flex items-center gap-1">
                🆔 {user.id_number}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3">
          <span className={`px-3 py-1.5 text-xs font-medium rounded-full border ${statusColors[user.background_check_status] || statusColors.pending}`}>
            <div className="flex items-center gap-1.5">
              {user.background_check_status === "approved" ? 
                <CheckCircle2 className="h-3.5 w-3.5" /> : 
                <AlertCircle className="h-3.5 w-3.5" />
              }
              {user.background_check_status}
            </div>
          </span>

          <div className="flex gap-2">
            <button 
              onClick={() => alterarStatus(user.user_id, "approved")}
              className="px-3 py-1.5 text-xs font-medium bg-emerald-50 text-emerald-600 rounded-full hover:bg-emerald-100 transition-colors"
            >
              Approve
            </button>
            <button 
              onClick={() => alterarStatus(user.user_id, "pending")}
              className="px-3 py-1.5 text-xs font-medium bg-amber-50 text-amber-600 rounded-full hover:bg-amber-100 transition-colors"
            >
              Pending
            </button>
            <button 
              onClick={() => alterarStatus(user.user_id, "rejected")}
              className="px-3 py-1.5 text-xs font-medium bg-rose-50 text-rose-600 rounded-full hover:bg-rose-100 transition-colors"
            >
              Reject
            </button>
          </div>

          {user.files && user.files.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {user.files.map((file, index) => (
                <a
                  key={index}
                  href={`http://localhost:3005/${file.file_path.replace(/\\/g, "/").split("/").map(encodeURIComponent).join("/")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5" />
                  {file.file_name}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const UserList = ({ users, alterarStatus, searchTerm }) => {
  const filteredUsers = users.filter(user => 
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {filteredUsers.map(user => (
        <UserCard key={user.user_id} user={user} alterarStatus={alterarStatus} />
      ))}
    </div>
  );
};

const MainComponent = () => {
  const [activeTab, setActiveTab] = useState("babas");
  const [babas, setBabas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:3005/user")
      .then(response => response.json())
      .then(data => {
        setBabas(data.filter((user) => user.role === "nanny"));
        setClientes(data.filter((user) => user.role === "client"));
      })
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  const alterarStatus = (id, novoStatus) => {
    // Update local state first for immediate feedback
    setBabas(prev =>
      prev.map(baba =>
        baba.user_id === id ? { ...baba, background_check_status: novoStatus } : baba
      )
    );
    setClientes(prev =>
      prev.map(cliente =>
        cliente.user_id === id ? { ...cliente, background_check_status: novoStatus } : cliente
      )
    );

    // Send update to server
    fetch("http://localhost:3005/user/changeStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: id,
        status: novoStatus,
      }),
    })
    .catch(error => {
      console.error("Error updating status:", error);
      // You might want to add error handling here to revert the optimistic update
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
            <div className="relative w-full sm:w-auto">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
                className="w-full sm:w-80 pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setActiveTab("babas")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "babas"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Nannies
              </button>
              <button
                onClick={() => setActiveTab("clientes")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === "clientes"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Clients
              </button>
            </div>
          </div>

          {activeTab === "babas" && (
            <UserList users={babas} alterarStatus={alterarStatus} searchTerm={searchTerm} />
          )}
          {activeTab === "clientes" && (
            <UserList users={clientes} alterarStatus={alterarStatus} searchTerm={searchTerm} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MainComponent;