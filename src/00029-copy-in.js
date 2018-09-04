const { main } = require('./util/main');
const pg = require('pg');
const copyFrom = require('pg-copy-streams').from;
const util = require('util');

function streamToPromise(stream) {
    return new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
    });
}

main(async () => {
    const client = new pg.Client(process.env.DATABASE_URL);
    await client.connect();

    const createTable = `
        CREATE TEMPORARY TABLE pg_temp.copy_test (
            a      int,
            b      text
        )`
    await client.query(createTable);

    const sql = `
        COPY pg_temp.copy_test
        FROM STDIN
        WITH (FORMAT CSV)`;
    const copy = client.query(copyFrom(sql));
    for(let i=0;i<100000;i++) {
        const line = util.format('%s,%s', i, 'testing-' + i);
        copy.write(line);
        copy.write('\n');
    }
    copy.end();
    await streamToPromise(copy);
    console.log('COPY IN processed a total of %s rows', copy.rowCount);

    const countSql = `
        SELECT
          COUNT(*)::int AS count
        FROM pg_temp.copy_test`
    const countResult = await client.query(countSql);
    const numRows = countResult.rows[0].count;
    console.log('Number rows in table: %s', numRows);
});
