const express = require("express");
const router = express.Router();

const AdminController = require("./controllers/adminController");

module.exports = (utilObj) => {
    const pool = {};
    let idTop = 0;

    const handlePoll = (req, res) => {
        let newObj = { res: res, id: ++idTop };

        if (req.query.key) {
            let index = req.query.key;

            newObj.origin = req.get('host');

            console.log(newObj.origin);

            if (pool[index] === undefined) {
                pool[index] = [];
            }

            pool[index].push(newObj);

            console.log(pool[index].length);
        } else {
            res.status(404);
            res.end();
        }

        return 0;
    };

    const handleMessage = (req, res) => {
        let statusCode = 400;
        let szMessage = '';

        if (req.query.key) {

            let index = req.query.key;

            let arrPool = (pool[index] === undefined) ? [] : pool[index].map((x) => x);

            pool[index] = [];

            for (let pollObj of arrPool) {
                pollObj.res.contentType = "text/plain";
                pollObj.res.setHeader("Content-Type", "text/plain");

                pollObj.res.end(`${pollObj.origin} from ${pollObj.id}`);

                //setTimeout(function () { checkFile(); }, Math.random() * 5000);
            }

            if (arrPool.length == 0) {
                szMessage = 'no matching pool';
            } else {
                szMessage = 'complete';
                statusCode = 200;
            }
        } else {
            szMessage = 'no key provided';
        }

        res.status(statusCode);
        res.send(szMessage);
    };

    const ctrAdmin = new AdminController(utilObj);

    router.route('/reset').post(ctrAdmin.postReset);

    router.route('/register')
        .get(ctrAdmin.getRegister)
        .post(ctrAdmin.postRegister);

    router.route('/poll')
        .get(handlePoll);

    router.route('/message')
        .post(handleMessage);
    return router;
};