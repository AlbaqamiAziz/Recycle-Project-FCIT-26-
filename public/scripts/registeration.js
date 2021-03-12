// -----------------{Form validation}--------------------
function isValidName(nameInput) {
    var isValid = nameInput.value.length > 0;
    if (!isValid) {
        nameInput.style.borderBottom = "1px solid red";
        // TODO: Add a an error message container
        alert("Your name should not be empty");
    } else {
        nameInput.style.borderBottom = "1px solid #31842c";
    }
    return isValid;
}

function isValidPhone(phoneInput) {
    var isValid = phoneInput.value.length == 10 && phoneInput.value.startsWith("05") && /^\d+$/.test(phoneInput.value);
    if (!isValid) {
        phoneInput.style.borderBottom = "1px solid red";
        // TODO: Add a an error message container
        alert("Please enter a valid phone number");
    } else {
        phoneInput.style.borderBottom = "1px solid #31842c"
    }
    return isValid;
}

function isValidEmail(emailInput) {
    var isValid = emailInput.value.length > 0 && /^[a-zA-Z0-9.!#$%&"*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailInput.value);
    if (!isValid) {
        emailInput.style.borderBottom = "1px solid red";
        // TODO: Add a an error message container
        alert("Please enter a valid email");
    } else {
        emailInput.style.borderBottom = "1px solid #31842c";
    }
    return isValid;
}

function isValidPassword(passwordInput) {
    var isValid = passwordInput.value.length >= 6;
    if (!isValid) {
        passwordInput.style.borderBottom = "1px solid red";
        // TODO: Add a an error message container
        alert("Your password should be 6 digits at least");
    } else {
        passwordInput.style.borderBottom = "1px solid #31842c";
    }
    return isValid;
}
// -----------------------------------------------------------------

// Google Signup
function google_signup() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
}

// After redirect from Google signup
firebase.auth().getRedirectResult().then((result) => {
    if (result.credential) {
        var user = result.user;
        getUserData(user);
    }
}).catch(function (error) {
    alert(error.message);
});

function getUserData(user) {
    firebase.database().ref("user_type/" + user.uid).once("value", (snapshot) => {
        if (snapshot.val()) {
            startSession(user);
        } else {
            window.location.href = "googleSignup.html";
        }
    });
}

// -----------------------------{Create user}------------------------------
function createUser(user, name, phone) {
    var newUser = {
        name: name,
        phone: phone,
        location: "",
        current_points: 0,
        total_points: 0,
        total_requests: 0,
        email: user.email
    };
    writeUserType(newUser, user, "customer");
}

function createDriver(user, name, phone) {
    var newUser = {
        name: name,
        phone: phone,
        total_requests: 0,
        email: user.email,
        state: active
    };
    writeUserType(newUser, user, "driver");
}

function writeUserType(newUser, user, type) {
    firebase.database().ref("user_type/" + user.uid).set({
        type: type
    }, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        } else {
            writeUserData(newUser, user, type);
        }
    });
}

function writeUserData(newUser, user, type) {
    firebase.database().ref("users/" + type + "s/" + user.uid).set(newUser, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        } else {
            startSession(user);
        }
    });
}
// ------------------------------------------------------------------------
function startSession(user) {
    return user.getIdToken().then((idToken) => {
        return fetch("/sessionLogin", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "CSRF-Token": Cookies.get("XSRF-TOKEN"),
            },
            body: JSON.stringify({ idToken }),
        });
    }).then(() => {
        window.location.assign("/home");
    }).catch(err => {
        alert(err.message);
    });
}
