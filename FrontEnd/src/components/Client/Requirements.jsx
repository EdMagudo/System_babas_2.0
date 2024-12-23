import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, User, MapPin, Users, Clock, FileText } from 'lucide-react';

const Favorites = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [message, setMessage] = useState({ text: '', type: '' }); // Novo estado para mensagens

  const fetchRequests = async () => {
    const idUser = localStorage.getItem('idUser');
    if (!idUser) {
      console.error('ID do usuário não encontrado no localStorage');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3005/requestServices/allRequestCliente/${idUser}`
      );
      setRequests(response.data);
    } catch (error) {
      console.error('Erro ao buscar as solicitações:', error);
      setMessage({ text: 'Erro ao buscar as solicitações', type: 'error' });
    }
  };

  const handleDelete = async (request_id) => {
    // Ask the user if they are sure they want to delete
    const confirmDelete = window.confirm('Are you sure you want to delete this request?');
    
    if (!confirmDelete) {
      return; // If the user cancels, do nothing
    }
  
    try {
      const response = await axios.delete(
        `http://localhost:3005/requestServices/${request_id}`
      );
      if (response.status === 204) {
        setMessage({ text: 'Request deleted successfully!', type: 'success' });
        // Update the requests list by removing the deleted request
        setRequests(requests.filter(request => request.request_id !== request_id));
      } else {
        setMessage({ text: 'Error deleting the request', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting the request:', error);
      setMessage({ text: 'Error deleting the request', type: 'error' });
    }
  };

  // Clear the message after 3 seconds
  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000); // 3000ms = 3 seconds

      // Clean up the timer when the component unmounts or when the message changes
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = requests.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(requests.length / itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-indigo-800">Client Requests</h2>
      </div>

      {/* Exibição da mensagem */}
      {message.text && (
        <div
          className={`p-4 my-4 text-center text-white font-semibold ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {message.text}
        </div>
      )}

      <div className="p-6 space-y-6">
        {currentItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No requests available</div>
        ) : (
          currentItems.map((request) => (
            <div
              key={request.request_id}
              className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-indigo-800">
                  <User size={20} />
                  <span className="font-medium">{request.email}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{request.address} </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    <span>{request.number_of_people} people</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>{new Date(request.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>{new Date(request.end_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <FileText size={18} />
                  <p>{request.notes}</p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => handleDelete(request.request_id)}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                  >
                    Cancel Request
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        <div className="flex justify-between items-center pt-6">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Favorites;
