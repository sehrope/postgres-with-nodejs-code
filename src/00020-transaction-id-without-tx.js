const { main, createPool } = require('./util/main');

main(async () => {
    const pool = createPool();

    const sql = 'SELECT txid_current() AS tx_id';
    for (let i = 0; i < 10; i++) {
        const result = await pool.query(sql);
        const transactionId = result.rows[0].tx_id;
        console.log('i=%s - transactionId => %s', i, transactionId);
    }
});
