const admins = [
    '76561198191272828', // Asuna
    '76561199171046318', // Котяра
    '76561199231638715', // MaXoN4eK 
    '76561198798399028'  // essenty
];

function adminCheck(req, res, next) {
    const steamid = req.session?.steamid;
    if (steamid && admins.includes(steamid)) {
        req.isAdmin = true;
    } else {
        req.isAdmin = false;
    }
    next();
}

module.exports = adminCheck;
