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
        isPhoneExists(nameInput, phoneInput);
    }
}

function isPhoneExists(nameInput, phoneInput) {
    firebase.database().ref('users/customers').orderByChild('phone').equalTo(phoneInput.value).limitToFirst(1).once('value').then(function (snapshot) {
        if (snapshot.val()) {
            phoneInput.style.borderBottom = '1px solid red';
            // TODO: Add a an error message container   
            alert('Phone number is already used by another customer');
        } else {
            phoneInput.style.borderBottom = '1px solid #31842c'
            createUser(currentUser, nameInput.value, phoneInput.value);
        }
    });
}
