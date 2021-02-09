// -----------------{Event listeners}---------------- 
var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        var providerId = user.providerData[0].providerId;

        currentUser = user;
        getUserData(providerId);
    }
});

document.getElementById('form').onsubmit = function (e) {
    e.preventDefault();
    validateForm();
}

document.getElementById('backBtn').onclick = function () {
    window.location.href = "homepage.html";
};

document.getElementById('cancelBtn').onclick = function () {
    if (confirm("Are you sure you want to cancel the changes?")) {
        window.location.href = "homepage.html";
    }
}


// -------------------------------------------------------

var notGoogle = true;
function getUserData(providerId) {
    var userRef = firebase.database().ref('users/' + currentUser.uid);
    userRef.once('value', (snapshot) => {
        var name = snapshot.val().name;
        var phone = snapshot.val().phone;
        var email = currentUser.email;

        document.getElementById("name").value = name;
        document.getElementById('phone').value = phone;
        document.getElementById('email').value = email;

        //if the user signed in using google account he can't change his email
        if (providerId == 'google.com') {
            removeElement(document.getElementById('email-container'));
            notGoogle = false;
        }

        // remove the loader after retriving customer's data
        removeElement(document.getElementById('loader'));
        document.getElementById('form').style.display = 'flex';
    });
}

function removeElement(element) {
    var parent = element.parentNode;
    parent.removeChild(element);
}
// -------------------------------------------------------

// -----------------{Form validation}-------------------
function validateForm() {
    var nameInput = document.getElementById('name');
    var phoneInput = document.getElementById('phone');
    var emailInput = document.getElementById('email');
    var isValid;
    if (notGoogle) {
        isValid = isValidName(nameInput) && isValidEmail(emailInput) && isValidPhone(phoneInput);
    } else {
        isValid = isValidName(nameInput) && isValidPhone(phoneInput);
    }

    if (isValid && notGoogle) {
        updateUserEmail(nameInput.value, phoneInput.value, emailInput.value);
    } else if (isValid) {
        updateUserData(nameInput.value, phoneInput.value);
    }
}


function updateUserEmail(name, phone, email) {
    if (notGoogle && email != currentUser.email) {
        currentUser.updateEmail(email).then(function () {
            updateUserData(name, phone);
        }).catch(function (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        });
    } else {
        updateUserData(name, phone);
    }
}

function updateUserData(name, phone) {
    firebase.database().ref('users/' + currentUser.uid).update({
        name: name,
        phone: phone,
    }, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        } else {
            alert('Profile has been updated');
            window.location.href = "homepage.html";
        }
    });
}
// -----------------------------------------------------------------