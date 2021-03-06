// -----------------{Event listeners}---------------- 

document.getElementById("form").onsubmit = function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        firebase.auth().signInWithEmailAndPassword(email, password).then(({ user }) => {
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
                });
            })
            // .then(() => {
            //     return firebase.auth().signOut();
            // })
            .then(() => {
                window.location.assign("/home");
            })
            .catch(err => {
                alert(err.message)
                console.log(err)
            });

        // validateForm();
    }
    // ------------------------------- //

// ----------------------------------------- //
document.getElementById("google-btn").onclick = function() {
    google_signup();
}

// -----------------{Form validation}---------------- 
function validateForm() {
    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    var isValid = isValidEmail(emailInput) && isValidPassword(passwordInput);
    if (isValid) {
        signin(emailInput, passwordInput);
    }
}

// -----------------{Firebase Authntication}----------------
function signin(emailInput, passwordInput) {
    firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value).then((userCredential) => {
        var user = userCredential.user;
        checkType(user.uid);
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == "auth/user-not-found") {
            searchInNewDrivers(emailInput, errorMessage);
        } else {
            alert(errorMessage);
        }
    });
}

function singupDriver(driver) {
    firebase.auth().createUserWithEmailAndPassword(driver.email, driver.password).then((userCredential) => {
        var user = userCredential.user;
        createDriver(user, driver.name, driver.phone);
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
}

function google_signup() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
}

// ---------------------------------------------------------------
function checkType(uid) {
    firebase.database().ref("user_type/" + uid).once("value").then(function(type) {
        //check if the customer record is found in the database
        if (type.val()) {
            if (type.val().type == "customer") {
                window.location.href = "customerPages/homepage.html";
            } else if (type.val().type == "driver") {
                checkDriverState(uid);
            } else {
                window.location.href = "adminPages/overview.html";
            }
        } else {
            window.location.href = "googleSignup.html";
        }
    });
}

function searchInNewDrivers(emailInput, errorMessage) {
    // if driver is not registered search in new drivers
    firebase.database().ref("new_drivers/").orderByChild("email").equalTo(emailInput.value).once("value").then(function(snapshot) {
        if (snapshot.val()) {
            snapshot.forEach(driver => {
                // remove driver from new drivers
                removeNewDriver(driver.key);
                // create new user for driver
                singupDriver(driver.val());
            });
        } else {
            alert(errorMessage);
        }
    });
}

function removeNewDriver(key) {
    firebase.database().ref("new_drivers/" + key).remove();

}

function checkDriverState(uid) {
    firebase.database().ref("users/drivers/" + uid).once("value").then(function(snapshot) {
        if (snapshot.val().state == 'enabled') {
            window.location.href = "driverPages/homepage.html"
        } else {
            alert('Sorry, your account is disabled!')
        }
    });
}