import { useEffect } from 'react';

const Logout = () => {
  useEffect(() => {
    // Verifica se o logout já foi processado
    if (!localStorage.getItem('logoutProcessed')) {
      localStorage.clear(); // Limpa os dados do usuário
      localStorage.setItem('logoutProcessed', 'true'); // Marca o logout como processado
      window.location.reload(); // Faz o reload da página
    } else {
      localStorage.removeItem('logoutProcessed'); // Remove a marca para futuros logouts
      window.location.href = '/sign-in'; // Redireciona para a página de login
    }
  }, []);

  return null; // O componente não precisa renderizar nada visível
};

export default Logout;
