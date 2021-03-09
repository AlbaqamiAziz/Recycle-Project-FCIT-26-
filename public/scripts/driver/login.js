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
// -----------------------------------------------------

// -----------------{Create new user}----------------

// ---------------------------------------------------------------



