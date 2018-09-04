const { main, sleep } = require('./util/main');
const pg = require('pg');

main(async () => {
    // Manually create a client
    const client = new pg.Client(process.env.DATABASE_URL);

    // Connect the client
    await client.connect();

    const sql = `
        SELECT
          now()        AS date_value,
          now()::text  AS text_value`
    const result = await client.query(sql);
    const row = result.rows[0];

    const dateValue = row.date_value;
    const textValue = row.text_value;

    console.log('dateValue: %s', dateValue.toISOString());
    console.log('textValue: %s', textValue);
});
