const express = require('express');
const path = require('path');

// Controllers
const cHome = require('./controllers/home');
const cPerson = require('./controllers/person');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Add middleware
app.use(require('morgan')('combined'));
app.param('person', cPerson.populatePerson);

// Add routes
app.get('/', cHome.showHome);
app.get('/person/:person', cPerson.showPerson);

// Catch-all 404 handler
app.use((req, res, next) => {
    res.sendStatus(404);
});

// Catch-all error handler
app.use((err, req, res, next) => {
    console.error('Error procesing request:', err);
    res.status(500);
    res.render('error', {
        title: 'Error',
        err,
    });
});

module.exports = app
