const admin = require('firebase-admin');

var serviceAccount = require("../recycle-9c0e0-firebase-adminsdk-lt79u-6fa21fe1c6.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://recycle-9c0e0-default-rtdb.firebaseio.com"
});

module.exports = {
    verify: (req, res, next) => {
        const sessionCookie = req.cookies.session || "";
        admin.auth().verifySessionCookie(sessionCookie, true).then((decodedToken) => {
            // if verified user 
            // save user id in the request 
            const uid = decodedToken.uid;
            req.user = uid;
            next();
        }).catch((error) => {
            // if not verified user 
            res.redirect("/");
        });
    },
    admin: admin
}