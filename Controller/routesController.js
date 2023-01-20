const route = require('express').Router();
const mongoose = require('mongoose');



route.get('/', (req, res) => {
    res.send({ message: 'hello from server' });
});

module.exports = route;