import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear(); // Limpa os dados do usuário
    navigate('/sign-in'); // Redireciona para a página de login
  }, [navigate]);

  return null; // O componente não precisa renderizar nada visível
};

export default Logout;
