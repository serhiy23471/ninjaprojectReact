const mysql = require('mysql2/promise');
const path = require('path');

const config = require(path.resolve(__dirname, '../../config.json'));

const pool = mysql.createPool(config.DB);

async function query(sql, params) {
    let connection = await pool.getConnection();
    try {
        let results = await connection.execute(sql, params);
        results = results[0];
        return results;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    query
};
