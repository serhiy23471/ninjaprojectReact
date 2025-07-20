import React, { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import ServerStatus from './components/ServerStatus';
import VipSection from './components/VipSection';
import Rules from './components/Rules/Rules';
import CommentsSection from './components/CommentsSection';

function App() {
  const [message, setMessage] = useState('');

  // Приклад статичних серверів
  const servers = [
    {
      name: 'NINJA #1',
      status: 'online',
      color: 'green',
      players: '0/24',
      map: 'de_mirage',
      ip: '217.77.210.236:27038',
    },
    {
      name: 'NINJA #2',
      status: 'online',
      color: 'yellow',
      players: '-/-',
      map: '-',
      ip: '',
    },
  ];

  useEffect(() => {
    fetch('https://ninjaproject.com.ua/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <Nav />
      <Hero />
      <ServerStatus servers={servers} />
      <VipSection />
      <Rules />
      <CommentsSection />
      {/* Можеш вивести message для перевірки API */}
      {message && <p className="text-center mt-4 text-gray-500">{message}</p>}
    </div>
  );
}

export default App;
