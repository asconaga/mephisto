const express = require("express");
const router = express.Router();

const xml2js = require("xml2js");

const { v4: uuidv4 } = require('uuid');

const flatDB = require('node-flat-db')
const storage = require('node-flat-db/file-sync');

class Book {
    constructor(title, detail) {
        this.id = uuidv4();
        this.title = title;
        this.detail = detail;
    }
}

const db = flatDB('db/db.json', { storage })

router
    .route('/')

    .get((req, res) => {
        const pStatus = res.status(200);

        let szRet = "";

        const dbBooks = db("books").value();

        let szCT = req.headers["content-type"];

        console.log("Content-Type => " + szCT);

        if (szCT === "application/xml") {
            const builder = new xml2js.Builder({ explicitChildren: true });

            res.contentType = "application/xml";
            res.setHeader("Content-Type", "application/xml");                       

            let rootLocal = { "root": { "books": dbBooks } };

            szRet = builder.buildObject(rootLocal);
        }
        else {
            szRet = JSON.stringify(dbBooks);
        }

        pStatus.send(szRet);
    })

    .post((req, res) => {
        let status = 400;
        let szMessage = "Incorrect object definition";

        let szCTraw = req.headers["content-type"];

        const arrCT = szCTraw.split(';');

        let szCT = arrCT[0];

        console.log(szCT);

        if (szCT === "application/json") {
            let body = {};

            let bIsValid = true;

            try {
                body = JSON.parse(req.body);
            } catch (err) {
                szMessage = err.message;
                bIsValid = false;
            }

            if (bIsValid) {
                if (body.title && body.detail) {
                    status = 200;

                    const newBook = new Book(body.title, body.detail);

                    db('books').push(newBook);

                    szMessage = JSON.stringify(newBook);
                }
            }
        }
        else if (szCT === "application/xml") {
            try {
                xml2js.parseString(req.body, { explicitRoot: false, explicitArray: false }, function (err, body) {
                    if (body.title && body.detail) {
                        status = 200;

                        const newBook = new Book(body.title, body.detail);

                        db('books').push(newBook);

                        const builder = new xml2js.Builder({ explicitChildren: true });

                        szMessage = builder.buildObject(newBook);
                    };
                })
            } catch (err) {
                szMessage = err.message;
            }
        }

        const pStatus = res.status(status);

        pStatus.send(szMessage);
    })

    .delete((req, res) => {

        db.object.books = [];
        db.write();

        const pStatus = res.status(200);

        pStatus.send("<p>all deleted</p>");
    });

router
    .route('/:id')

    .get((req, res) => {
        const { id } = req.params;

        let szRet = "";

        let szCT = req.headers["content-type"];

        let foundBook = db('books').find({ id: id });

        let status = 404;

        if (foundBook !== undefined) {
            status = 200;
        }
        else {
            foundBook = {};
        }

        if (szCT === "application/xml") {
            const builder = new xml2js.Builder({ explicitChildren: true });

            res.contentType = "application/xml";
            res.setHeader("Content-Type", "application/xml");            

            let rootLocal = { "books": foundBook };

            szRet = builder.buildObject(rootLocal);
        }
        else {
            szRet = JSON.stringify(foundBook);
        }

        const pStatus = res.status(status);

        pStatus.send(szRet);
    })

    .delete((req, res) => {
        const { id } = req.params;

        let retval = db('books').remove({ id: id })
    
        const pStatus = res.status(retval.length === 0 ? 404 : 200);

        pStatus.send(JSON.stringify(retval));
    });

module.exports = router;