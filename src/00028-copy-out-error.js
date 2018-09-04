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
            1 / (x - 5) AS y,
            c.*
          FROM information_schema.columns c
             , generate_series(1, 10) x)
        TO STDOUT
        WITH (FORMAT CSV)`;
    const copy = client.query(copyOut(sql));
    try {
        await pipeStream(copy, process.stdout);
    } catch (copyErr) {
        console.error("=================");
        console.error('Error processing copy: %s', copyErr.stack);        
    }
    console.log('Processed a total of %s rows', copy.rowCount);
});
