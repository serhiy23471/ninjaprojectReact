import React from 'react';

export default function NavDesktop({ user }) {
  const handleLogout = () => {
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(() => {
        window.location.href = '/';
      })
      .catch(err => {
        console.error('Logout failed:', err);
      });
  };

  return (
    <nav className="hidden md:flex items-center space-x-8">
      <a href="#home" className="nav-link text-white hover:text-red-500">Главная</a>
      <a href="/skins/index.html" target="_blank" rel="noopener noreferrer">
        <button className="btn">Скини</button>
      </a>

      <a href="./application/application.php" className="nav-link text-white hover:text-red-500">Подача заявок</a>
      <a href="#vip" className="nav-link text-white hover:text-red-500">VIP</a>
      <a href="#rules" className="nav-link text-white hover:text-red-500">Правила</a>
      <a href="#server" className="nav-link text-white hover:text-red-500">Подключиться</a>

      {user ? (
        <div className="flex items-center space-x-2">
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-10 h-10 rounded-full border-2 border-red-600"
          />
          <div className="text-white text-sm text-left leading-tight">
            <div className="font-bold">{user.username}</div>
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-600 text-xs transition-transform duration-300 ease-in-out hover:-translate-y-0.5"
              style={{ padding: '0', backgroundColor: 'transparent' }}
            >
              Выйти
            </button>
          </div>
        </div>
      ) : (
        <a
          href="http://localhost:5000/auth/steam"
          className="steam-btn font-bold py-2 px-4 rounded-full inline-flex items-center no-underline transition-colors duration-300 transition-transform ease-in-out hover:-translate-y-0.5"
          style={{ color: '#fff', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = '#fff'}
        >
          <i className="fab fa-steam mr-2" style={{ fontSize: '16px', color: '#fff', transition: 'color 0.3s ease' }}></i> Войти
        </a>
      )}
    </nav>
  );
}
