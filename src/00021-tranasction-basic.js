const { main, createPool } = require('./util/main');

main(async () => {
    const pool = createPool();

    const client = await pool.connect();
    try {
        // Start the transaction
        await client.query('BEGIN');

        const sql = 'SELECT txid_current() AS tx_id';
        for (let i = 0; i < 10; i++) {
            const result = await client.query(sql);
            const transactionId = result.rows[0].tx_id;
            console.log('i=%s - transactionId => %s', i, transactionId);
        }

        // All our work is done so try to COMMIT
        await client.query('COMMIT');
        // Everything succeeed so return to pool
        await client.release();
    } catch (err) {
        // An error occurred somewhere so try to rollback
        try {
            await client.query('ROLLBACK');
            // NOTE: We could choose to release to pool here
        } catch (rollbackErr) {
            console.error('ROLLBACK Error: %s', rollbackErr);
        }
        await client.release(rollbackErr);
        throw err;
    }
});
