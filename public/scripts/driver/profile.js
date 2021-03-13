// -----------------{Event listeners}---------------- 
var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        getUserData();
    }
});

document.getElementById('form').onsubmit = function (e) {
    e.preventDefault();
    validateForm();
}

document.getElementById('backBtn').onclick = function () {
    window.location.href = "/homepage";
};

document.getElementById('cancelBtn').onclick = function () {
    if (confirm("Are you sure you want to cancel the changes?")) {
        window.location.href = "homepage.html";
    }
}
// -------------------------------------------------------

// -----------------{Form validation}-------------------
function validateForm() {
    var nameInput = document.getElementById('name');
    var phoneInput = document.getElementById('phone');
    var emailInput = document.getElementById('email');
    var isValid = isValidName(nameInput) && isValidEmail(emailInput) && isValidPhone(phoneInput);

    if (isValid) {
        updateUserEmail(nameInput.value, phoneInput.value, emailInput.value);
    }
}
// --------------------------------------------------------

// -----------------{Get data from firebase}----------------
function getUserData() {
    firebase.database().ref('users/drivers/' + currentUser.uid).once('value', (snapshot) => {
        var name = snapshot.val().name;
        var phone = snapshot.val().phone;
        var email = currentUser.email;

        document.getElementById("name").value = name;
        document.getElementById('phone').value = phone;
        document.getElementById('email').value = email;

        // remove the loader after retriving customer's data
        removeElement(document.getElementById('loader'));
        document.getElementById('form').style.display = 'flex';
    });
}
// -------------------------------------------------------

// ------------------{Update user}--------------------
function updateUserEmail(name, phone, email) {
    if (email != currentUser.email) {
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
    firebase.database().ref('users/drivers/' + currentUser.uid).update({
        name: name,
        phone: phone,
    }, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        } else {
            alert('Profile has been updated');
            window.location.href = "/homepage";
        }
    });
}
// --------------------------------------------------------

function removeElement(element) {
    var parent = element.parentNode;
    parent.removeChild(element);
}