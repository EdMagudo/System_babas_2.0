import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, FileText, Mail, DollarSign, Tag } from 'lucide-react';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [message, setMessage] = useState({ text: '', type: '' });

  const fetchReservations = async () => {
    const clientId = localStorage.getItem('idUser');
    if (!clientId) {
      console.error('Client ID not found in localStorage');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3005/reservations/getAll/reservations/1`
      );
      setReservations(response.data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
      setMessage({ text: 'Error fetching reservations', type: 'error' });
    }
  };

  const handleCancel = async (reservation_id) => {
    const confirmCancel = window.confirm('Are you sure you want to cancel this reservation?');
    if (!confirmCancel) return;

    try {
      const response = await axios.delete(
        `http://localhost:3005/reservations/${reservation_id}`
      );
      if (response.status === 204) {
        setMessage({ text: 'Reservation cancelled successfully!', type: 'success' });
        setReservations(reservations.filter(res => res.reservation_id !== reservation_id));
      } else {
        setMessage({ text: 'Error cancelling the reservation', type: 'error' });
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      setMessage({ text: 'Error cancelling the reservation', type: 'error' });
    }
  };

  const handlePayment = async (reservation_id) => {
    try {
      alert(`Payment initiated for reservation ID: ${reservation_id}`);
      const response = await axios.post(
        `http://localhost:3005/reservations/payment/${reservation_id}`
      );
      if (response.status === 200) {
        setMessage({ text: 'Payment successful!', type: 'success' });
        fetchReservations();
      } else {
        setMessage({ text: 'Payment failed. Try again.', type: 'error' });
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      setMessage({ text: 'Payment failed. Try again.', type: 'error' });
    }
  };

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    fetchReservations();
  }, []);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reservations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reservations.length / itemsPerPage);

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-indigo-800">Client Reservations</h2>
      </div>

      {message.text && (
        <div
          className={`p-4 my-4 text-center text-white font-semibold ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {message.text}
        </div>
      )}

      <div className="p-6 space-y-6">
        {currentItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No reservations available</div>
        ) : (
          currentItems.map((reservation) => (
            <div
              key={reservation.reservation_id}
              className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-indigo-800">
                  <Mail size={20} />
                  <span className="font-medium">{reservation.serviceRequest.client.email}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar size={18} />
                    <span>Start: {new Date(reservation.serviceRequest.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={18} />
                    <span>End: {new Date(reservation.serviceRequest.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign size={18} />
                    <span>{reservation.value}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={18} />
                    <span>Status: {reservation.status}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <FileText size={18} />
                  <p>{reservation.serviceRequest.notes}</p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  {reservation.status !== 'cancelled' && (
                    <button
                      onClick={() => handleCancel(reservation.reservation_id)}
                      className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors duration-200"
                    >
                      Cancel Reservation
                    </button>
                  )}
                  {reservation.status === 'confirmed' && (
                    <button
                      onClick={() => handlePayment(reservation.reservation_id)}
                      className="px-4 py-2 text-sm font-medium text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors duration-200"
                    >
                      Pay Now
                    </button>
                  )}
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

export default Reservations;
