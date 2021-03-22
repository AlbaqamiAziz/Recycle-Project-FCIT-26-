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

// ----------- Routers -----------
var router = require('./routers/router');
var customerRouter = require('./routers/customerRouter');
var adminRouter = require('./routers/adminRouter');
app.use('/', router);
app.use('/', customerRouter);
app.use('/', adminRouter);
//-------------------------------------------------

app.listen(PORT, () => {
    console.log('App listen to port ' + PORT);
});