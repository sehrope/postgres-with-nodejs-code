const { main, createPool } = require('./util/main');
const { createQueryExecutor } = require('pg-query-exec');

// Underlying pool:
const pool = createPool();

// Create pg-query-exec wrapper:
const db = createQueryExecutor(pool);

function search(opts) {
    const whereClauses = [];
    const params = {
        ...opts || {},
    };
    if (opts.name) {
        whereClauses.push(`p.name = :name`);
    }
    if (opts.maxCreatedAt) {
        whereClauses.push(`p.created_at < :maxCreatedAt`);
    }
    const sql = [
        'SELECT p.*',
        'FROM person p',
        whereClauses.length === 0 
            ? ''
            : 'WHERE ' + whereClauses.join('\n  AND ')
    ].join('\n');
    console.log('Opts:', opts);
    console.log('Generated SQL:');
    console.log('%s', sql);
    console.log('Params:', params);
    return db.query(sql, params);
}

main(async () => {
    let list;

    list = await search({
        name: 'Alice',
    });
    console.log('Result: %j', list);

    list = await search({
        name: 'Alice',
        maxCreatedAt: new Date(),
    });
    console.log('Result: %j', list);
});
