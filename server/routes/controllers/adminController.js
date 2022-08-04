const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const flatDB = require('node-flat-db');
const storage = require('node-flat-db/file-sync');

class AdminRegister {
    constructor(email, password) {
        this.key = uuidv4();
        this.email = email;
        this.password = password;
    }
}

const db = flatDB('db/db.json', { storage });

class AdminController {
    constructor(utilObj) {
        this.utilObj = utilObj;
        this.dbTable = 'admin';
    }

    postReset = (async (req, res) => {
        let szMessage = "Incorrect object definition";
        let status = 400;

        // let bIsValid = true;

        try {
            let body = JSON.parse(req.body);
            if (body.email) {

                let foundRegister = db(this.dbTable).find({ email: body.email });

                if (foundRegister !== undefined) {
                    status = 200;

                    let nMatch = 0;
                    if (body.key && body.key === foundRegister.key) {
                        nMatch = 0x01;
                    }

                    if (body.password) {
                        if (await bcrypt.compare(body.password, foundRegister.password)) {
                            nMatch |= 0x02;
                        }
                    }

                    switch (nMatch) {
                        case 0x01:
                            foundRegister.password = await bcrypt.hash(body.password, 10);
                            szMessage = `{ "message": "New password accepted"}`;
                            break;
                        case 0x02:
                            szMessage = `{ "message": "key returned {'${foundRegister.key}'}" }`;
                            break;
                        default:
                            szMessage = `{ "message": "Nothing to ${((nMatch === 0) ? "match" : "change")}"}`;
                    }
                }
                else {
                    szMessage = JSON.stringify({ message: 'User not registered' });
                }
            }
        } catch (err) {
            console.log(err.message);
            szMessage = err.message;
            // bIsValid = false;
        }

        const pStatus = res.status(status);

        pStatus.send(szMessage);
    });

    getRegister = (req, res) => {
        const pStatus = res.status(200);

        const dbAdmin = db(this.dbTable).value();

        let adminObj = { admin: { user: [] } };

        for (let i = 0; i < dbAdmin.length; i++) {
            adminObj.admin.user.push({ email: dbAdmin[i].email, key: dbAdmin[i].key });
        }

        const szRet = this.utilObj.makePretty(adminObj);

        pStatus.send(szRet);
    };

    postRegister = (async (req, res) => {
        let szMessage = "Incorrect object definition";
        let status = 400;

        // let bIsValid = true;

        try {
            let body = JSON.parse(req.body);
            if (body.email && body.password) {

                let foundRegister = db(this.dbTable).find({ email: body.email });

                if (foundRegister === undefined) {
                    status = 200;

                    const hashedPassword = await bcrypt.hash(body.password, 10);

                    const newRegister = new AdminRegister(body.email, hashedPassword);

                    db(this.dbTable).push(newRegister);

                    szMessage = JSON.stringify({ "key": newRegister.key, "email": newRegister.email });
                }
                else {
                    szMessage = JSON.stringify({ message: 'User already registered' });
                }
            }
        } catch (err) {
            console.log(err.message);
            szMessage = err.message;
            // bIsValid = false;
        }

        const pStatus = res.status(status);

        pStatus.send(szMessage);
    });
}

module.exports = AdminController;