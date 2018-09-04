const { main, sleep, createPool } = require('./util/main');
const pg = require('pg');

main(async () => {
    const pool = createPool();

    const printMemory = (title) => {
        console.log('Memory Usage - %s', title);
        const usage = process.memoryUsage();
        Object.keys(usage).forEach((key) => {
            console.log(`  ${key} ${Math.round(usage[key] / 1024 / 1024 * 100) / 100} MB`);
        });
    }

    printMemory('BEFORE');
    // Allocate a 100MB buffer
    const buf = Buffer.alloc(100 * 1024 * 1024);
    buf.fill('x', 0, buf.length);
    // Convert our buffer to a string
    const text = buf.toString('utf8');
    printMemory('AFTER');
});
