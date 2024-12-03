import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Importando Router e rotas
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './Pages/HomePage';
import ClientForm from './components/ClientForm'; 
import NannyForm from './components/NannyForm';
import ContactUs from './components/contactUs';
import FindNanny from './components/FindNanny';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow ">
          <Routes>
           
            <Route path="/" element={<HomePage />} />

            <Route path="/register-client" element={<ClientForm />} />
            <Route path="/register-nanny" element={<NannyForm />} />
            <Route path="/contact-us" element={<ContactUs />} />     
            <Route path="/search" element={<FindNanny />} />


            <Route path="*" element={<h1>404 - Page Not Found</h1>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
