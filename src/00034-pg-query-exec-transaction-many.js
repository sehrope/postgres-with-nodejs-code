const { main, createPool, sleep } = require('./util/main');
const { createQueryExecutor } = require('pg-query-exec');

const pool = createPool();

// Create pg-query-exec singleton:
const db = createQueryExecutor(pool);

const getTransactionId = () => {
    const sql = 'SELECT txid_current() AS tx_id';
    return db.queryOne(sql, [], 'tx_id');
}

const doSomething = async (name) => {
    const txId = await getTransactionId();
    console.log('  [%s] Called doSomething()  - txId=%s', name, txId);
    // Pretend we're slow...
    await sleep(250);
}

const doOtherThing = async (name) => {
    const txId = await getTransactionId();
    console.log('  [%s] Called doOtherThing() - txId=%s', name, txId);
    // Pretend we're slow...
    await sleep(250);
}

const someUnitOfWork = async (name) => {
    console.log('Started task name=%s', name)
    await db.tx(async () => {
        await doSomething(name);        
        await doOtherThing(name);
        await doSomething(name);
        await doOtherThing(name);
    });
    console.log('Finished task name=%s', name)
}

main(async () => {
    const tasks = [];
    for(let i=0;i<5;i++) {
        const task = someUnitOfWork('test-' + i);
        tasks.push(task);
    }

    await Promise.all(tasks);
});
