var express = require('express');
var adminRouter = express.Router();
const verifyModule = require('../routes/verify');
const admin = verifyModule.admin;
const verify = verifyModule.verify;

adminRouter.get("/mailbox", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        if (snapshot.val().type == "admin") {
            res.render("adminPages/mailbox.html");
        } else {
            res.redirect("/home");
        }
    });

});

adminRouter.get("/manageDrivers", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        if (snapshot.val().type == "admin") {
            res.render("adminPages/manageDrivers.html");
        } else {
            res.redirect("/home");
        }
    });
});

adminRouter.get("/manageNewDrivers", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        if (snapshot.val().type == "admin") {
            res.render("adminPages/manageNewDrivers.html");
        } else {
            res.redirect("/home");
        }
    });
});

module.exports = adminRouter;