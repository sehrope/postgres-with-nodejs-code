const { main, sleep } = require('./util/main');
const pg = require('pg');

main(async () => {
    // Manually create a client
    const client = new pg.Client(process.env.DATABASE_URL);

    // Connect the client
    await client.connect();

    const sql = `
        SELECT p.*
        FROM person p
        WHERE p.name = ANY($1::text[])`;

    const params = [
        // Driver converts this to {Alice,Bob,Carl}
        ['Alice', 'Bob', 'Carl']
    ];
    const result = await client.query(sql, params);
    result.rows.forEach((row, index) => {
        console.log('ROW[%s] - %j', index, row);
    }) 
});
