// -----------------{Event listeners}---------------- 
document.getElementById('form').onsubmit = function (e) {
    e.preventDefault();
    validateForm();
}

document.getElementById('google-btn').onclick = function (e) {
    google_signup();
}
// --------------------------------------------------------------

// -----------------{Firebase Authntication}----------------

// Regular in
function signin(emailInput, passwordInput) {
    firebase.auth().signInWithEmailAndPassword(emailInput.value, passwordInput.value).then(() => {
    }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // TODO: Add a an error message container
        alert(errorMessage);
    });
}

// Google Signup
function google_signup() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
}
// ---------------------------------------------------------------


function validateForm() {
    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');
    var isValid =  isValidEmail(emailInput) && isValidPassword(passwordInput);
    if (isValid) {
        signin(emailInput, passwordInput);
    }
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        firebase.database().ref('/users/' + user.uid).once('value').then(function (snapshot) {
            //check if the customer record is found in the database
            if (snapshot.val()) {
                if (snapshot.val().type == 'customer') {
                    window.location.href = "customerPages/homepage.html";
                } else if (snapshot.val().type == 'driver') {
                    window.location.href = "driverPages/homepage.html";
                } else {
                    window.location.href = "adminPages/overview.html";
                }
            } else {
                window.location.href = "googleSignup.html";
            }
        });
    }
});




