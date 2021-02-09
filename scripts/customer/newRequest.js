// -----------------{Init date picker}----------------  
var datePicker = document.getElementById("date");
var today = new Date();
var nextWeek = new Date();
nextWeek.setDate(nextWeek.getDate() + 7);

// calculate current date and one week
var min = dateFormat(today);
var max = dateFormat(nextWeek);

// set current, min and max
datePicker.min = min;
datePicker.value = min;
datePicker.max = max;


var timePicker = document.getElementById("time");
timePicker.min = '20:00';
timePicker.max = '24:00';

function dateFormat(date) {
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    return date.getFullYear() + "-" + month + "-" + day;
}
// --------------------------------------------------

// -----------------{Event listeners}---------------- 
document.getElementById('form').onsubmit = function (e) {
    e.preventDefault();
    validateForm();
}

document.getElementById('location').onchange = function () {
    var option = document.getElementById("location").value;
    if (option == "change") {
        document.getElementById('map').style.display = 'block';
    } else {
        document.getElementById('map').style.display = 'none';
    }
}

document.getElementById('backBtn').onclick = function () {
    window.location.href = "homepage.html";
}

var currentUser, savedLocation, newLocation;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        checkLocation();
    }
});


function checkLocation() {
    firebase.database().ref('/users/' + currentUser.uid).once('value').then(function (snapshot) {
        // if customer has registered location
        if (snapshot.val().location) {
            savedLocation = snapshot.val().location;
            document.getElementById('map').style.display = 'none';
        } else {
            document.getElementById('location').style.display = 'none';
        }
    });
}
// --------------------------------------------------

// -----------------{Form validation}--------------------
function validateForm() {
    var dateInput = document.getElementById('date');
    var timeInput = document.getElementById('time');
    var isValid = isTimeSelected(timeInput);
    if (isValid) {
        var option = document.getElementById("location").value;
        var selectedLocation = getSelectedLocation(option);
        createRequest(dateInput.value, timeInput.value, selectedLocation);
    }
}

function isTimeSelected(timeInput) {
    var isValid = timeInput.value != 'none';
    if (!isValid) {
        timeInput.style.borderBottom = '1px solid red';
        // TODO: Add a an error message container
        alert('Please select pickup time');
    } else {
        timeInput.style.borderBottom = '1px solid #31842c';
    }
    return isValid;
}

function getSelectedLocation(option) {
    var selectedLocation
    if (savedLocation) {
        selectedLocation = option == 'change' ? newLocation : savedLocation;
    } else {
        selectedLocation = newLocation;
    }
    return selectedLocation;
}
// ----------------------------------------------------------------------------------------------

// -----------------{Create request & add it to the database & update customers' location}---------------------
function createRequest(date, time, selectedLocation) {
    var newRequest = {
        date: date,
        time: time,
        state: 'new',
        location: selectedLocation
    };
    writeRequestData(newRequest, selectedLocation);
}

function writeRequestData(newRequest, selectedLocation) {

    var requestsRef = firebase.database().ref('requests');
    var newRequestRef = requestsRef.push();
    newRequestRef.set(newRequest, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(error.message);
        } else {
            appendRequestToCustomer(newRequestRef.key);
            updateUserLocation(selectedLocation);
        }
    });
}

function appendRequestToCustomer(newRequestRefKey) {
    firebase.database().ref('user-requests/' + currentUser.uid + '/' + newRequestRefKey).set({
        request_id: newRequestRefKey
    }, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        }
    });
}

function updateUserLocation(selectedLocation) {
    firebase.database().ref('users/' + currentUser.uid).update({
        location: selectedLocation
    }, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        } else {
            window.location.href = "homepage.html";
        }
    });
}
// ------------------------------------------------------------------------

// -----------------{Init map}----------------  
let map, infoWindow, marker, pos;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: {
            lat: 24.774265,
            lng: 46.738586
        },
        zoom: 7,
    });

    infoWindow = new google.maps.InfoWindow();
    map.addListener("click", (mapsMouseEvent) => {
        if (marker) {
            marker.setMap(null);
        }
        marker = new google.maps.Marker({
            position: mapsMouseEvent.latLng
        });
        marker.setMap(map);
        newLocation = "https://maps.google.com/?q=" + marker.getPosition().lat() + "," + marker.getPosition().lng();
    });
    getLocation();
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
    };
    map.setCenter(pos);
    map.setZoom(15);
    marker = new google.maps.Marker({
        position: pos
    });
    marker.setMap(map);
    newLocation = "https://maps.google.com/?q=" + position.coords.latitude + "," + position.coords.longitude;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(
        browserHasGeolocation ?
            "Error: The Geolocation service failed." :
            "Error: Your browser doesn't support geolocation."
    );
    infoWindow.open(map);
}
// --------------------------------------------------------------------
