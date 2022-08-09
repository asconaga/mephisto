const flatDB = require('node-flat-db');
const storage = require('node-flat-db/file-sync');

const db = flatDB('db/db.json', { storage });

class Service {
    constructor(name, description, ownerKey, utilObj) {
        this.key = utilObj.uuidv4();
        this.name = name;
        this.description = description;
        this.owner = ownerKey;
        this.methods = [];
    }
}

class ServicePost {
    constructor(data, name, description, utilObj) {
        this.key = utilObj.uuidv4();
        this.name = name;
        this.description = description;
        this.date = Date.now();
        this.status = 1; // 1 = open, 2 = flagged, 3 = closed, 0 = not allocated
        this.data = data;
    }
}

class ServiceOption {
    constructor(name, description, utilObj) {
        this.key = utilObj.uuidv4();
        this.name = name;
        this.description = description;
        this.posts = [];
    }
}

class ServicesController {
    constructor(utilObj) {
        this.utilObj = utilObj;
    }

    processKey = (req) => {
        let foundRegister = db(this.utilObj.tabAdmin).find({ key: req.query.key });

        req.validKey = foundRegister;
    };

    getServices = (req, res) => {
        const dbServices = [...db(this.utilObj.tabServices).value()];

        let szRet = '';

        // YAKUBU temp solution to resolve missing owner
        if (req.query?.complete === 'true') {

            // first remove some uncessary stuff
            dbServices.forEach(serviceElem => {
                // delete serviceElem.owner;

                serviceElem.methods.forEach(methodElem => {
                    if (methodElem.posts !== undefined) {
                        methodElem.posts.forEach(postElem => {
                            // delete postElem.data;
                        });

                    }
                });
            });

            szRet = this.utilObj.makePretty(dbServices);
        }
        else {

            let serviceObj = { services: { service: [] } };

            for (let i = 0; i < dbServices.length; i++) {
                serviceObj.services.service.push({ name: dbServices[i].name });
            }

            szRet = this.utilObj.makePretty(serviceObj);
        }

        const pStatus = res.status(200);
        pStatus.send(szRet);
    };

    /* special case for register */
    postServiceRegister = (req, res) => {
        const { service } = req.params;

        let status = 400;

        let serviceObj = {};

        let foundService = db(this.utilObj.tabServices).find({ name: service });

        if (foundService === undefined) {
            if (req.validKey) {
                try {
                    let body = JSON.parse(req.body);

                    if (body.description) {

                        console.log(this.utilObj);

                        let newService = new Service(service, body.description, req.validKey.key, this.utilObj);

                        db(this.utilObj.tabServices).push(newService);

                        status = 200;

                        serviceObj = this.utilObj.makeMessage(`New Service Registered`);
                    }
                    else {
                        serviceObj = this.utilObj.makeMessage(`Missing paramters found`);
                    }
                } catch (err) {
                    serviceObj = this.utilObj.makeMessage(err.message);
                }
            }
            else {
                serviceObj = this.utilObj.makeMessage(`Valid key must be provided to register service`);
            }
        }
        else {
            serviceObj = this.utilObj.makeMessage(`Service ${service} already defined`);
        }

        console.log(`service = ${foundService}`);

        const pStatus = res.status(status);

        pStatus.send(this.utilObj.makePretty(serviceObj));
    };

    getServiceOptionKey = (req, res) => {
        const { service, option, key } = req.params;

        let status = 400;

        let serviceObj = {};
        let foundService = db(this.utilObj.tabServices).find({ name: service });

        serviceObj = this.utilObj.makeMessage(`No matching post for '${option}' with key='${key}'`);

        if (foundService !== undefined) {
            const foundServiceMethod = foundService.methods.find(({ name }) => name === option);

            if (foundServiceMethod !== undefined) {

                // let bNoMatch = true;
                if (!((foundServiceMethod.posts === undefined) || (foundServiceMethod.posts.length === 0))) {
                    const post = foundServiceMethod.posts.find(({ key }) => key === req.params.key);

                    if (post !== undefined) {
                        serviceObj = { post };
                        status = 200;
                    }
                }
            }
        }
        const pStatus = res.status(status);

        const szMsg = this.utilObj.makePretty(serviceObj);

        pStatus.send(szMsg);
    };

    patchServiceOptionKey = (req, res) => {
        const { service, option, key } = req.params;

        let status = 400;

        let serviceObj = {};
        let foundService = db(this.utilObj.tabServices).find({ name: service });

        serviceObj = this.utilObj.makeMessage(`No matching post for '${option}' with key='${key}'`);

        if (foundService !== undefined) {
            const foundServiceMethod = foundService.methods.find(({ name }) => name === option);

            if (foundServiceMethod !== undefined) {

                // let bNoMatch = true;
                if (!((foundServiceMethod.posts === undefined) || (foundServiceMethod.posts.length === 0))) {
                    const post = foundServiceMethod.posts.find(({ key }) => key === req.params.key);

                    if (post !== undefined) {
                        try {
                            let body = JSON.parse(req.body);

                            let bValidParams = false;

                            if (body.date !== undefined) {
                                post.date = body.date;
                                bValidParams = true;
                            }

                            if (body.status !== undefined) {
                                post.status = body.status;
                                bValidParams = true;
                            }

                            if (bValidParams) {
                                serviceObj = this.utilObj.makeMessage(`Post with key='${post.key}' updated`);

                                db.write();

                                status = 200;
                            }
                            else {
                                serviceObj = this.utilObj.makeMessage(`No valid update values added`);
                            }
                        } catch (err) {
                            serviceObj = this.utilObj.makeMessage(err.message);
                        }
                    }
                }
            }
        }
        const pStatus = res.status(status);

        const szMsg = this.utilObj.makePretty(serviceObj);

        pStatus.send(szMsg);
    };

