require('dotenv').config();
const app = require('./app');
const port = process.env.PORT || 5000

const panic = (err) => {
    console.error(err);
    process.exit(1);
}

app.listen(port, (err) => {
    if (err) {
        return panic(err);
    }
    console.log('Listening on port %s', port);
});
