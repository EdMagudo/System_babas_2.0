import React from 'react';
import { Users, Activity, UserCheck, Wallet, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const stats = {
    totalBabas: 24,
    totalClientes: 45,
    reservasAtivas: 12,
    rendimentoMensal: 'R$ 4.800,00',
    crescimentoMensal: '+15%',
    satisfacaoClientes: '98%',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-blue-600 font-medium">Total de Babás</p>
            <p className="text-3xl font-bold text-blue-700">{stats.totalBabas}</p>
          </div>
          <div className="bg-blue-200 p-3 rounded-full">
            <Users className="h-6 w-6 text-blue-700" />
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm text-blue-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          {stats.crescimentoMensal} este mês
        </div>
      </div>
      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-green-600 font-medium">Total de Clientes</p>
            <p className="text-3xl font-bold text-green-700">{stats.totalClientes}</p>
          </div>
          <div className="bg-green-200 p-3 rounded-full">
            <UserCheck className="h-6 w-6 text-green-700" />
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm text-green-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          {stats.crescimentoMensal} este mês
        </div>
      </div>
      <div className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-yellow-600 font-medium">Reservas Ativas</p>
            <p className="text-3xl font-bold text-yellow-700">{stats.reservasAtivas}</p>
          </div>
          <div className="bg-yellow-200 p-3 rounded-full">
            <Activity className="h-6 w-6 text-yellow-700" />
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm text-yellow-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          {stats.crescimentoMensal} este mês
        </div>
      </div>
      <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-600 font-medium">Rendimento Mensal</p>
            <p className="text-3xl font-bold text-purple-700">{stats.rendimentoMensal}</p>
          </div>
          <div className="bg-purple-200 p-3 rounded-full">
            <Wallet className="h-6 w-6 text-purple-700" />
          </div>
        </div>
        <div className="flex items-center mt-4 text-sm text-purple-600">
          <TrendingUp className="h-4 w-4 mr-1" />
          {stats.crescimentoMensal} este mês
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
