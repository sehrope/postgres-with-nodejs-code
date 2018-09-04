const { main, createPool } = require('./util/main');

const pool = createPool();

function search(opts) {
    const whereClauses = [];
    const params = [];
    // Pushes value to array and returns $1, $2, ... etc
    const addParam = (value) => {
        params.push(value);
        return '$' + params.length;
    }
    if (opts.name) {
        const param = addParam(opts.name);
        whereClauses.push(`p.name = ${param}`);
    }
    if (opts.maxCreatedAt) {
        const param = addParam(opts.maxCreatedAt);
        whereClauses.push(`p.created_at <  ${param}`);
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
    return pool.query(sql, params).then((result) => result.rows);
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
