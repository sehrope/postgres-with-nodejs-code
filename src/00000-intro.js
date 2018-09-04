const { main } = require('./util/main');

main(async () => {
    if (Math.random() < .5) {
        throw new Error('Simulated error!');
    }
    console.log('Great success!');
});
