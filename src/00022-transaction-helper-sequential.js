const { main, createPool } = require('./util/main');



main(async () => {
    const pool = createPool();

    // work: (client: pg.Client) => Promise<any>
    const runTransaction = async (work) => {
        const client = await pool.connect();
        try {
            // Start the transaction
            await client.query('BEGIN');
            // Run the transactional work
            const taskResult = await work(client);
            // All our work is done so try to COMMIT
            await client.query('COMMIT');
            // Release connection back to pool for reuse
            await client.release();
            // Return result to caller
            return taskResult;
        } catch (err) {
            // An error occurred somewhere so try to rollback
            try {
                await client.query('ROLLBACK');
                // Rollback success so release back to pool
                await client.release();
            } catch (rollbackErr) {
                console.error('ROLLBACK Error: %s', rollbackErr);
                // Rollback error so consider the connection broken
                await client.release(rollbackErr);
            }
            throw err;
        }
    }

    await runTransaction(async (client) => {
        console.log('Starting work #1');
        const sql = 'SELECT txid_current() AS tx_id';
        for (let i = 0; i < 10; i++) {
            const result = await client.query(sql);
            const transactionId = result.rows[0].tx_id;
            console.log('  i=%s - transactionId => %s', i, transactionId);
        }
    });

    const x = await runTransaction(async (client) => {
        console.log('Starting work #2');
        const sql = 'SELECT txid_current() AS tx_id';
        let transactionId;
        for (let i = 0; i < 10; i++) {
            const result = await client.query(sql);
            transactionId = result.rows[0].tx_id;
            console.log('  i=%s - transactionId => %s', i, transactionId);
        }
        return transactionId;
    });
    console.log('Transaction result: %s', x);
});
