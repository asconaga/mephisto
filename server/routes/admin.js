const express = require("express");
const router = express.Router();

const AdminController = require("./controllers/adminController");

module.exports = (utilObj) => {
    const ctrAdmin = new AdminController(utilObj);

    router.route('/reset').post(ctrAdmin.postReset);

    router.route('/register')
        .get(ctrAdmin.getRegister)
        .post(ctrAdmin.postRegister);

    return router;
};