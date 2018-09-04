const db = require('../config/db');

module.exports.findOne = async (personId) => {
    const sql = `
        SELECT
            p.*
        FROM person p
        WHERE p.id = $1`;
    const result = await db.query(sql, [personId]);
    return result.rows[0];
}

module.exports.findAll = async () => {
    const sql = `
        SELECT
            p.*
        FROM person p
        ORDER BY p.name`;
    const result = await db.query(sql);
    return result.rows;
}
