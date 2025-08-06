import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import NavDesktop from './NavDesktop';
import NavMobile from './NavMobile';

export default function Nav() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/user', { 
          credentials: 'include' 
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        
        if (data && data.steamid) {
          setUser({
            steamid: data.steamid,
            personaname: data.personaname || 'Гравець',
            avatar: data.avatarfull || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb.jpg',
            isAdmin: data.isAdmin || false
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      }
    };

    fetchUserData();
  }, [location]); // Додаємо location в залежності для оновлення при зміні маршруту

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/logout', { 
        method: 'POST',
        credentials: 'include' 
      });
      setUser(null);
      setMobileMenuOpen(false);
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const scrollToTop = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-black bg-opacity-90 border-b border-red-900 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={scrollToTop}
            className="flex items-center bg-transparent p-0 border-0 focus:outline-none"
            aria-label="На головну"
          >
            <img src="/logo.png" alt="Ninja Project Logo" className="w-12 h-12" />
            <span className="text-white font-bold text-xl ml-3">NINJA PROJECT</span>
          </button>
        </div>

        <NavMobile 
          user={user} 
          onLogout={handleLogout} 
          isOpen={mobileMenuOpen} 
          onToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
        />
        <NavDesktop 
          user={user} 
          onLogout={handleLogout} 
        />
      </div>
    </header>
  );
}