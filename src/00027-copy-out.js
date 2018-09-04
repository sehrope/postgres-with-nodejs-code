const { main } = require('./util/main');
const pg = require('pg');
const copyOut = require('pg-copy-streams').to;

function pipeStream(source, dest) {
    return new Promise((resolve, reject) => {
        source.pipe(dest);
        source.on('end', resolve);
        source.on('error', reject);
    });
}

main(async () => {
    const client = new pg.Client(process.env.DATABASE_URL);
    await client.connect();

    const sql = `
        COPY (
          SELECT
            x,
            c.*
          FROM information_schema.columns c
             , generate_series(1, 10) x)
        TO STDOUT
        WITH (FORMAT CSV)`;
    const copy = client.query(copyOut(sql));
    await pipeStream(copy, process.stdout);
    console.log('Processed a total of %s rows', copy.rowCount);
});
