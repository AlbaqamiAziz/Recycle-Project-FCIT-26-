var express = require('express');
var customerRouter = express.Router();
const verifyModule = require('../routes/verify');
const admin = verifyModule.admin;
const verify = verifyModule.verify;
const getType = verifyModule.getType;

customerRouter.get("/NewRequest", verify, getType /*use veify, getType middlewares*/, function (req, res) {
    // profile page is for customer only
    if (req.userType == 'customer') {
        res.render(req.userType + "Pages/newRequest.html");
    } else {
        res.redirect('/home');
    }
});

customerRouter.get("/chatHistory", verify, getType /*use veify, getType middlewares*/, function (req, res) {
    // profile page is for customer only
    if (req.userType == 'customer') {
        res.render(req.userType + "Pages/chatHistory.html");
    } else {
        res.redirect('/home');
    }
});

customerRouter.get("/Chat", verify, getType /*use veify, getType middlewares*/, function (req, res) {
    // profile page is for customer only
    if (req.userType == 'customer') {
        res.render(req.userType + "Pages/chat.html");
    } else {
        res.redirect('/home');
    }
});

customerRouter.get("/certificateRecord", verify, getType /*use veify, getType middlewares*/, function (req, res) {
    // profile page is for customer only
    if (req.userType == 'customer') {
        res.render(req.userType + "Pages/certificates.html");
    } else {
        res.redirect('/home');
    }
});

customerRouter.get("/certificate", verify, getType /*use veify, getType middlewares*/, function (req, res) {
    // profile page is for customer only
    if (req.userType == 'customer') {
        res.render(req.userType + "Pages/certificate.html");
    } else {
        res.redirect('/home');
    }
});


module.exports = customerRouter;