import React from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import ServerStatus from './components/ServerStatus';
import VipSection from './components/VipSection';
import Rules from "./components/Rules/Rules";
import CommentsSection from './components/CommentsSection';

function App() {
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

  return (
    <div>
      <Nav />
      <Hero />
      <ServerStatus servers={servers} />
      <VipSection />
      <Rules />
      <CommentsSection />
    </div>
  );
}

export default App;
