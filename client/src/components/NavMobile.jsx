import React, { useRef, useEffect, useState } from 'react';

export default function NavMobile({ user, onLogout, isOpen, onToggle }) {
  const menuRef = useRef(null);
  const [maxHeight, setMaxHeight] = useState('0px');

  useEffect(() => {
    if (isOpen) {
      setMaxHeight(menuRef.current.scrollHeight + 'px');
      document.body.style.overflow = 'hidden'; // блокування скролу сторінки при відкритому меню
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      setMaxHeight('0px');
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
  }, [isOpen]);

  return (
    <>
      {/* Кнопка бургер-меню */}
      <div className="md:hidden flex justify-end pr-4 mobile__button">
        <button
          onClick={onToggle}
          className="text-white focus:outline-none mobile__button"
          aria-label="Toggle mobile menu"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Мобільне меню з анімацією max-height */}
      <div
        ref={menuRef}
        style={{
          maxHeight: maxHeight,
          overflow: 'hidden',
          transition: 'max-height 0.3s ease, opacity 0.3s ease',
          opacity: isOpen ? 1 : 0,
        }}
        className="fixed top-16 left-0 w-full bg-black bg-opacity-95 p-4 z-40 pointer-events-auto"
      >
        <a href="#home" className="block text-white py-2 hover:text-red-500 text-center">Главная</a>
        <a href="http://localhost:27275/" target="_blank" rel="noopener noreferrer" className="nav-link text-white hover:text-red-500 text-center skins">
          <button className="btn text-center">Скини</button>
        </a>
        <a href="/application/application.php" className="block text-white py-2 hover:text-red-500 text-center">Подача заявок</a>
        <a href="#vip" className="block text-white py-2 hover:text-red-500 text-center">VIP</a>
        <a href="#rules" className="block text-white py-2 hover:text-red-500 text-center">Правила</a>
        <a href="#server" className="block text-white py-2 hover:text-red-500 text-center">Подключиться</a>

        {user ? (
          <div className="flex items-center justify-center space-x-3 my-4">
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-10 h-10 rounded-full border-2 border-red-600"
            />
            <div className="text-white text-sm">
              <div className="font-bold">{user.username}</div>
              <button
                onClick={onLogout}
                className="text-red-400 hover:text-red-600 text-xs block mt-1 mobile__button"
              >
                Выйти
              </button>
            </div>
          </div>
        ) : (
          <a
            href="http://localhost:5000/auth/steam"
            className="block text-white font-bold py-2 px-4 rounded-full bg-red-600 hover:bg-red-700 text-center mt-4"
          >
            <i className="fab fa-steam mr-2"></i> Войти
          </a>
        )}
      </div>
    </>
  );
}
