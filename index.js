const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");

const path = require('path');
const ejs = require("ejs");

const verifyModule = require('./routes/verify');
const admin = verifyModule.admin;
const verify = verifyModule.verify;

// ------- Server config -----------
const csrfMiddleware = csrf({ cookie: true }); // check if we have required cookie in each request
const PORT = process.env.PORT || 3000;
const app = express();

// ----------- Midllewares -----------
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);

app.use(express.static(path.join(__dirname, 'scripts')));

app.engine("html", ejs.renderFile);


// ------- Pages routes ---------
app.all("*", (req, res, next) => {
    res.cookie("XSRF-TOKEN", req.csrfToken());
    next();
});

app.get('/', (req, res) => {
    res.render('./login.html');
});

// ---------------- Routes that needs verification -----------------------
// after verify the session token check type and render the page

app.get("/home", verify /*use veify middleware*/ , function(req, res) {
    admin.database().ref('user_type/' + req.user).once("value", function(snapshot) {
        // render to the home page according the user role
        res.render(snapshot.val().type + "Pages/homepage.html");
    });
});

// ----- Start and end session ------

app.post("/sessionLogin", (req, res) => {
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

app.get("/sessionLogout", (req, res) => {
    res.clearCookie("session");
    res.redirect("/");
});

app.listen(PORT, () => {
    console.log('App listen to port ' + PORT);
});