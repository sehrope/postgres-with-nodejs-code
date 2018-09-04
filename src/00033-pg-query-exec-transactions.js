const { main, createPool } = require('./util/main');
const { createQueryExecutor } = require('pg-query-exec');

const pool = createPool();

// Create pg-query-exec singleton:
const db = createQueryExecutor(pool);

const getTransactionId = () => {
    const sql = 'SELECT txid_current() AS tx_id';
    return db.queryOne(sql, [], 'tx_id');
}

const doSomething = async () => {
    const txId = await getTransactionId();
    console.log('  Called doSomething()  - txId=%s', txId);
}

const doOtherThing = async () => {
    const txId = await getTransactionId();
    console.log('  Called doOtherThing() - txId=%s', txId);
}

main(async () => {
    console.log('Not in transaction:');
    await doSomething();
    await doOtherThing();

    console.log();

    console.log('In transaction:');
    await db.tx(async () => {
        await doSomething();
        await doOtherThing();
    });
});
