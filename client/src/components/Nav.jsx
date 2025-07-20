import React, { useState, useEffect } from 'react';

export default function Nav() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('https://ninjaproject.com.ua/api/user', { credentials: 'include' })
      .then(res => res.json())
      .then(data => {
        if (data.steamid) {
          setUser(data);
        } else {
          setUser(null);
        }
      })
      .catch(() => setUser(null));
  }, []);

  const handleLogout = () => {
    fetch('https://ninjaproject.com.ua/logout', { 
      method: 'POST',
      credentials: 'include'
    }).then(() => {
      setUser(null);
    });
  };

  return (
    <header className="bg-black bg-opacity-90 border-b border-red-900 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <a href="#home" className="flex items-center">
            <img src="./logo.png" alt="Ninja Project Logo" className="w-12 h-12" />
            <span className="text-white font-bold text-xl ml-3">NINJA PROJECT</span>
          </a>
        </div>

        <div>
          {!user && (
            <a
              href="https://ninjaproject.com.ua/auth/steam"
              className="text-white px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition"
            >
              Увійти через Steam
            </a>
          )}

          {user && (
            <div className="flex items-center space-x-4">
              <img
                src={user.avatar || 'https://steamcdn-a.akamaihd.net/steamcommunity/public/images/avatars/00/0000000000000000000000000000000000000000_full.jpg'}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white">{user.username}</span>
              <button
                onClick={handleLogout}
                className="text-white px-4 py-2 border border-white rounded hover:bg-white hover:text-black transition"
              >
                Вийти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
