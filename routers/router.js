var express = require('express');
var router = express.Router();
const verifyModule = require('../routes/verify');
const admin = verifyModule.admin;
const verify = verifyModule.verify;


// ------- Pages routes ---------
router.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

router.get('/', (req, res) => {
    res.render('./index.html');
});

// ---------------- Routes that needs verification -----------------------
// after verify the session token check type and render the page

// Shared routes
router.get("/home", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // render to the home page according the user role
        var type = snapshot.val().type;

        res.render(type + "Pages/homepage.html");
    });
});

router.get("/profile", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // profile page is for customer & driver only
        var type = snapshot.val().type;
        if (type == 'customer' || type == 'driver') {
            res.render(type + "Pages/profile.html");
        } else {
            res.redirect('/home');
        }
    });
});
// -------------------------------------------------------------------

// ----- Start and end session ------
router.post("/sessionLogin", (req, res) => {
    const idToken = req.body.idToken.toString();

    const expiresIn = 60 * 60 * 24 * 5 * 1000;

    admin.auth().createSessionCookie(idToken, { expiresIn }).then((sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
    }, (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
    });
});

router.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/");
});


module.exports = router;