const { asyncWrap, asyncWrapParam, createError } = require('../utils/express-utils');
const Person = require('../models/Person');

module.exports.populatePerson = asyncWrapParam(async (req, res, next, personId) => {
    const person = await Person.findOne(personId);
    if (!person) {
        throw createError(404, 'No person found with id: ' + personId);
    }
    console.log('person:', person);
    req.params.person = person;
    return next();
});

module.exports.showPerson = asyncWrap(async (req, res) => {
    const { person } = req.params;
    res.render('person', {
        title: 'Person: ' + person.name,
        person,
    })
});
