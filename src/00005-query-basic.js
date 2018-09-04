const { main, sleep } = require('./util/main');
const pg = require('pg');

main(async () => {
    // Manually create a client
    const client = new pg.Client(process.env.DATABASE_URL);

    // Connect the client
    await client.connect();

    const selectSql = `
        SELECT
          x AS foo,
          ('test-' || x) AS bar
        FROM generate_series(1, 10) x
        `
    const selectResult = await client.query(selectSql);
    console.log('Success executing SELECT:');
    console.log('  Fields: %s', JSON.stringify(selectResult.fields, null, '  '));
    selectResult.rows.forEach((row, index) => {
        console.log('  ROW[%s] = %j', index, row);
    })

    console.log();

    const insertSql = `
        INSERT INTO person
          (name)
        SELECT 'test-' || COUNT(*)
        FROM person`;
    const insertResult = await client.query(insertSql);
    console.log('Success executing INSERT:');
    console.log('  Inserted %s rows', insertResult.rowCount);

    console.log();

    const insertReturningSql = `
    INSERT INTO person
      (name)
    SELECT 'test-' || COUNT(*)
    FROM person
    RETURNING (id, created_at)
    `;
    const insertReturningResult = await client.query(insertReturningSql);
    console.log('Success executing INSERT with RETURNING clause:');
    console.log('  Inserted %s rows', insertReturningResult.rowCount);
    console.log('  Row: ', insertReturningResult.rows[0]);

    console.log();

    // We're purposefully inserting a duplicate id.
    // This will violate the PRIMARY KEY constraint.
    const badSql = `
        INSERT INTO person
          (id, name)
        SELECT
          p.id,
          p.name
        FROM person p
        WHERE p.name = 'Alice'`
    try {
        await client.query(badSql);
    } catch (err) {
        console.log('Error executing command:');
        for (const key of Object.keys(err)) {
            console.log('  %s => %s', key, err[key]);
        }
    }
});
