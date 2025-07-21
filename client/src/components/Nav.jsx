import React, { useState, useEffect } from 'react';
import NavDesktop from './NavDesktop';
import NavMobile from './NavMobile';

export default function Nav() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('https://ninjaproject.com.ua/api/user', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.steamid) {
          setUser(data);
        } else {
          setUser(null);
        }
      });
  }, []);

  const handleLogout = () => {
    fetch('https://ninjaproject.com.ua/logout', { credentials: 'include' }).then(() => {
      setUser(null);
      setMobileMenuOpen(false);
    });
  };

  const toggleMobileMenu = () => setMobileMenuOpen(open => !open);

  return (
    <header className="bg-black bg-opacity-90 border-b border-red-900 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#home" className="flex items-center">
            <img src="./logo.png" alt="Ninja Project Logo" className="w-12 h-12" />
            <span className="text-white font-bold text-xl ml-3">NINJA PROJECT</span>
          </a>
        </div>

        <NavMobile user={user} onLogout={handleLogout} isOpen={mobileMenuOpen} onToggle={toggleMobileMenu} />
        <NavDesktop user={user} onLogout={handleLogout} />
      </div>
    </header>
  );
}
