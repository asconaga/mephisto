'use strict';
const express = require('express');
const process = require('process');

const app = express();
const port = process.env.PORT || 1337;

app.set('view engine', 'ejs');

const routes = require('./routes');

// permit any files to be processed
app.use(express.text({ type: '*/*' }));

// permit access to static files in the public folder as /static
app.use(express.static('public'));
app.use('/static', express.static('public'));

//app.use(express.json());

app.use(function timeLog(req, res, next) {
    console.log(`Request type: ${req.method} - from: ${req.originalUrl} @ ${Date.now()}`);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use('/', routes());

app.listen(port);

