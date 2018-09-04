const dotenv = require('dotenv');
const url = require('url');
const pg = require('pg');

const ensureEnvVar = (name) => {
    const value = process.env[name];
    if (value === null || value === undefined) {
        throw new Error('Missing required environment variable: ' + name);
    }
}

try {
    // Load .env file
    dotenv.config();

    // Ensure we have the variables we know we need
    ensureEnvVar('DATABASE_URL');
} catch (err) {
    // Oops ... so show a stack trace
    console.error('%s', err.stack);

    // And finally exit with a failure code
    process.exit(1);
}

const main = async (task) => {
    try {
        // Run the main task for this program
        await task();

        // Task completed successfully so exit with success
        process.exit(0);
    } catch (err) {
        // Oops ... so show a stack trace
        console.error('%s', err.stack);

        // And finally exit with a failure code
        process.exit(1);
    }
}

const createPool = (opts = {}) => {
    const databaseUrl = url.parse(process.env.DATABASE_URL);
    return new pg.Pool({
        host: databaseUrl.hostname,                 // localhost
        port: databaseUrl.port || 5432,             // 25432
        database: databaseUrl.pathname.substring(1),// app
        user: databaseUrl.auth.split(':')[0],       // user
        password: databaseUrl.auth.split(':')[1],   // password
        ssl: true,
        ...opts
    });
}

const sleep = (millis) => new Promise((resolve) => {
    setTimeout(resolve, millis);
})

module.exports = {
    main,
    sleep,
    createPool,
};