    getServiceOption = (req, res) => {
        const { service, option } = req.params;

        let status = 400;

        let serviceObj = {};
        let foundService = db(this.utilObj.tabServices).find({ name: service });

        if (foundService === undefined) {
            serviceObj = this.utilObj.makeMessage(`Service '${service}' undefined. Please register first`);
        }
        else {
            const foundServiceMethod = foundService.methods.find(({ name }) => name === option);

            if (foundServiceMethod === undefined) {
                serviceObj = this.utilObj.makeMessage(`Method '${option}' not defined`);
            }
            else {
                status = 200;

                if ((foundServiceMethod.posts === undefined) || (foundServiceMethod.posts.length === 0)) {
                    serviceObj = this.utilObj.makeMessage(`No posts for '${option}'`);
                }
                else {
                    serviceObj = { [option]: { posts: [] } };

                    for (const element of foundServiceMethod.posts) {
                        serviceObj[option].posts.push({ key: element.key, date: element.date, status: element.status });
                    }
                }
            }
        }
        const pStatus = res.status(status);

        const szMsg = this.utilObj.makePretty(serviceObj);

        pStatus.send(szMsg);
    };

    /* special case for register method of service */
    postServiceOptionRegister = (req, res) => {
        const { service, option } = req.params;

        let serviceObj = this.utilObj.makeMessage(`Service '${service}' Method ${option}`);

        let status = 400;

        // let serviceObj = {};
        let foundService = db(this.utilObj.tabServices).find({ name: service });

        if (foundService === undefined) {
            serviceObj = this.utilObj.makeMessage(`Service '${service}' undefined. Please register first`);
        }
        else {
            const foundServiceMethod = foundService.methods.find(({ name }) => name === option);

            if (foundServiceMethod !== undefined) {
                serviceObj = this.utilObj.makeMessage(`Method ${option} already defined`);
            }
            else {
                //                if ((req.validKey) && (foundService.owner === req.validKey.key)) {

                if (req.validKey) {
                    try {
                        let body = JSON.parse(req.body);

                        if (body.description) {
                            let newServiceOption = new ServiceOption(option, body.description, this.utilObj);

                            foundService.methods.push(newServiceOption);

                            db.write(); // commit change to db

                            status = 200;

                            serviceObj = this.utilObj.makeMessage(`New method '${option}' registered`);
                        }
                        else {
                            serviceObj = this.utilObj.makeMessage(`Missing paramters found`);
                        }
                    } catch (err) {
                        serviceObj = this.utilObj.makeMessage(err.message);
                    }
                }
                else {
                    serviceObj = this.utilObj.makeMessage(`Valid key must be provided to register method`);
                }
            }
        }

        const pStatus = res.status(status);

        pStatus.send(this.utilObj.makePretty(serviceObj));
    };

    postServiceOption = (req, res) => {
        const { service, option } = req.params;

        let status = 400;

        let serviceObj = {};
        let foundService = db(this.utilObj.tabServices).find({ name: service });

        if (foundService === undefined) {
            serviceObj = this.utilObj.makeMessage(`Service '${service}' undefined. Please register first`);
        }
        else {
            const foundServiceMethod = foundService.methods.find(({ name }) => name === option);

            if (foundServiceMethod === undefined) {
                serviceObj = this.utilObj.makeMessage(`Method '${option}' not defined. Please register the method`);
            }
            else {
                if (req.validKey) {
                    serviceObj = this.utilObj.makeMessage(`Method '${option}' already defined - does not need a key`);
                }
                // YAKUBU: now we add posts 
                try {
                    let body = JSON.parse(req.body);

                    if (body.name && body.description && body.post) {
                        if (foundServiceMethod.posts === undefined) {
                            foundServiceMethod.posts = [];
                        }

                        let newServicePost = new ServicePost(body.post, body.name, body.detail, this.utilObj);

                        foundServiceMethod.posts.push(newServicePost);

                        db.write(); // commit change to db

                        serviceObj = this.utilObj.makeMessage(`New post added with key '${newServicePost.key}'`);

                        status = 200;
                    } else {
                        serviceObj = this.utilObj.makeMessage(`Missing paramters found`);
                    }

                } catch (err) {
                    serviceObj = this.utilObj.makeMessage(err.message);
                }
            }
        }

        const pStatus = res.status(status);

        const szMsg = this.utilObj.makePretty(serviceObj);

        pStatus.send(szMsg);
    };

    getService = (req, res) => {
        const { service } = req.params;

        let status = 400;
        let serviceObj = { message: `Service '${service}' not found` };

        if (service === 'register') {
            serviceObj = { message: `Service '${service}' is a reserved word` };
        }
        else {
            let foundService = db(this.utilObj.tabServices).find({ name: service });

            if (foundService !== undefined) {
                status = 200;

                serviceObj = { [service]: { methods: [] } };

                for (let i = 0; i < foundService.methods.length; i++) {
                    serviceObj[service].methods.push({ name: foundService.methods[i].name });
                }
            }
        }

        const pStatus = res.status(status);

        const szMsg = this.utilObj.makePretty(serviceObj);

        pStatus.send(szMsg);
    };
}

module.exports = ServicesController;