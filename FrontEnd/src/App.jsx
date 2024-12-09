import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Logout from './components/Logout';
import HomePage from './Pages/HomePage';
import ClientForm from './components/ClientForm';
import NannyForm from './components/NannyForm';
import ContactUs from './components/contactUs';
import FindNanny from './components/FindNanny';
import LoginPage from './Pages/loginPage';
import ClientDashboard from './Pages/ClientDashBoard'; // Importar o Dashboard do cliente
import NannyDashboard from './Pages/NannyDashboard'; // Importar o Dashboard da babá

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register-client" element={<ClientForm />} />
            <Route path="/register-nanny" element={<NannyForm />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/search" element={<FindNanny />} />
            <Route path="/sign-in" element={<LoginPage />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/nanny-dashboard" element={<NannyDashboard />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
