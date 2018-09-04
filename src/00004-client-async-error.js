const { main, sleep } = require('./util/main');
const pg = require('pg');

main(async () => {
    // Manually create a client
    const client = new pg.Client(process.env.DATABASE_URL);

    // Connect the client
    await client.connect();
    console.log('Created client');

    // Handle out of band errors
    client.on('error', (err) => {
        console.error('Gracefully handling client error: %s', err.stack);
        process.exit(1);
    });

    const pid = (await client.query('SELECT pg_backend_pid() AS pid')).rows[0].pid;
    console.log('Backend PID: %s', pid);
    console.log('Terminate via:\n\n\tSELECT pg_terminate_backend(%s);\n', pid);
   
    while (true) {
        console.log('%s - Sleeping for a bit...', new Date());
        await sleep(1000);
    }
});
