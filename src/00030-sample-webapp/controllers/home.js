const { asyncWrap } = require('../utils/express-utils');
const Person = require('../models/Person');

module.exports.showHome = asyncWrap(async (req, res) => {
    const personList = await Person.findAll();
    const model = {
        title: 'Home',
        personList,
    }
    res.render('home', model);
});
