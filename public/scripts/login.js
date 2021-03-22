// -----------------{Event listeners}---------------- 
document.getElementById("form").onsubmit = function(e) {
    e.preventDefault();
    validateForm();
}

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
    firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value).then(({ user }) => {
        getUserType(user);
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if(errorCode == "auth/user-not-found"){
            searchInNewDrivers(emailInput,passwordInput);
        }else {
            alert(errorMessage);
        }
    });;
}


// --------- driver ---------
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