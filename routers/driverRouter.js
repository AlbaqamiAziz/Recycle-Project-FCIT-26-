var express = require('express');
var driverRouter = express.Router();
const verifyModule = require('../routes/verify');
const admin = verifyModule.admin;
const verify = verifyModule.verify;

driverRouter.get("/homepage", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        if (snapshot.val().type == "driver") {
            res.render("driverPages/homepage.html");
        } else {
            res.redirect("/home");
        }
    });

});
//------------------

driverRouter.get("/history", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        if (snapshot.val().type == "driver") {
            res.render("driverPages/history.html");
        } else {
            res.redirect("/home");
        }
    });

});

//------------------

driverRouter.get("/details", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        if (snapshot.val().type == "driver") {
            res.render("driverPages/details.html");
        } else {
            res.redirect("/home");
        }
    });

});



module.exports = driverRouter;