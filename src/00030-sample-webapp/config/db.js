const url = require('url');
const pg = require('pg');

const createPool = () => {
    const databaseUrl = url.parse(process.env.DATABASE_URL);
    // Manually create a client
    return new pg.Pool({
        host: databaseUrl.hostname,                 // localhost
        port: databaseUrl.port || 5432,             // 25432
        database: databaseUrl.pathname.substring(1),// app
        user: databaseUrl.auth.split(':')[0],       // user
        password: databaseUrl.auth.split(':')[1],   // password
        ssl: true,
    });
}

// The one and only pool for our app:
const pool = createPool()

// Our wrappers
const query = (sql, params) => pool.query(sql, params);
const connect = () => pool.connect();

// A wrapper that also adds some logging
const queryWithLogging = async (sql, params) => {
    const start = Date.now();
    try {
        return (await pool.query(sql, params));
    } finally {
        const elapsed = Date.now() - start;
        console.log('Executed:');
        console.log('  SQL     = %j', sql);
        console.log('  Elapsed = %s', elapsed);
    }
}

module.exports = {
    query,
    connect,
}
