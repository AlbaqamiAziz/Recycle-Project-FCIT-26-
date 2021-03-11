var express = require('express');
var customerRouter = express.Router();
const verifyModule = require('../routes/verify');
const admin = verifyModule.admin;
const verify = verifyModule.verify;

/// done
customerRouter.get("/NewRequest", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer only
        res.render(snapshot.val().type + "Pages/newRequest.html");
    });
});

customerRouter.get("/Chat", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer only
        res.render(snapshot.val().type + "Pages/chat.html");
    });
});

customerRouter.get("/chatHistory", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer only
        res.render(snapshot.val().type + "Pages/chatHistory.html");
    });
});

customerRouter.get("/certificate", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer only
        res.render(snapshot.val().type + "Pages/certificate.html");
    });
});

customerRouter.get("/certificateRecord", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer only
        res.render(snapshot.val().type + "Pages/certificates.html");
    });
});

customerRouter.get("/History", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer only
        res.render(snapshot.val().type + "Pages/history.html");
    });
});

///


module.exports = customerRouter;