var express = require('express');
var customerRouter = express.Router();
const verifyModule = require('../routes/verify');
const admin = verifyModule.admin;
const verify = verifyModule.verify;

/// done
customerRouter.get("/NewRequest", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer only
        if (snapshot.val().type == 'customer') {
            res.render(snapshot.val().type + "Pages/newRequest.html");
        } else {
            res.redirect('/home');
        }
    });
});


customerRouter.get("/chatHistory", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer only
        if (snapshot.val().type == 'customer') {
            res.render(snapshot.val().type + "Pages/chatHistory.html");
        } else {
            res.redirect('/home');
        }
    });
});


customerRouter.get("/certificateRecord", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer only
        if (snapshot.val().type == 'customer') {
            res.render(snapshot.val().type + "Pages/certificates.html");
        } else {
            res.redirect('/home');
        }
    });
});

customerRouter.get("/History", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer only
        if (snapshot.val().type == 'customer') {
            res.render(snapshot.val().type + "Pages/history.html");
        } else {
            res.redirect('/home');
        }
    });
});

customerRouter.get("/Chat", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer only
        if (snapshot.val().type == 'customer') {
            res.render(snapshot.val().type + "Pages/chat.html");
        } else {
            res.redirect('/home');
        }
    });
});

customerRouter.get("/certificate", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer only
        if (snapshot.val().type == 'customer') {
            res.render(snapshot.val().type + "Pages/certificate.html");
        } else {
            res.redirect('/home');
        }
    });
});

customerRouter.get("/details", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer only
        if (snapshot.val().type == 'customer') {
            res.render(snapshot.val().type + "Pages/details.html");
        } else {
            res.redirect('/home');
        }
    });
});

///


module.exports = customerRouter;