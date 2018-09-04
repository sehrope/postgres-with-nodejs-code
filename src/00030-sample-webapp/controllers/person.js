const { asyncWrap, asyncWrapParam, createError } = require('../utils/express-utils');
const Person = require('../models/Person');
const db = require('../config/db');
const copyOut = require('pg-copy-streams').to;

const populatePerson = asyncWrapParam(async (req, res, next, personId) => {
    const person = await Person.findOne(personId);
    if (!person) {
        throw createError(404, 'No person found with id: ' + personId);
    }
    req.params.person = person;
    return next();
});

const showPerson = asyncWrap(async (req, res) => {
    const { person } = req.params;
    res.render('person', {
        title: 'Person: ' + person.name,
        person,
    })
});

function pipeStream(source, dest) {
    return new Promise((resolve, reject) => {
        source.pipe(dest);
        source.on('end', resolve);
        source.on('error', reject);
        dest.on('error', reject);
    });
}

const download = asyncWrap(async (req, res) => {
    const client = await db.connect();
    try {
        const copySql = `
           COPY (
               SELECT
                 x,
                 p.*
               FROM person p,
                 -- Pretend we have lots of data
                 generate_series(1,100) x
               ORDER BY p.id
           )
           TO STDOUT
           WITH (FORMAT CSV, HEADER)`;
        const copy = client.query(copyOut(copySql));
        res.status(200);
        res.setHeader('Content-Type', 'text/plain');
        // Replace with this to get a downloadable CSV:
        // res.setHeader('Content-Type', 'test/csv');
        // res.setHeader('Content-Disposition', 'attachment; filename=person.csv');
        await pipeStream(copy, res);
        await client.release();
    } catch (err) {
        await client.release(err);
        throw err;
    }
});

module.exports = {
    populatePerson,
    showPerson,
    download,
}
