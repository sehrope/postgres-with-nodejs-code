const pg = require('pg');
const { main, createPool } = require('./util/main');

main(async () => {
    const SHOULD_USE_POOL = false;
    const MAX_POOL_SIZE = 5;
    const NUM_TASKS = 250;

    const pool = createPool({
        max: MAX_POOL_SIZE,
    });

    const runPoolQuery = (sql, params) => {
        return pool.query(sql, params);
    }

    const runNonPoolQuery = async (sql, params) => {
        const client = new pg.Client(process.env.DATABASE_URL);
        try {
            await client.connect();
            // We await here to ensure the finally block
            // happens after the query has completed.
            return (await client.query(sql, params));
        } finally {
            await client.end();
        }
    }

    const runQuery = SHOULD_USE_POOL
        ? runPoolQuery
        : runNonPoolQuery;

    const results = [];
    for (let i = 0; i < NUM_TASKS; i++) {
        const sql = `
            SELECT
              pg_backend_pid() AS pid,
              'test-' || $1 AS x`;
        const result = await runQuery(sql, [i]);
        results.push(result);
    }
    console.log('Results:')
    results.forEach((result, index) => {
        const { pid, x } = result.rows[0];
        console.log('  Result[%s] - pid=%s x=%s', index, pid, x);
    })

    const pids = results.map((result) => result.rows[0].pid);
    const uniquePids = pids.filter((pid, index) => pids.indexOf(pid) === index);
    console.log('Backends:')
    uniquePids.forEach((pid, index) => {
        console.log('  Backend[%s] - %s', index, pid);
    })
});
