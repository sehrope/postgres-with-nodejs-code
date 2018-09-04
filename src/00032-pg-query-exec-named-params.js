const { main, createPool } = require('./util/main');
const { createQueryExecutor } = require('pg-query-exec');

const pool = createPool();

// Create pg-query-exec singleton:
const db = createQueryExecutor(pool);

const findPersonByName = (name) => {
    const sql = `
        SELECT p.*
        FROM person p
        WHERE p.name = :name`;
    return db.queryOne(sql, { name });
}

const createJob = ({ name, isOfficer }) => {
    const sql = `
        INSERT INTO job
          (name, is_officer)
        VALUES
          (:name, :isOfficer)
        RETURNING id`
    const params = {
        name,
        isOfficer,
    }
    // We're using queryOne(...) to access the RETURNING clause
    return db.queryOne(sql, params, 'id');
}

main(async () => {
    const alice = await findPersonByName('Alice');
    console.log('Alice: %j', alice);

    console.log();

    const jobId = await createJob({
        name: 'Programmer',
        isOfficer: false,
    });
    console.log('Created job: %s', jobId);
});
