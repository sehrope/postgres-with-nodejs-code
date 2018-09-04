const { main, sleep } = require('./util/main');
const pg = require('pg');

main(async () => {
    // Manually create a client
    const client = new pg.Client(process.env.DATABASE_URL);

    // Connect the client
    await client.connect();

    const sql = `
        SELECT *
        FROM information_schema.columns
        WHERE table_catalog = $1
          AND table_schema = $2
          AND table_name = $3`;

    const params = [
        'app',
        'public',
        'person',
    ];
    const result = await client.query(sql, params);
    console.log(result.rows[0]);
});
