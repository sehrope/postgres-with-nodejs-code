const { main, createPool } = require('./util/main');
const { createQueryExecutor } = require('pg-query-exec');

// Underlying pool:
const pool = createPool();

// Create pg-query-exec wrapper:
const db = createQueryExecutor(pool);

main(async () => {
    // query(...) returns an array of rows
    const listOfRows = await db.query('SELECT * FROM generate_series(1, 10) x');
    console.log('listOfRows: %j', listOfRows);

    // queryOne(...) returns a single row
    const singleRow = await db.queryOne(`SELECT * FROM person WHERE name = 'Alice'`);
    console.log('singleRow: %j', singleRow);

    const insertCount = await db.update(`INSERT INTO person (name) VALUES ('Test-' || random())`);
    console.log('insertCount: %s', insertCount);
});
