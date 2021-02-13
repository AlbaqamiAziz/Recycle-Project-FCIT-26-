document.getElementById('form').onsubmit = function (e) {
    e.preventDefault();
    validateForm();
}

function validateForm() {
    var emailInput = document.getElementById('email');
    var isValid = isValidEmail(emailInput);
    if (isValid) {
        resetPassword(emailInput.value);
    }
}

function resetPassword(email) {
    firebase.auth().sendPasswordResetEmail(email).then(function () {
        alert('Please check your email to reset your password');
        window.location.href = "login.html";
    }).catch(function (error) {
        var errorMessage = error.message;
        alert(errorMessage);
    });
}