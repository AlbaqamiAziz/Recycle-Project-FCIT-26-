// -----------------{Event listeners}---------------- 
var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        getUserDataToForm();
    }
});

document.getElementById('form').onsubmit = function (e) {
    e.preventDefault();
    validateForm();
}

document.getElementById('backBtn').onclick = function () {
    window.location.href = "/home";
};

document.getElementById('cancelBtn').onclick = function () {
    if (confirm("Are you sure you want to cancel the changes?")) {
        window.location.href = "/home";
    }
}
// -------------------------------------------------------

// -----------------{Form validation}-------------------
function validateForm() {
    var nameInput = document.getElementById('name');
    var phoneInput = document.getElementById('phone');
    var emailInput = document.getElementById('email');
    var cityInput = document.getElementById('city');
    var isValid = isValidName(nameInput) && isValidEmail(emailInput) && isValidPhone(phoneInput) && isCitySelected(cityInput);

    if (isValid) {
        updateUserEmail(nameInput.value, phoneInput.value, emailInput.value, cityInput.value);
    }
}
// --------------------------------------------------------

// -----------------{Get data from firebase}----------------
function getUserDataToForm() {
    firebase.database().ref('users/drivers/' + currentUser.uid).once('value', (snapshot) => {
        var name = snapshot.val().name;
        var phone = snapshot.val().phone;
        var email = currentUser.email;
        var city = snapshot.val().city;
        
        document.getElementById("name").value = name;
        document.getElementById('phone').value = phone;
        document.getElementById('email').value = email;
        document.getElementById(city).selected = true;
        
        // remove the loader after retriving customer's data
        removeElement(document.getElementById('loader'));
        document.getElementById('form').style.display = 'flex';
    });
}
// -------------------------------------------------------

// ------------------{Update user}--------------------
function updateUserEmail(name, phone, email, city) {
    if (email != currentUser.email) {
        currentUser.updateEmail(email).then(function () {
            updateUserData(name, phone, city);
        }).catch(function (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        });
    } else {
        updateUserData(name, phone, city);
    }
}

function updateUserData(name, phone, city) {
    firebase.database().ref('users/drivers/' + currentUser.uid).update({
        name: name,
        phone: phone,
        city: city
    }, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        } else {
            alert('Profile has been updated');
            window.location.href = "/home";
        }
    });
}
// --------------------------------------------------------

function removeElement(element) {
    var parent = element.parentNode;
    parent.removeChild(element);
}