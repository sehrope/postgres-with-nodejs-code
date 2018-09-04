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
        WHERE p.name = $1`;
    const getPerson = async (name) => {
        // Create a named prepared statement that will be reused
        const result = await client.query({
            // Some name that is unique within our app
            name: 'Get-User',
            // The SQL we'll be running
            text: sql,
            // The parameters ... this can vary in different parts of your app
            values: [name]
        });
        const rows = result.rows;
        if (rows.length !== 1) {
            return null;
        }
        return rows[0];
    }

    const alice = await getPerson('Alice');
    const bob = await getPerson('Bob');
    const carl = await getPerson('Carl');
    const missing = await getPerson('Some Name That Does Not Exist');

    console.log('Alice:', alice);
    console.log('Bob:', bob);
    console.log('Carl:', carl);
    console.log('Missing:', missing);
});
