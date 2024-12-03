import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Importando Link para navegação

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navigationItems = [
    { name: 'Home', path: '/' },
    { name: 'Join as Nanny', path: '/register-nannys' },
    { name: 'Join as Client', path: '/register-client' },
    { name: 'Find a Nanny', path: '/search' },
    { name: 'Contact Us', path: '/contact-us' },
    { name: 'Sign in', path: '/sign-in' },
  ];

  return (
    <header className="bg-gradient-to-r from-purple-50 to-pink-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              to="/" 
              className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Express Nannies
            </Link>
          </div>
          
          <nav className="hidden md:block">
            <ul className="flex space-x-8">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className="text-gray-600 hover:text-purple-600 transition-colors duration-200 ease-in-out px-3 py-2 text-sm font-medium rounded-md hover:bg-purple-50"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-purple-600 hover:bg-purple-50 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200 ease-in-out"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
