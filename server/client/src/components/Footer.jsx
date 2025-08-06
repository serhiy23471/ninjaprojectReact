// src/components/Footer.jsx
import React, { useEffect, useState } from 'react';

const Footer = () => {
  const [stats, setStats] = useState({
    bans: 0,
    mutes: 0,
    online: 0,
    maxPlayers: 24,
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/stats')
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error('Помилка завантаження статистики:', err));
  }, []);

  return (
    <footer className="bg-black py-12 border-t border-gray-800 w-full">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 footer-grid">
          {/* Logo + Description */}
          <div>
            <div className="flex items-center mb-4">
              <img src="/logo.png" alt="Ninja Project Logo" className="w-10 h-10" />
              <span className="text-white font-bold text-xl ml-3">NINJA PROJECT</span>
            </div>
            <p className="text-gray-400">
              Лучший CS2 сервер. Присоединяйся к нашему сообществу!
            </p>
          </div>

          {/* Developers */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 border-b border-red-500 pb-2">
              Разработчики
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li className="flex items-center"><i className="fas fa-code text-red-500 mr-2"></i> Главный разработчик: Asuna</li>
              <li className="flex items-center"><i className="fas fa-paint-brush text-red-500 mr-2"></i> Дизайнер: essenty</li>
              <li className="flex items-center"><i className="fas fa-cogs text-red-500 mr-2"></i> Создатель: Котяра</li>
              <li className="flex items-center"><i className="fas fa-cogs text-red-500 mr-2"></i> Основатель: MaXoN4eK</li>
            </ul>
          </div>

          {/* Stats */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4 border-b border-red-500 pb-2">
              Статистика
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex justify-between"><span>Банов:</span> <span className="text-white">{stats.bans}</span></li>
              <li className="flex justify-between"><span>Мутов:</span> <span className="text-white">{stats.mutes}</span></li>
              <li className="flex justify-between"><span>Игроков онлайн:</span> <span className="text-green-500">{stats.online}/{stats.maxPlayers}</span></li>
            </ul>
          </div>

          {/* Contacts */}
          <div className="overflow-hidden">
            <h3 className="text-xl font-bold text-white mb-4 border-b border-red-500 pb-2">
              Контакты
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start"><i className="fas fa-envelope text-red-500 mr-2 mt-1 flex-shrink-0"></i> <span className="break-all">maksimnaumenko197@gmail.com</span></li>
              <li className="flex items-center"><i className="fas fa-map-marker-alt text-red-500 mr-2"></i> <span>Україна</span></li>
            </ul>

            <div className="flex space-x-4 mt-4">
              <a href="https://discord.gg/aznxEMcTAA" className="text-gray-400 hover:text-red-500 text-xl transition duration-300">
                <i className="fab fa-discord"></i>
              </a>
              <a href="https://www.tiktok.com/@ninjaprojectlove?lang=ru-RU" className="text-gray-400 hover:text-red-500 text-xl transition duration-300">
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p> Ninja Project не связан с Valve Corporation. Counter-Strike и логотипы — товарные знаки Valve. </p>
          <p className="mt-2">© 2025 Ninja Project. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
