var express = require('express');
var adminRouter = express.Router();
const verifyModule = require('../routes/verify');
const admin = verifyModule.admin;
const verify = verifyModule.verify;
const getType = verifyModule.getType;

adminRouter.get("/mailbox", verify, getType /*use veify, getType middlewares*/, function (req, res) {
    if (req.userType == "admin") {
        res.render("adminPages/mailbox.html");
    } else {
        res.redirect("/home");
    }

});

adminRouter.get("/manageDrivers", verify, getType /*use veify, getType middlewares*/, function (req, res) {
    if (req.userType == "admin") {
        res.render("adminPages/manageDrivers.html");
    } else {
        res.redirect("/home");
    }
});

adminRouter.get("/manageNewDrivers", verify, getType /*use veify, getType middlewares*/, function (req, res) {
    if (req.userType == "admin") {
        res.render("adminPages/manageNewDrivers.html");
    } else {
        res.redirect("/home");
    }
});

module.exports = adminRouter;