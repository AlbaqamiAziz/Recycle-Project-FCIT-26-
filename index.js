const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const bodyParser = require("body-parser");
const express = require("express");
const path = require('path');
const ejs = require("ejs");

// ------- Server config -----------
const csrfMiddleware = csrf({ cookie: true });
const app = express();
const PORT = process.env.PORT || 3000;

// ----------- Midllewares -----------
app.use(bodyParser.json());
app.use(cookieParser());
app.use(csrfMiddleware);
app.use(express.static(path.join(__dirname, 'public')));

app.engine("html", ejs.renderFile);
var router = require('./routers/router');
app.use('/', router);


app.listen(PORT, () => {
    console.log('App listen to port ' + PORT);
});