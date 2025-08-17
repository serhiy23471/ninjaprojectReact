const pool = require('./db');

// --- BAN ---

// Забанити користувача по SteamID
async function banUser(steamid, adminId, duration = 0, reason = '', banType = 0) {
  // duration - у секундах (0 - перманент)
  // ban_type: 0 - SteamID, 1 - IP, 2 - Both
  const now = Math.floor(Date.now() / 1000);
  const endAt = duration > 0 ? now + duration : 0;

  const sql = `
    INSERT INTO iks_bans 
      (steam_id, duration, reason, ban_type, admin_id, created_at, end_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [steamid, duration, reason, banType, adminId, now, endAt, now];

  const [result] = await pool.query(sql, params);
  return result;
}

// Розбанити користувача
async function unbanUser(steamid, adminId, unbanReason = '') {
  const now = Math.floor(Date.now() / 1000);
  
  const sql = `
    UPDATE iks_bans
    SET unbanned_by = ?, unban_reason = ?, updated_at = ?
    WHERE steam_id = ? AND unbanned_by IS NULL
  `;

  const params = [adminId, unbanReason, now, steamid];
  const [result] = await pool.query(sql, params);
  return result;
}

// Перевірити, чи користувач забанений
async function isUserBanned(steamid) {
  const now = Math.floor(Date.now() / 1000);
  const sql = `
    SELECT * FROM iks_bans 
    WHERE steam_id = ? AND unbanned_by IS NULL
      AND (end_at = 0 OR end_at > ?)
    LIMIT 1
  `;
  const [rows] = await pool.query(sql, [steamid, now]);
  return rows.length > 0 ? rows[0] : null;
}

// --- MUTE ---

// Зам'ютити користувача
async function muteUser(steamid, adminId, muteType = 2, duration = 0, reason = '') {
  // muteType: 0 - voice, 1 - chat, 2 - both
  const now = Math.floor(Date.now() / 1000);
  const endAt = duration > 0 ? now + duration : 0;

  const sql = `
    INSERT INTO iks_comms 
      (steam_id, mute_type, duration, reason, admin_id, created_at, end_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [steamid, muteType, duration, reason, adminId, now, endAt, now];
  const [result] = await pool.query(sql, params);
  return result;
}

// Розм'ютити користувача
async function unmuteUser(steamid, adminId, unbanReason = '') {
  const now = Math.floor(Date.now() / 1000);

  const sql = `
    UPDATE iks_comms
    SET unbanned_by = ?, unban_reason = ?, updated_at = ?
    WHERE steam_id = ? AND unbanned_by IS NULL
  `;

  const params = [adminId, unbanReason, now, steamid];
  const [result] = await pool.query(sql, params);
  return result;
}

// Перевірити, чи користувач зам’ютений
async function isUserMuted(steamid) {
  const now = Math.floor(Date.now() / 1000);
  const sql = `
    SELECT * FROM iks_comms 
    WHERE steam_id = ? AND unbanned_by IS NULL
      AND (end_at = 0 OR end_at > ?)
    LIMIT 1
  `;

  const [rows] = await pool.query(sql, [steamid, now]);
  return rows.length > 0 ? rows[0] : null;
}

// --- VIP ---

// Видати VIP користувачу (оновити або вставити)
async function giveVip(sid, name = '', accountId = null, group = '', expires = null) {
  const now = Math.floor(Date.now() / 1000);
  const exp = expires ? expires : null;

  const sql = `
    INSERT INTO vip_users (sid, name, account_id, lastvisit, \`group\`, expires)
    VALUES (?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      account_id = VALUES(account_id),
      lastvisit = VALUES(lastvisit),
      \`group\` = VALUES(\`group\`),
      expires = VALUES(expires)
  `;

  const params = [sid, name, accountId, now, group, exp];
  const [result] = await pool.query(sql, params);
  return result;
}

// Зняти VIP користувачу
async function removeVip(sid) {
  const sql = `DELETE FROM vip_users WHERE sid = ?`;
  const [result] = await pool.query(sql, [sid]);
  return result;
}

// Перевірити, чи користувач має активний VIP
async function isUserVip(sid) {
  const now = Math.floor(Date.now() / 1000);
  const sql = `
    SELECT * FROM vip_users 
    WHERE sid = ? AND (expires IS NULL OR expires > ?)
    LIMIT 1
  `;
  const [rows] = await pool.query(sql, [sid, now]);
  return rows.length > 0 ? rows[0] : null;
}

module.exports = {
  banUser,
  unbanUser,
  isUserBanned,

  muteUser,
  unmuteUser,
  isUserMuted,

  giveVip,
  removeVip,
  isUserVip,
};
