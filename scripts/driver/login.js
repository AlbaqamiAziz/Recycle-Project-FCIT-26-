// -----------------{Event listeners}---------------- 
document.getElementById('form').onsubmit = function (e) {
    e.preventDefault();
    validateForm();
}
// --------------------------------------------------------------

// ----------------{Form validation}----------------
function validateForm() {
    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');
    var isValid = isValidEmail(emailInput) && isValidPassword(passwordInput);
    if (isValid) {
        signin(emailInput, passwordInput);
    }
}
// --------------------------------------------------------------

// -----------------{Firebase Authntication}----------------
function signin(emailInput, passwordInput) {
    firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value).then(() => {
        window.location.href = "homepage.html";
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode == 'auth/user-not-found') {
            searchInNewDrivers(emailInput, errorMessage);
        }
    });
}
function searchInNewDrivers(emailInput, errorMessage) {
    // if driver is not registered search in new drivers
    firebase.database().ref('new_drivers/').orderByChild('email').equalTo(emailInput.value).once('value').then(function (snapshot) {
        snapshot.forEach(driver => {
            if (driver.val()) {
                // create new user for driver
                signup(driver.val());
                // remove driver from new drivers
                removeNewDriver(driver.key);
            } else {
                alert(errorMessage);
            }
        });
    });
}
function signup(driver) {
    firebase.auth().createUserWithEmailAndPassword(driver.email, driver.password).then((userCredential) => {
        var user = userCredential.user;
        createUser(user, driver.name, driver.phone);
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert(errorMessage);
    });
}
// -----------------------------------------------------

// -----------------{Create new user}----------------
function createUser(user, name, phone) {
    var newUser = {
        name: name,
        phone: phone,
        total_requests: 0,
        email: user.email
    };
    writeUserType(newUser, user.uid);
}

function writeUserType(newUser, uid) {
    firebase.database().ref('user_type/' + uid).set({
        type: 'driver'
    }, function (error) {
        alert(error);
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        } else {
            writeUserData(newUser, uid);
        }
    });
}

function writeUserData(newUser, uid) {
    firebase.database().ref('users/drivers/' + uid).set(newUser, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        } else {
            window.location.href = "homepage.html";
        }
    });
}

function removeNewDriver(key) {
    firebase.database().ref('new_drivers/' + key).remove();
}
// ---------------------------------------------------------------



