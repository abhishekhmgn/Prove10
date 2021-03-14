const { json } = require('body-parser');
const dummyData = require('../data/pr10-data.json');

exports.getData = (req, res, next) => {

    res.render('pages/pr10', {
        title: 'PR 10',
        path: '/10'
    });
};

exports.fetch = (req, res, next) => {
    res.json(dummyData);
};

exports.insert = (req, res, next) => {
    const name = req.body.name;

    if (!dummyData.avengers.some(i => i.name === name)) {
        dummyData.avengers.push({ name });
    }

    res.json(dummyData);
};