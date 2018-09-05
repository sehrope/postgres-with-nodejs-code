const { main, sleep } = require('./util/main');
const pg = require('pg');
const { types } = pg;

const INT8_OID = 20;

// Override type handling for bigint
types.setTypeParser(INT8_OID, function (text) {
    // Convert text to a Number:
    return parseInt(text);
})

main(async () => {
    // Manually create a client
    const client = new pg.Client(process.env.DATABASE_URL);
    await client.connect();

    const sql = 'SELECT COUNT(*) AS num_persons FROM person';
    const result = await client.query(sql);
    console.log('Row: %j', result.rows[0]);
});
