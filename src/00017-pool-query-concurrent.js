const { main, createPool } = require('./util/main');

main(async () => {
    const MAX_POOL_SIZE = 5;
    const NUM_TASKS = 25;

    const pool = createPool({
        max: MAX_POOL_SIZE,
    });

    const tasks = [];
    for (let i = 0; i < NUM_TASKS; i++) {
        const sql = `
            SELECT
              pg_backend_pid() AS pid,
              'test-' || $1 AS x`;
        const task = pool.query(sql, [i]);
        tasks.push(task);
    }
    const results = await Promise.all(tasks);
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
