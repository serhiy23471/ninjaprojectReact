import React, { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true; // для сесій

const AdminPage = () => {
  const [steamIdInput, setSteamIdInput] = useState('');
  const [userData, setUserData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');
  const [loginSteamId, setLoginSteamId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Авторизація (імітація Steam login)
  const login = () => {
    if (!loginSteamId) return;
    axios.post('http://localhost:5000/login', { steamid: loginSteamId })
      .then(() => {
        setMessage('Успішний логін');
        setIsAdmin(true);
        fetchApplications();
      })
      .catch(() => setMessage('Помилка логіну'));
  };

  // Вихід
  const logout = () => {
    axios.post('http://localhost:5000/logout')
      .then(() => {
        setMessage('Вихід виконано');
        setIsAdmin(false);
        setUserData(null);
        setApplications([]);
      });
  };

  const fetchApplications = () => {
    axios.get('http://localhost:5000/admin/applications')
      .then(res => setApplications(res.data))
      .catch(() => setMessage('Помилка завантаження заявок'));
  };

  useEffect(() => {
    if (isAdmin) fetchApplications();
  }, [isAdmin]);

  const acceptApplication = (id) => {
    axios.post(`http://localhost:5000/admin/applications/${id}/accept`)
      .then(() => {
        setApplications(apps => apps.filter(a => a.id !== id));
        setMessage('Заявка прийнята');
      })
      .catch(() => setMessage('Помилка'));
  };

  const searchUser = () => {
    setMessage('');
    setUserData(null);
    if (!steamIdInput) return;
    axios.get(`http://localhost:5000/admin/users?steamId=${steamIdInput}`)
      .then(res => setUserData(res.data))
      .catch(() => setMessage('Користувача не знайдено'));
  };

  const performAction = (action) => {
    if (!userData) return;
    axios.post(`http://localhost:5000/admin/users/${userData.steamId}/${action}`)
      .then(res => setMessage(res.data.message))
      .catch(() => setMessage('Помилка при дії'));
  };

  if (!isAdmin) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Логін адміна (SteamID)</h2>
        <input
          type="text"
          value={loginSteamId}
          onChange={e => setLoginSteamId(e.target.value)}
          placeholder="Введіть свій SteamID"
        />
        <button onClick={login}>Увійти</button>
        {message && <p>{message}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={logout}>Вийти</button>
      <h2>Заявки</h2>
      {applications.length === 0 && <p>Немає заявок</p>}
      <ul>
        {applications.map(app => (
          <li key={app.id}>
            {app.username} ({app.steamId})
            <button onClick={() => acceptApplication(app.id)}>Прийняти</button>
          </li>
        ))}
      </ul>

      <h2>Пошук користувача</h2>
      <input
        type="text"
        value={steamIdInput}
        onChange={e => setSteamIdInput(e.target.value)}
        placeholder="Введіть SteamID"
      />
      <button onClick={searchUser}>Пошук</button>

      {message && <p>{message}</p>}

      {userData && (
        <div style={{ marginTop: 20 }}>
          <p>Нік: {userData.username}</p>
          <p>SteamID: {userData.steamId}</p>
          <p>Забанений: {userData.banned ? 'Так' : 'Ні'}</p>
          <p>Мут: {userData.muted ? 'Так' : 'Ні'}</p>
          <p>VIP: {userData.vip ? 'Так' : 'Ні'}</p>
          <button onClick={() => performAction('ban')}>Забанити</button>
          <button onClick={() => performAction('mute')}>Мут</button>
          <button onClick={() => performAction('kick')}>Кік</button>
          <button onClick={() => performAction('vip')}>Дати VIP</button>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
