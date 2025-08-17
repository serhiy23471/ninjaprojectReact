import React, { useEffect, useState } from 'react';

function Stats() {
  const [stats, setStats] = useState({
    bans: 0,
    mutes: 0,
    online: 0,
    maxPlayers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/stats')
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div>Завантаження статистики...</div>;

  return (
    <div className="stats">
      <p>Бани: {stats.bans}</p>
      <p>Мути: {stats.mutes}</p>
      <p>Онлайн: {stats.online} / {stats.maxPlayers}</p>
    </div>
  );
}

export default Stats;
