const { main, sleep } = require('./util/main');
const pg = require('pg');

main(async () => {
    // Manually create a client
    const client = new pg.Client(process.env.DATABASE_URL);

    // Connect the client
    await client.connect();

    // Create a test table
    await client.query(`
        CREATE TABLE pg_temp.json_test (
            id    serial PRIMARY KEY,
            data  json NOT NULL
        )`);
    
    const insertSql = `
        INSERT INTO pg_temp.json_test
          (data)
        VALUES
          ($1)`;
    const obj = {
        foo: 123,
        bar: 'test',
        baz: [1,2,3],
    };
    const arrayOfObjects = [
        obj,
        obj,
        obj
    ]
    
    const params = [
        // Explicitly convert to JSON to skip array processing:
        JSON.stringify(arrayOfObjects)
    ]
    const insertResult = await client.query(insertSql, params);
    console.log('Inserted %s rows', insertResult.rowCount);

    const selectSql = `
        SELECT t.*
        FROM pg_temp.json_test t`
    const result = await client.query(selectSql);
    result.rows.forEach((row, index) => {
        console.log('ROW[%s]: %s', index, JSON.stringify(row, null, '  '));
    }) 
});
