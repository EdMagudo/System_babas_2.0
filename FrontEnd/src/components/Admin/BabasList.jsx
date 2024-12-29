import React, { useEffect, useState } from "react";
import { Search, UserCheck, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import axios from "axios";

// Componente para listar as Babás
const BabasList = ({ babas, alterarStatus, searchTerm }) => {
  return (
    <div className="grid gap-6">
      {babas
        .filter((baba) => baba.first_name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((baba) => (
          <div key={baba.user_id} className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <UserCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{baba.first_name} {baba.last_name}</h3>
                    <p className="text-sm text-gray-500">Location: {baba.province_name}, {baba.country_name}</p>
                    <p className="text-sm text-gray-500">E-mail: {baba.email}</p>
                    <p className="text-sm text-gray-500">Id Number: {baba.id_number}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  baba.background_check_status === "approved"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  <div className="flex items-center gap-1">
                    {baba.background_check_status === "approved" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {baba.background_check_status}
                  </div>
                </span>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => alterarStatus(baba.user_id, "approved")} className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600">Aprovar</button>
                  <button onClick={() => alterarStatus(baba.user_id, "pending")} className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600">Pendente</button>
                  <button onClick={() => alterarStatus(baba.user_id, "rejected")} className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">Rejeitar</button>
                </div>

                {/* Exibindo os arquivos */}
                {baba.files && baba.files.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {baba.files.map((file, index) => (
                      <a
                        key={index}
                        href={`http://localhost:3005/${file.file_path.replace(/\\/g, "/").split("/").map(encodeURIComponent).join("/")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-gray-300 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                      >
                        <FileText className="h-4 w-4" />
                        {file.file_name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

// Componente para listar os Clientes
const ClientesList = ({ clientes, alterarStatus, searchTerm }) => {
  return (
    <div className="grid gap-6">
      {clientes
        .filter((cliente) => cliente.first_name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((cliente) => (
          <div key={cliente.user_id} className="p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all">
            <div className="flex justify-between items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <UserCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{cliente.first_name} {cliente.last_name}</h3>
                    <p className="text-sm text-gray-500">Location: {cliente.province_name}, {cliente.country_name}</p>
                    <p className="text-sm text-gray-500">E-mail: {cliente.email}</p>
                    <p className="text-sm text-gray-500">Id Number: {cliente.id_number}</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  cliente.background_check_status === "approved"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-700"
                }`}>
                  <div className="flex items-center gap-1">
                    {cliente.background_check_status === "approved" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {cliente.background_check_status}
                  </div>
                </span>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => alterarStatus(cliente.user_id, "approved")} className="px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600">Aprovar</button>
                  <button onClick={() => alterarStatus(cliente.user_id, "pending")} className="px-3 py-1 text-sm bg-gray-500 text-white rounded-md hover:bg-gray-600">Pendente</button>
                  <button onClick={() => alterarStatus(cliente.user_id, "rejected")} className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600">Rejeitar</button>
                </div>

                {/* Exibindo os arquivos */}
                {cliente.files && cliente.files.length > 0 && (
                  <div className="mt-2 flex gap-2">
                    {cliente.files.map((file, index) => (
                      <a
                        key={index}
                        href={`http://localhost:3005/${file.file_path.replace(/\\/g, "/").split("/").map(encodeURIComponent).join("/")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-gray-300 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                      >
                        <FileText className="h-4 w-4" />
                        {file.file_name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

// Componente Principal
const MainComponent = () => {
  const [activeTab, setActiveTab] = useState("babas");
  const [babas, setBabas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3005/user") // Modifique o URL de acordo com a sua API
      .then((response) => {
        const data = response.data;
        setBabas(data.filter((user) => user.role === "nanny"));
        setClientes(data.filter((user) => user.role === "client"));
      })
      .catch((error) => console.error(error));
  }, []);

  const alterarStatus = (id, novoStatus) => {
    // Atualizando o estado local
    setBabas((prev) =>
      prev.map((baba) =>
        baba.user_id === id
          ? { ...baba, background_check_status: novoStatus }
          : baba
      )
    );
    setClientes((prev) =>
      prev.map((cliente) =>
        cliente.user_id === id
          ? { ...cliente, background_check_status: novoStatus }
          : cliente
      )
    );

    // Enviando a requisição para o backend
    axios
      .post("http://localhost:3005/user/changeStatus", {
        user_id: id,
        status: novoStatus,
      })
      .then((response) => {
        console.log("Status atualizado com sucesso:", response.data);
      })
      .catch((error) => {
        console.error("Erro ao atualizar o status:", error);
      });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("babas")}
            className={`px-4 py-2 rounded-md ${activeTab === "babas" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Babás
          </button>
          <button
            onClick={() => setActiveTab("clientes")}
            className={`px-4 py-2 rounded-md ${activeTab === "clientes" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
          >
            Clientes
          </button>
        </div>
      </div>

      {activeTab === "babas" && (
        <BabasList babas={babas} alterarStatus={alterarStatus} searchTerm={searchTerm} />
      )}
      {activeTab === "clientes" && (
        <ClientesList clientes={clientes} alterarStatus={alterarStatus} searchTerm={searchTerm} />
      )}
    </div>
  );
};

export default MainComponent;
