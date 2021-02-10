// -------------------{Event listeners}------------------ 
var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        document.getElementById('name').value = user.displayName;
    }
});
// -------------------------------------------------------

document.getElementById('form').onsubmit = function (e) {
    e.preventDefault();
    validateForm();
}

// -----------------{Form validation}--------------------
function validateForm() {
    var nameInput = document.getElementById('name');
    var phoneInput = document.getElementById('phone');
    var isValid = isValidPhone(phoneInput) && isValidName(nameInput);
    if (isValid) {
        createUser(currentUser, nameInput.value, phoneInput.value);
    }
}
// -------------------------------------------------------
