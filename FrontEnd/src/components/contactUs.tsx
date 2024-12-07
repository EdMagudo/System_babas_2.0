import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle } from 'lucide-react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const location = {
    lat: -25.9659,  // Latitude da localização (exemplo de Maputo)
    lng: 32.5892,  // Longitude da localização (exemplo de Maputo)
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Limpar mensagens anteriores
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:3005/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Email enviado com sucesso!');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMessage('Erro ao enviar o email: ' + data.error);
      }
    } catch (error) {
      console.error('Erro ao enviar o email:', error);
      setErrorMessage('Erro ao enviar o email!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-rose-500">
            Contact Us
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions about our nanny services in Mozambique? We're here to help you find the perfect childcare solution.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Get in Touch</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <Phone className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Phone</h3>
                  <p className="text-gray-600">+258 84 123 4567</p>
                  <p className="text-gray-600">+258 86 987 6543</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">info@expressnannies.co.mz</p>
                  <p className="text-gray-600">support@expressnannies.co.mz</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Office Location</h3>
                  <p className="text-gray-600">Av. Julius Nyerere, 257</p>
                  <p className="text-gray-600">Maputo, Mozambique</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="w-6 h-6 text-indigo-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Business Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                  <p className="text-gray-600">Saturday: 9:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Send Us a Message</h2>

            {/* Exibir mensagem de sucesso ou erro */}
            {successMessage && (
              <div className="text-green-600 mb-4">
                <p>{successMessage}</p>
              </div>
            )}
            {errorMessage && (
              <div className="text-red-600 mb-4">
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 px-6 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Our Location</h2>
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              {/* Carregar o Google Maps */}
              <LoadScript googleMapsApiKey="AIzaSyC-iWtYM5-YSJR-9WBwAUUttdhWvHp1XR-s"> 
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={location}
                  zoom={14}
                >
                  <Marker position={location} />
                </GoogleMap>
              </LoadScript>
            </div>
          </div>
        </div>
    </div>
  );
};

export default ContactPage;
