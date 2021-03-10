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
// ---------------------------------------------------------------

function validateForm() {
    var nameInput = document.getElementById('name');
    var phoneInput = document.getElementById('phone');
    var emailInput = document.getElementById('email');
    var passwordInput = document.getElementById('password');
    var isValid = isValidName(nameInput) && isValidEmail(emailInput) && isValidPhone(phoneInput) && isValidPassword(passwordInput);
    if (isValid) {
        isPhoneExists(nameInput, phoneInput, emailInput, passwordInput);
    }
}

function isPhoneExists(nameInput, phoneInput, emailInput, passwordInput) {
    firebase.database().ref('users/customers').orderByChild('phone').equalTo(phoneInput.value).limitToFirst(1).once('value').then(function (snapshot) {
        if (snapshot.val()) {
            phoneInput.style.borderBottom = '1px solid red';
            // TODO: Add a an error message container   
            alert('Phone number is already used by another customer');
        } else {
            phoneInput.style.borderBottom = '1px solid #31842c'
            signup(nameInput.value, phoneInput.value, emailInput.value, passwordInput.value);
        }
    });
}






