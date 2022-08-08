const express = require("express");
const router = express.Router();

const ServicesController = require("./controllers/serviceController");

module.exports = (utilObj) => {
    const ctrServices = new ServicesController(utilObj);

    // middleware that is specific to this router
    router.use(function timeLog(req, res, next) {
        if (req.query.key !== undefined) {
            ctrServices.processKey(req);
        }

        next();
    });

    router
        .route('/:service/register')
        .post(ctrServices.postServiceRegister);

    router
        .route('/:service/:option')
        .get(ctrServices.getServiceOption)
        .post(ctrServices.postServiceOption);

    router
        .route('/:service/:option/:key')
        .get(ctrServices.getServiceOptionKey)
        .patch(ctrServices.patchServiceOptionKey);

    router
        .route('/:service')
        .get(ctrServices.getService);

    router
        .route('/')
        .get(ctrServices.getServices);

    return router;
};