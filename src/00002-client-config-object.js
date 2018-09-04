const { main } = require('./util/main');
const pg = require('pg');
const url = require('url');

main(async () => {
    const databaseUrl = url.parse(process.env.DATABASE_URL);
    
    // Manually create a client
    const client = new pg.Client({
        host: databaseUrl.hostname,                 // localhost
        port: databaseUrl.port || 5432,             // 25432
        database: databaseUrl.pathname.substring(1),// app
        user: databaseUrl.auth.split(':')[0],       // user
        password: databaseUrl.auth.split(':')[1],   // password
        ssl: true,
    });

    // Connect the client
    await client.connect();
    console.log('Created client');

    // Make sure to close the client
    await client.end();
    console.log('Closed client');
});
