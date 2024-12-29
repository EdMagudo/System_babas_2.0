import React, { useState } from 'react';
import { Bell, UserCog } from 'lucide-react';
import ChangeCredentials from './ChangeCredentials'; // Importando o componente de troca de credenciais

const Header = () => {
  const [isChangingCredentials, setIsChangingCredentials] = useState(false);

  const toggleChangeCredentials = () => {
    setIsChangingCredentials(!isChangingCredentials);
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Painel de Controle</h1>
        <p className="text-gray-500">Bem-vindo ao sistema de gerenciamento</p>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleChangeCredentials}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
        >
          <UserCog className="h-4 w-4" />
          Admin
        </button>
      </div>

      {/* Condicional para mostrar o componente de troca de credenciais */}
      {isChangingCredentials && <ChangeCredentials />}
    </header>
  );
};

export default Header;
