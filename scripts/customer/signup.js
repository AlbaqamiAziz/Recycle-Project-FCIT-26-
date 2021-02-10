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
// Regular Signup
function signup(name, phone, email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password).then((userCredential) => {
        var user = userCredential.user;
        createUser(user, name, phone);
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
    var nameInput = document.getElementById('name');
    var phoneInput = document.getElementById('phone');
    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');
    var isValid = isValidName(nameInput) && isValidEmail(emailInput) && isValidPhone(phoneInput) && isValidPassword(passwordInput);
    if (isValid) {
        signup(nameInput.value, phoneInput.value, emailInput.value, passwordInput.value);
    }
}

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        //check if the customer record is found in the database
        firebase.database().ref('/users/customer' + user.uid).once('value').then(function (snapshot) {
            // if registerd
            if (snapshot.val()) {
                window.location.href = "customerPages/homepage.html";
            } else {
                window.location.href = "googleSignup.html";
            }
        });
    }
});




