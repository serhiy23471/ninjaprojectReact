import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="relative bg-black py-20 overflow-hidden">
      {/* Видалено фон-картинку */}

      {/* Main container */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center">
        {/* Left side - Text */}
        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            <span className="text-red-600">NINJA</span> PROJECT
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-lg">
            Лучший CS2 сервер! Присоединяйся к нашей команде и ощути настоящий дух боя.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <a
              href="#server"
              className="bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-red-800 hover:text-white"
            >
              Играть сейчас
            </a>
            <a
              href="#vip"
              className="bg-gray-800 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700 hover:text-white"
            >
              VIP статусы
            </a>
          </div>
        </div>

        {/* Right side - Decorative bouncing circle */}
        <div className="md:w-1/2 flex justify-center relative">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-bounce absolute bottom-0 right-0 shadow-xl shadow-red-800"></div>
        </div>
      </div>
    </section>
  );
}
