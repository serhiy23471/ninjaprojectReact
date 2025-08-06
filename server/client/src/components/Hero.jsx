import React from 'react';

export default function Hero() {
  return (
    <section id="home" className="relative bg-black py-20 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h2 className="text-5xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">
            <span className="text-red-600">NINJA</span> PROJECT
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-lg">
            Лучший CS2 сервер! Присоединяйся к нашей команде и ощути настоящий дух боя.
          </p>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <div className="relative inline-flex">
              <div className="absolute -inset-1 rounded-full bg-green-500 opacity-0 animate-soft-pulse"></div>
              <a
                href="#server"
                className="relative bg-red-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 hover:bg-red-800 hover:text-white animate-btn-pulse game"
              >
                Играть сейчас
              </a>
            </div>
            <a
              href="#vip"
              className="bg-gray-800 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-gray-700 hover:text-white"
            >
              VIP статусы
            </a>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center relative">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center animate-bounce absolute bottom-0 right-0 shadow-xl shadow-red-800"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes soft-pulse {
          0% {
            transform: scale(1);
            opacity: 0;
          }
          20% {
            opacity: 0.4;
          }
          60% {
            transform: scale(1.1);
            opacity: 0;
          }
          100% {
            transform: scale(1.1);
            opacity: 0;
          }
        }
        @keyframes btn-pulse {
          0%, 100% {
            transform: scale(1);
          }
          20% {
            transform: scale(1.03);
          }
          60% {
            transform: scale(1.03);
          }
          80% {
            transform: scale(1);
          }
        }
        .animate-soft-pulse {
          animation: soft-pulse 2s ease-out infinite;
        }
        .animate-btn-pulse {
          animation: btn-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}