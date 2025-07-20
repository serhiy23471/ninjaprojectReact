import React, { useState } from 'react';

export default function ServerStatus({ servers }) {
  const [copiedIndexes, setCopiedIndexes] = useState([]);

  const handleCopy = (ip, index) => {
    const connectString = `connect ${ip}`;
    navigator.clipboard.writeText(connectString);
    setCopiedIndexes((prev) => [...prev, index]);
    setTimeout(() => {
      setCopiedIndexes((prev) => prev.filter(i => i !== index));
    }, 2000);
  };

  return (
    <section id="server" className="py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 ninja-text">
          ОНЛАЙН СЕРВЕРОВ
        </h2>

        <div className="max-w-2xl mx-auto">
          {servers.map((server, idx) => (
            <div
              key={idx}
              className={`bg-gray-800 rounded-lg p-5 shadow-lg mb-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                server.color === 'green'
                  ? 'hover:shadow-red-900/20'
                  : 'hover:shadow-yellow-900/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={`w-3 h-3 rounded-full mr-3 pulse ${
                      server.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
                    }`}
                  ></div>
                  <h3 className="text-lg font-bold text-white">{server.name}</h3>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Игроков</p>
                    <p className={`font-bold ${server.players === '-/-' ? 'text-gray-500' : 'text-white'}`}>
                      {server.players}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-gray-600"></div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Карта</p>
                    <p className={`font-bold ${server.map === '-' ? 'text-gray-500' : 'text-white'}`}>
                      {server.map}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex justify-between items-center">
                {server.ip ? (
                  <>
                    <span className="text-sm text-gray-400 server-ip">IP: {server.ip}</span>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-1 px-3 rounded transition duration-300 flex items-center"
                      onClick={() => handleCopy(server.ip, idx)}
                      disabled={copiedIndexes.includes(idx)}
                    >
                      <i
                        className={`mr-1 fas ${
                          copiedIndexes.includes(idx) ? 'fa-check' : 'fa-copy'
                        }`}
                      ></i>
                      {copiedIndexes.includes(idx) ? 'Скопировано' : 'Копировать'}
                    </button>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Сервер в разработке</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
