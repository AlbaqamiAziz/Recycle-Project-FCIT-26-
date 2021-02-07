// -----------------{Form validation}--------------------
function isValidName(nameInput) {
    var isValid = nameInput.value.length > 0;
    if (!isValid) {
        nameInput.style.borderBottom = '1px solid red';
        // TODO: Add a an error message container
        alert('Your name should not be empty');
    } else {
        nameInput.style.borderBottom = '1px solid #31842c';
    }
    return isValid;
}

function isValidPhone(phoneInput) {
    var isValid = phoneInput.value.length == 10 && phoneInput.value.startsWith('05') && /^\d+$/.test(phoneInput.value);
    if (!isValid) {
        phoneInput.style.borderBottom = '1px solid red';
        // TODO: Add a an error message container
        alert('Please enter a valid phone number');
    } else {
        phoneInput.style.borderBottom = '1px solid #31842c'
    }
    return isValid;
}

function isValidEmail(emailInput) {
    var isValid = emailInput.value.length > 0 && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(emailInput.value);
    if (!isValid) {
        emailInput.style.borderBottom = '1px solid red';
        // TODO: Add a an error message container
        alert('Please enter a valid email');
    } else {
        emailInput.style.borderBottom = '1px solid #31842c';
    }
    return isValid;
}

function isValidPassword(passwordInput) {
    var isValid = passwordInput.value.length >= 6;
    if (!isValid) {
        passwordInput.style.borderBottom = '1px solid red';
        // TODO: Add a an error message container
        alert('Your password should be 6 digits at least');
    } else {
        passwordInput.style.borderBottom = '1px solid #31842c';
    }
    return isValid;
}

// -----------------------------------------------------------------


// -----------------{Create user & add him to the database}---------------------
function writeUserData(newUser, uid) {
    firebase.database().ref('users/customers/' + uid).set(newUser, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        } else {
            window.location.href = "customerPages/homepage.html";
        }
    });
}

function createUser(user, name, phone, email) {
    var newUser = {
        name: name,
        phone: phone,
        email: email,
        type: 'customer',
        location: '',
        current_points: 0,
        total_points: 0
    };
    writeUserData(newUser, user.uid);
}
// ------------------------------------------------------------------------