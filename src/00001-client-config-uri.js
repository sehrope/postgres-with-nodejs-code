const { main, sleep } = require('./util/main');
const pg = require('pg');

main(async () => {
    // Manually create a client
    const client = new pg.Client(process.env.DATABASE_URL);

    // Connect the client
    await client.connect();
    console.log('Created client');

    await sleep(5000);

    // Make sure to close the client
    await client.end();
    console.log('Closed client');
});
