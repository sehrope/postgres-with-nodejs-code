const { main, createPool, sleep } = require('./util/main');

main(async () => {
    // Whether to listen and handle pool errors
    const enablePoolErrorHandler = false;

    const pool = createPool({
        // Increase to 5-minutes:
        idleTimeoutMillis: 5 * 60 * 1000,
    });

    if (enablePoolErrorHandler) {
        pool.on('error', (err) => {
            console.log('An error occurred in one of our pooled connections');
            console.log('%s', err.stack);
        });
    }

    // Run anything to get at least one connection in pool
    const result = await pool.query('SELECT pg_backend_pid() AS pid');
    const pid = result.rows[0].pid;
    console.log('Backend PID: %s', pid);
    console.log('Terminate via:\n\n\tSELECT pg_terminate_backend(%s);\n', pid);

    while (true) {
        console.log('%s - Sleeping for a bit...', new Date());
        await sleep(1000);
    }
});
