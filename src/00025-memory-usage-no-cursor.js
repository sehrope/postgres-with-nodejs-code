const { main } = require('./util/main');
const pg = require('pg');

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
    const result = await client.query(sql, params);
    console.log('Query completed');
    console.log('  # Rows: %s', result.rows.length);
    printMemory('AFTER');
});
