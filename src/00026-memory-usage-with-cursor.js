const pg = require('pg');
const { main } = require('./util/main');
const Cursor = require('pg-cursor');

// Make a Promise wrapper for cursor
const readCursor = (cursor, rowCount) => {
    return new Promise((resolve, reject) => {
        cursor.read(rowCount, (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

main(async () => {
    const client = new pg.Client(process.env.DATABASE_URL);
    await client.connect();

    const printMemory = (title) => {
        console.log('Memory Usage - %s', title);
        const usage = process.memoryUsage();
        Object.keys(usage).forEach((key) => {
            console.log(`  ${key} ${Math.round(usage[key] / 1024 / 1024 * 100) / 100} MB`);
        });
    }

    const numRows = 10;
    const sql = `
        SELECT
          x,
          c.*
        FROM information_schema.columns c
           , generate_series(1, $1) x`;
    const params = [numRows];

    printMemory('BEFORE');
    // Create the cursor
    const cursor = new Cursor(sql, params);
    // Submit the query
    client.query(cursor);
    let count = 0;
    // Loop through results
    do {
        const rows = await readCursor(cursor, 100);
        if (rows.length === 0) {
            break;
        }
        count += rows.length;
        console.log('Read %s rows (%s total so far)', rows.length, count);
    } while (true);
    printMemory('AFTER');
});
