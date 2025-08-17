import React, { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function AdminPanel() {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Стани для форм
  const [muteUserId, setMuteUserId] = useState(null);
  const [muteType, setMuteType] = useState(2);
  const [muteDuration, setMuteDuration] = useState(0);
  const [muteReason, setMuteReason] = useState('');

  const [banUserId, setBanUserId] = useState(null);
  const [banDuration, setBanDuration] = useState(0);
  const [banReason, setBanReason] = useState('');
  const [banType, setBanType] = useState(0);

  const [vipUserId, setVipUserId] = useState(null);
  const [vipName, setVipName] = useState('');
  const [vipGroup, setVipGroup] = useState('');
  const [vipExpires, setVipExpires] = useState('');

  // Функція для отримання аватарки
  const getUserAvatar = (user) => {
    if (user.avatarfull) return user.avatarfull;
    if (user.avatar) return user.avatar;
    if (user.steamid) {
      // Конвертація SteamID32/SteamID3 в SteamID64 якщо потрібно
      const steamId64 = convertToSteamId64(user.steamid) || user.steamid;
      return `https://avatars.steamstatic.com/${steamId64}_full.jpg`;
    }
    return 'https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/avatars/fe/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_full.jpg';
  };

  // Конвертація SteamID
  const convertToSteamId64 = (steamId) => {
    if (!steamId) return null;
    
    // Якщо це вже SteamID64 (17 цифр)
    if (/^\d{17}$/.test(steamId)) return steamId;
    
    // Для SteamID3 формату [U:1:12345678]
    const matches = steamId.match(/^\[U:1:(\d+)\]$/);
    if (matches) {
      const steamId64Base = BigInt('76561197960265728');
      const accountId = BigInt(matches[1]);
      return (steamId64Base + accountId).toString();
    }
    
    return null;
  };

  // Пошук користувачів
  const searchUser = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/admin/search-user?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      alert('Помилка пошуку: ' + err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Загальна дія (kick/mute/ban/vip)
  const actionUser = async (endpoint, steamid) => {
    if (endpoint === 'mute') {
      setMuteUserId(steamid);
      return;
    }
    if (endpoint === 'ban') {
      setBanUserId(steamid);
      return;
    }
    if (endpoint === 'vip') {
      setVipUserId(steamid);
      return;
    }

    const confirmText = {
      kick: 'Кікнути користувача?'
    }[endpoint] || 'Впевнені?';

    if (!window.confirm(confirmText)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/admin/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ steamid }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Action failed');

      setUsers(prev =>
        prev.map(u => (u.steamid === steamid ? {
          ...u,
          banned: endpoint === 'ban' ? !u.banned : u.banned,
          vip: endpoint === 'vip' ? !u.vip : u.vip,
          muted: endpoint === 'mute' ? !u.muted : u.muted,
        } : u))
      );

      alert(json.message || 'OK');
    } catch (err) {
      alert('Помилка: ' + err.message);
      console.error('Action error', err);
    }
  };

  // Відправка форми мута
  const submitMute = async (steamid) => {
    if (!muteReason.trim()) {
      alert('Вкажи причину мута');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/admin/mute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ steamid, muteType, duration: muteDuration, reason: muteReason }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Mute failed');

      alert(json.message || "Користувача зам'ютено");
      setUsers(prev => prev.map(u => (u.steamid === steamid ? { ...u, muted: true } : u)));

      setMuteUserId(null);
      setMuteType(2);
      setMuteDuration(0);
      setMuteReason('');
    } catch (err) {
      alert('Помилка мута: ' + err.message);
      console.error('Mute error', err);
    } finally {
      setLoading(false);
    }
  };

  // Відправка форми бану
  const submitBan = async (steamid) => {
    if (!banReason.trim()) {
      alert('Вкажи причину бану');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/admin/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ steamid, duration: banDuration, reason: banReason, banType }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Ban failed');

      alert(json.message || "Користувача забанено");
      setUsers(prev => prev.map(u => (u.steamid === steamid ? { ...u, banned: true } : u)));

      setBanUserId(null);
      setBanDuration(0);
      setBanReason('');
      setBanType(0);
    } catch (err) {
      alert('Помилка бану: ' + err.message);
      console.error('Ban error', err);
    } finally {
      setLoading(false);
    }
  };

  // Відправка форми VIP
  const submitVip = async (steamid) => {
    if (!vipGroup.trim()) {
      alert('Вкажи групу VIP');
      return;
    }

    let expiresTimestamp = null;
    if (vipExpires) {
      expiresTimestamp = Math.floor(new Date(vipExpires).getTime() / 1000);
      if (isNaN(expiresTimestamp)) {
        alert('Невірний формат дати');
        return;
      }
    }

    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/admin/vip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          sid: steamid,
          name: vipName,
          group: vipGroup,
          expires: expiresTimestamp,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'VIP action failed');

      alert(json.message || "VIP оновлено");
      setUsers(prev => prev.map(u => (u.steamid === steamid ? { ...u, vip: true } : u)));

      setVipUserId(null);
      setVipName('');
      setVipGroup('');
      setVipExpires('');
    } catch (err) {
      alert('Помилка VIP: ' + err.message);
      console.error('VIP error', err);
    } finally {
      setLoading(false);
    }
  };

  // Відміна форм
  const cancelMute = () => {
    setMuteUserId(null);
    setMuteType(2);
    setMuteDuration(0);
    setMuteReason('');
  };
  const cancelBan = () => {
    setBanUserId(null);
    setBanDuration(0);
    setBanReason('');
    setBanType(0);
  };
  const cancelVip = () => {
    setVipUserId(null);
    setVipName('');
    setVipGroup('');
    setVipExpires('');
  };

  return (
    <>
      <Nav />
      <div className="p-6 min-h-screen bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">⚙️ Адмін панель</h1>

          {/* Пошук */}
          <div className="flex gap-3 mb-6">
            <input
              className="flex-1 p-3 rounded bg-gray-800 border border-gray-700"
              placeholder="Введіть нік або SteamID..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') searchUser(); }}
            />
            <button
              className="px-4 py-3 bg-blue-600 rounded hover:bg-blue-700"
              onClick={searchUser}
              disabled={loading}
            >
              {loading ? 'Пошук...' : '🔍 Пошук'}
            </button>
          </div>

          {/* Список користувачів */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {users.length === 0 && <p className="text-gray-400">Немає результатів пошуку</p>}
            
            {users.map(user => (
              <div key={user.steamid} className="bg-gray-800 rounded-xl p-4 shadow">
                {/* Інформація про користувача */}
                <div className="flex items-center gap-4">
                  <img
                    src={user.avatar}
                    alt="User avatar"
                    className="w-14 h-14 rounded-full border-2 border-gray-700"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      e.target.src = '';
                    }}
                  />
                  <div>
                    <div className="text-lg font-semibold">{user.name || user.username || 'Гравець'}</div>
                    <div className="text-sm text-gray-400">SteamID: {user.steamid}</div>
                    {user.last_connect && (
                      <div className="text-xs text-gray-500">
                        Останнє підключення: {new Date(user.last_connect * 1000).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>

                {/* Статуси */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {user.banned && <span className="px-2 py-1 text-xs bg-red-900 rounded">BANNED</span>}
                  {user.muted && <span className="px-2 py-1 text-xs bg-yellow-900 rounded">MUTED</span>}
                  {user.vip && <span className="px-2 py-1 text-xs bg-purple-900 rounded">VIP</span>}
                  {user.admin && <span className="px-2 py-1 text-xs bg-blue-900 rounded">ADMIN</span>}
                </div>

                {/* Форми дій */}
                {muteUserId === user.steamid ? (
                  <div className="mt-4 space-y-2">
                    <label className="block">
                      Тип мута:
                      <select
                        value={muteType}
                        onChange={e => setMuteType(Number(e.target.value))}
                        className="ml-2 bg-gray-700 rounded p-1"
                      >
                        <option value={0}>Голос</option>
                        <option value={1}>Чат</option>
                        <option value={2}>Обидва</option>
                      </select>
                    </label>

                    <label className="block">
                      Тривалість (секунд, 0 - назавжди):
                      <input
                        type="number"
                        value={muteDuration}
                        min={0}
                        onChange={e => setMuteDuration(Number(e.target.value))}
                        className="ml-2 p-1 rounded bg-gray-700"
                      />
                    </label>

                    <label className="block">
                      Причина:
                      <input
                        type="text"
                        value={muteReason}
                        onChange={e => setMuteReason(e.target.value)}
                        className="ml-2 p-1 rounded bg-gray-700 w-full"
                      />
                    </label>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => submitMute(user.steamid)}
                        disabled={loading}
                        className="px-3 py-1 bg-green-600 rounded hover:bg-green-700"
                      >
                        Підтвердити
                      </button>
                      <button
                        onClick={cancelMute}
                        disabled={loading}
                        className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                      >
                        Відмінити
                      </button>
                    </div>
                  </div>
                ) : banUserId === user.steamid ? (
                  <div className="mt-4 space-y-2">
                    <label className="block">
                      Тип бану:
                      <select
                        value={banType}
                        onChange={e => setBanType(Number(e.target.value))}
                        className="ml-2 bg-gray-700 rounded p-1"
                      >
                        <option value={0}>SteamID</option>
                        <option value={1}>IP</option>
                        <option value={2}>Обидва</option>
                      </select>
                    </label>

                    <label className="block">
                      Тривалість (секунд, 0 - назавжди):
                      <input
                        type="number"
                        value={banDuration}
                        min={0}
                        onChange={e => setBanDuration(Number(e.target.value))}
                        className="ml-2 p-1 rounded bg-gray-700"
                      />
                    </label>

                    <label className="block">
                      Причина:
                      <input
                        type="text"
                        value={banReason}
                        onChange={e => setBanReason(e.target.value)}
                        className="ml-2 p-1 rounded bg-gray-700 w-full"
                      />
                    </label>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => submitBan(user.steamid)}
                        disabled={loading}
                        className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                      >
                        Підтвердити
                      </button>
                      <button
                        onClick={cancelBan}
                        disabled={loading}
                        className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                      >
                        Відмінити
                      </button>
                    </div>
                  </div>
                ) : vipUserId === user.steamid ? (
                  <div className="mt-4 space-y-2">
                    <label className="block">
                      Ім'я:
                      <input
                        type="text"
                        value={vipName}
                        onChange={e => setVipName(e.target.value)}
                        className="ml-2 p-1 rounded bg-gray-700 w-full"
                      />
                    </label>

                    <label className="block">
                      Група VIP:
                      <input
                        type="text"
                        value={vipGroup}
                        onChange={e => setVipGroup(e.target.value)}
                        className="ml-2 p-1 rounded bg-gray-700 w-full"
                      />
                    </label>

                    <label className="block">
                      Закінчення VIP:
                      <input
                        type="date"
                        value={vipExpires}
                        onChange={e => setVipExpires(e.target.value)}
                        className="ml-2 p-1 rounded bg-gray-700 w-full"
                      />
                    </label>

                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => submitVip(user.steamid)}
                        disabled={loading}
                        className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700"
                      >
                        Підтвердити
                      </button>
                      <button
                        onClick={cancelVip}
                        disabled={loading}
                        className="px-3 py-1 bg-gray-600 rounded hover:bg-gray-700"
                      >
                        Відмінити
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => actionUser('ban', user.steamid)}
                      className={`px-3 py-1 rounded ${user.banned ? 'bg-red-700' : 'bg-red-500 hover:bg-red-600'}`}
                    >
                      {user.banned ? '🚫 Розбанити' : '🚫 Забанити'}
                    </button>

                    <button
                      onClick={() => actionUser('mute', user.steamid)}
                      className={`px-3 py-1 rounded ${user.muted ? 'bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                    >
                      {user.muted ? '🔊 Розмутити' : '🔇 Замутити'}
                    </button>

                    <button
                      onClick={() => actionUser('vip', user.steamid)}
                      className={`px-3 py-1 rounded ${user.vip ? 'bg-purple-700' : 'bg-purple-500 hover:bg-purple-600'}`}
                    >
                      {user.vip ? '💎 Видалити VIP' : '💎 Дати VIP'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}