const { main, sleep } = require('./util/main');
const pg = require('pg');

main(async () => {
    // Manually create a client
    const client = new pg.Client(process.env.DATABASE_URL);

    console.log('Before connect');
    // Connect but do not actually wait for connection
    // NOTE: This is usually a bad idea as errors are not handled
    client.connect();

    console.log('Before issue commands');
    // Issue some commands and let them be queued up
    const tasks = [
        client.query('SELECT 1 AS x').then((result) => console.log('%j', result.rows[0])),
        client.query('SELECT 2 AS x').then((result) => console.log('%j', result.rows[0])),
        client.query('SELECT 3 AS x').then((result) => console.log('%j', result.rows[0])),
    ];
    console.log('After issue commands');

    // Wait for commands to complete
    await Promise.all(tasks);
});
