import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:5000/api/user', {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => {
        if (data && data.steamid) {
          setUser(data);
        } else {
          navigate('/');
        }
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white p-4">Завантаження...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#101016] text-white">
      <Nav />

      <div className="mx-auto py-8 grid grid-cols-1 md:grid-cols-3 gap-6 all-container">
        {/* Ліва панель */}
        <div className="bg-[#151520] rounded-xl p-4 flex flex-col items-center width-left-panel">
          <img
            src={user.avatarfull || user.avatar}
            alt="Avatar"
            className="w-20 h-20 rounded-md border border-gray-600 mb-4"
          />
          <h2 className="text-xl font-bold mb-2">{user.personaname}</h2>
          <p className="text-sm text-green-400 mb-1">
            Був у грі: {new Date().toLocaleDateString()} о {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          <p className="text-sm text-gray-400 mb-2">
            SteamID64: <span className="text-white">{user.steamid}</span>
          </p>
          <span className="bg-gray-700 text-sm rounded-full px-4 py-1 mb-4">Гравець</span>

          {/* Кнопки */}
          <div className="grid grid-cols-4 gap-2 w-full mt-auto">
            <button  className="bg-green-600 py-2 rounded hover:bg-green-700">👤</button>
            <button className="bg-gray-600 py-2 rounded hover:bg-gray-700">🏠</button>
          </div>
        </div>


        {/* Права панель */}
        <div className="md:col-span-2 space-y-6 rig">
          <div className="general_info">
            <div className="fill_blocks">
            {/* Розташування */}
            <div className="bg-[#151520] rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3 width__svg"><svg x="0" y="0" width="24" height="24" viewBox="0 0 36 36" xmlSpace="preserve" className="">
                <g>
                  <g fillRule="evenodd">
                    <path d="M22.85 9.72C21.56 8.43 19.83 7.71 18 7.71s-3.56.71-4.85 2.01c-2.67 2.67-2.67 7.02 0 9.7 2.67 2.67 7.02 2.67 9.7 0 2.67-2.67 2.67-7.02 0-9.7z" fill="#fff"></path>
                    <path d="M18 2C11.06 2 5.43 7.63 5.43 14.57 5.43 27.48 18 34 18 34s12.57-6.52 12.57-19.43C30.57 7.63 24.94 2 18 2zm0 21.71c-2.34 0-4.68-.89-6.46-2.67-3.56-3.56-3.56-9.37 0-12.93 1.73-1.73 4.02-2.68 6.47-2.68s4.74.95 6.46 2.68c3.57 3.56 3.57 9.37 0 12.93A9.113 9.113 0 0 1 18 23.71z" fill="#fff"></path>
                  </g>
                </g>
              </svg> Розташування</h3>
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
                <div><p className="text-gray-500">Країна</p><p>Невідомо</p></div>
                <div><p className="text-gray-500">Місто</p><p>Прихований</p></div>
                <div><p className="text-gray-500">IP адреса</p><p>Прихований</p></div>
              </div>
            </div>

            {/* Статистика */}
            <div className="bg-[#151520] rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3 width__svg"><svg x="0" y="0" width="24" height="24" viewBox="0 0 64 64" xmlSpace="preserve" fillRule="evenodd">
                <g>
                  <path d="M56.315 31.037C55.424 31 54.484 31 53.62 31a4.5 4.5 0 0 0-4.448 3.821c-1.307 8.292-8.501 14.62-17.172 14.62-9.626 0-17.441-7.815-17.441-17.441 0-8.673 6.331-15.868 14.623-17.214a4.456 4.456 0 0 0 3.776-4.389C33 9.542 33 8.601 33 7.711a4.5 4.5 0 0 0-5.081-4.464l-.013.002C13.831 5.274 3 17.372 3 32c0 16.006 12.994 29 29 29 14.629 0 26.727-10.832 28.714-24.913l.002-.011a4.464 4.464 0 0 0-4.401-5.039z" fill="#fff"></path>
                  <path d="M35.109 7.004v14.858a7 7 0 0 0 7 7c4.672 0 10.972 0 14.718-.031a3.968 3.968 0 0 0 3.928-4.481l-.001-.01C59.211 13.391 50.585 4.704 39.67 3.043l-.014-.002a4 4 0 0 0-4.547 3.963z" fill="#fff"></path>
                </g>
              </svg> Статистика</h3>
              <div className="grid grid-cols-4 gap-4 text-sm text-gray-300">
                <div><p className="text-gray-500">Звання</p><p>Нема рангу</p></div>
                <div><p className="text-gray-500">Досвід</p><p>0</p></div>
                <div><p className="text-gray-500">Місце</p><p>2253</p></div>
                <div><p className="text-gray-500">Награно</p><p>0 год.</p></div>
              </div>
            </div>

            {/* Faceit статистика */}
            <div className="bg-[#151520] rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3 width__svg"><svg width="24" height="24" viewBox="29.3 101.1 451.7 357.9">
                <path d="m481 104.8c0-1.8-1.9-3.7-1.9-3.7-1.8 0-1.8 0-3.7 1.9-37.5 58.1-76.8 116.2-114.3 176.2h-326.2c-3.7 0-5.6 5.6-1.8 7.5 134.9 50.5 331.7 127.3 440.4 170.4 3.7 1.9 7.5-1.9 7.5-3.7z" fill="#fd5a00"></path>
                <path d="m481 104.8c0-1.8-1.9-3.7-1.9-3.7-1.8 0-1.8 0-3.7 1.9-37.5 58.1-76.8 116.2-114.3 176.2l119.9 1.23z" fill="#ff690a"></path>
              </svg> Faceit статистика</h3>
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
                <div><p className="text-gray-500">Псевдонім</p><p>Немає облікового запису</p></div>
                <div><p className="text-gray-500">Очки</p><p>0 ELO</p></div>
                <div><p className="text-gray-500">Рівень</p><p>-</p></div>
              </div>
            </div>

            {/* Steam ID секція */}
            <div className="bg-[#151520] rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3 width__svg">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path d="M2.56967 20.0269C4.30041 25.7964 9.65423 30 15.9906 30C23.7274 30 29.9995 23.7318 29.9995 16C29.9995 8.26803 23.7274 2 15.9906 2C8.56634 2 2.49151 7.77172 2.01172 15.0699C2.01172 17.1667 2.01172 18.0417 2.56967 20.0269Z" fill="url(#paint0_linear_87_8314)"></path>
                    <path d="M15.2706 12.5629L11.8426 17.5395C11.0345 17.5028 10.221 17.7314 9.54572 18.1752L2.01829 15.0784C2.01829 15.0784 1.84411 17.9421 2.56999 20.0763L7.89147 22.2707C8.15866 23.464 8.97779 24.5107 10.1863 25.0142C12.1635 25.8398 14.4433 24.8988 15.2658 22.922C15.4799 22.4052 15.5797 21.8633 15.5652 21.3225L20.5904 17.8219C23.5257 17.8219 25.9114 15.4305 25.9114 12.4937C25.9114 9.55673 23.5257 7.16748 20.5904 7.16748C17.7553 7.16748 15.1117 9.64126 15.2706 12.5629ZM14.4469 22.5783C13.8103 24.1057 12.054 24.8303 10.5273 24.1946C9.82302 23.9014 9.29128 23.3642 8.98452 22.7237L10.7167 23.4411C11.8426 23.9098 13.1343 23.3762 13.6023 22.2514C14.0718 21.1254 13.5392 19.8324 12.4139 19.3637L10.6233 18.6222C11.3142 18.3603 12.0997 18.3507 12.8336 18.6559C13.5734 18.9635 14.1475 19.5428 14.4517 20.283C14.756 21.0233 14.7548 21.8404 14.4469 22.5783ZM20.5904 16.0434C18.6364 16.0434 17.0455 14.4511 17.0455 12.4937C17.0455 10.5379 18.6364 8.94518 20.5904 8.94518C22.5457 8.94518 24.1365 10.5379 24.1365 12.4937C24.1365 14.4511 22.5457 16.0434 20.5904 16.0434ZM17.9341 12.4883C17.9341 11.0159 19.127 9.82159 20.5964 9.82159C22.0671 9.82159 23.2599 11.0159 23.2599 12.4883C23.2599 13.9609 22.0671 15.1541 20.5964 15.1541C19.127 15.1541 17.9341 13.9609 17.9341 12.4883Z" fill="white"></path>
                    <defs>
                      <linearGradient id="paint0_linear_87_8314" x1="16.0056" y1="2" x2="16.0056" y2="30" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#111D2E"></stop>
                        <stop offset="0.21248" stopColor="#051839"></stop>
                        <stop offset="0.40695" stopColor="#0A1B48"></stop>
                        <stop offset="0.5811" stopColor="#132E62"></stop>
                        <stop offset="0.7376" stopColor="#144B7E"></stop>
                        <stop offset="0.87279" stopColor="#136497"></stop>
                        <stop offset="1" stopColor="#1387B8"></stop>
                      </linearGradient>
                    </defs>
                  </g></svg> Steam ID</h3>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                <div><p className="text-gray-500">SteamID64</p><p>{user.steamid}</p></div>
                <div><p className="text-gray-500">Steam профіль</p><a href={user.profileurl} className="text-blue-400 underline" target="_blank" rel="noreferrer">Відкрити</a></div>
              </div>
            </div>


          </div>




          <div className="fill_blocks">
            {/* Результативність */}
            <div className="bg-[#151520] rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3 width__svg"><svg x="0" y="0" width="24" height="24" viewBox="0 0 48 48" xmlSpace="preserve" className="">
                <g>
                  <path d="M3 17h6a1 1 0 0 0 1-1c.133-1.613-.282-3.263-1.619-4.195C9.9 9.954 8.417 6.922 6 7c-2.416-.076-3.901 2.953-2.381 4.805A3.982 3.982 0 0 0 2 15v1a1 1 0 0 0 1 1zM3 29h6a1 1 0 0 0 1-1c.133-1.613-.282-3.263-1.619-4.195C9.9 21.954 8.417 18.922 6 19c-2.416-.076-3.901 2.953-2.381 4.805A3.982 3.982 0 0 0 2 27v1a1 1 0 0 0 1 1zM3 41h6a1 1 0 0 0 1-1c.133-1.613-.282-3.263-1.619-4.195C9.9 33.954 8.417 30.922 6 31c-2.416-.076-3.901 2.953-2.381 4.805A3.982 3.982 0 0 0 2 39v1a1 1 0 0 0 1 1zM39 36c0-2.206-1.794-4-4-4H14c-1.654 0-3 1.346-3 3v2c0 1.654 1.346 3 3 3h21c2.206 0 4-1.794 4-4zM21 20h-7c-1.654 0-3 1.346-3 3v2c0 1.654 1.346 3 3 3h7c5.284-.167 5.287-7.832 0-8zM42 8H14c-1.654 0-3 1.346-3 3v2c0 1.654 1.346 3 3 3h28c5.277-.164 5.293-7.831 0-8z" fill="#fff"></path>
                </g>
              </svg> Результативність</h3>
              <div className="grid grid-cols-5 gap-4 text-sm text-gray-300">
                {['Перемог', 'Раундів', 'Вбивств', 'Смертей', 'К/Д'].map((label, i) => (
                  <div key={i}><p className="text-gray-500">{label}</p><p>0</p></div>
                ))}
              </div>
            </div>

            {/* Влучність */}
            <div className="bg-[#151520] rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3 width__svg"><svg x="0" y="0" width="24" height="24" viewBox="0 0 512 512" xmlSpace="preserve" className="">
                <g>
                  <path d="M256 120.5c-74.715 0-135.5 60.785-135.5 135.5S181.285 391.5 256 391.5 391.5 330.715 391.5 256 330.715 120.5 256 120.5zm48.341 119.22-49.333 53a15.001 15.001 0 0 1-21.586.386l-25.389-25.389c-5.858-5.857-5.858-15.355 0-21.213 5.858-5.857 15.356-5.857 21.213 0l14.396 14.396 38.741-41.62c5.645-6.064 15.136-6.404 21.2-.76 6.062 5.645 6.402 15.136.758 21.2z" fill="#fff"></path>
                  <path d="M497 241h-19.939c-3.556-53.537-26.093-103.381-64.387-141.675C374.381 61.032 324.537 38.494 271 34.939V15c0-8.284-6.716-15-15-15s-15 6.716-15 15v19.939c-53.537 3.556-103.381 26.094-141.675 64.387C61.032 137.619 38.494 187.463 34.939 241H15c-8.284 0-15 6.716-15 15s6.716 15 15 15h19.939c3.556 53.537 26.093 103.381 64.387 141.675 38.294 38.293 88.138 60.831 141.675 64.386V497c0 8.284 6.716 15 15 15s15-6.716 15-15v-19.939c53.537-3.556 103.381-26.094 141.675-64.386 38.293-38.294 60.831-88.138 64.387-141.675H497c8.284 0 15-6.716 15-15s-6.716-15-15-15zM271 446.986v-18.844c0-8.284-6.716-15-15-15s-15 6.716-15 15v18.844C147.302 439.695 72.305 364.698 65.014 271h18.843c8.284 0 15-6.716 15-15s-6.716-15-15-15H65.014C72.305 147.302 147.302 72.305 241 65.014v18.844c0 8.284 6.716 15 15 15s15-6.716 15-15V65.014C364.698 72.305 439.695 147.302 446.986 241h-18.843c-8.284 0-15 6.716-15 15s6.716 15 15 15h18.843C439.695 364.698 364.698 439.695 271 446.986z" fill="#fff"></path>
                </g>
              </svg> Влучність</h3>
              <div className="grid grid-cols-5 gap-4 text-sm text-gray-300">
                {['Асистів', 'В головy', 'Пострілів', 'Влучань'].map((label, i) => (
                  <div key={i}><p className="text-gray-500">{label}</p><p>{i === 1 ? '0%' : '0'}</p></div>
                ))}
              </div>
            </div>

            {/* Незвичайні навички */}
            <div className="bg-[#151520] rounded-xl p-4">
              <h3 className="text-lg font-semibold mb-3">👻 Незвичайні навички</h3>
              <div className="grid grid-cols-4 gap-4 text-sm text-gray-300">
                {[
                  'Перших вбивств',
                  'Вбивств прострілом',
                  'Вбивств без прицілу',
                  'Вбивств на бігу',
                  
                ].map((label, i) => (
                  <div key={i}><p className="text-gray-500">{label}</p><p>0</p></div>
                ))}
              </div>
            </div>

            {/* Незвичайні навички */}
            <div className="bg-[#151520] rounded-xl p-4 height__jump">
              
              <div className="grid grid-cols-4 gap-4 text-sm text-gray-300 height-flex ">
                {[
                  'Вбивств у стрибку',
                  'Вбивств сліпим',
                  'Вбивств у дим',
                  'Вбивств з розвороту',
                ].map((label, i) => (
                  <div key={i}><p className="text-gray-500">{label}</p><p>0</p></div>
                ))}
              </div>
            </div>


          </div>
          </div>



        </div>
      </div>
      <Footer />
    </div>
  );
}
