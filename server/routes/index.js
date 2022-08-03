const express = require('express');

const router = express.Router();

const { v4: uuidv4 } = require('uuid');

const bookRouter = require('./books');
const servicesRouter = require('./services');
const adminRouter = require('./admin');

class Util {

    constructor() {
     
        this.id = 1;
        this.uuidv4 = uuidv4;

        this['tabAdmin'] = 'admin';
        this['tabServices'] = 'services';
    }

    makePretty(jsonObj) {
        return JSON.stringify(jsonObj, null, 4);
    }

    makeMessage(szMessage) {
        return { message: szMessage };
    }

    static count = 2112;
 
    static helper() {
        console.log("hi i am the helper");
    }  
  }

// we pass this obj down to the routes
let utilObj = new Util();

module.exports = params => {
    router.get('/', (req, res) => {
        const pStatus = res.status(200);

        res.render('index', { title: "Mephisto - MAL Server", header: "MAL" });
    });

    router.use('/api/books', bookRouter);
    router.use('/api/services', servicesRouter(utilObj));
    router.use('/api/admin', adminRouter(utilObj));

    // Util.helper(); // staic call

    // console.log(Util.count); // static call

    return router;
};
