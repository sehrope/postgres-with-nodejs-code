const { main, sleep } = require('./util/main');
const pg = require('pg');

main(async () => {
    // Manually create a client
    const client = new pg.Client(process.env.DATABASE_URL);

    // Connect the client
    await client.connect();

    const sql = `
        SELECT
          p.*,
          (SELECT json_agg(t.*)
           FROM (
             SELECT j.*
             FROM person_job pj
               JOIN job j ON j.id = pj.job_id
             WHERE pj.person_id = p.id
             ORDER BY j.name) t) AS jobs
        FROM person p
        WHERE p.name IN ('Alice', 'Bob', 'Carl')`;
    const result = await client.query(sql);
    for(const row of result.rows) {
        console.log('ID   : %s', row.id);
        console.log('Name : %s', row.name);
        console.log('Jobs : %s', JSON.stringify(row.jobs, null, '  '));
    }
});
