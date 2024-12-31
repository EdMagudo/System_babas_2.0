import React, { useState } from 'react';
import Sidebar from '../components/Admin/Sidebar';
import Header from '../components/Admin/Header';
import Dashboard from '../components/Admin/Dashboard';
import BabasList from '../components/Admin/BabasList';
import ReservasList from '../components/Admin/ReservasList';
import PaymentList from '../components/Admin/PaymentsList';

const AdminDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar selectedTab={selectedTab} onSelectTab={setSelectedTab} />

      <main className="ml-16 p-8">
        <Header />

        {selectedTab === 'dashboard' && <Dashboard />}
        {selectedTab === 'babas' && <BabasList />}
        {selectedTab === 'reservas' && <ReservasList />}
        {selectedTab === 'pagamentos' && <PaymentList />}
      </main>
    </div>
  );
};

export default AdminDashboard;