// ---------------{Event listeners}------------------
var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        getUserData();
    }
});

document.getElementById('openBtn').onclick = function () {
    document.getElementById("side_menu").style.width = "100%";
}

document.getElementById('closeBtn').onclick = function () {
    document.getElementById("side_menu").style.width = "0%";
}

document.getElementById('logoutBtn').onclick = function () {
    firebase.auth().signOut().then(() => {
        window.location.href = "../login.html";
    }).catch((error) => {
        alert(error.message);
    });
}

document.getElementById('newRequestbtn').onclick = function () {
    window.location.href = "newRequest.html";
}
// ----------------------------------------------------------

// -----------------{Get data from firebase}----------------
function getUserData() {
    firebase.database().ref('users/customers/' + currentUser.uid).on('value', (snapshot) => {
        var points = snapshot.val().current_points;
        var name = snapshot.val().name;

        var index = name.indexOf(" ");
        name = (index > -1) ? name.substring(0, index) : name;
        
        var numOfRequests = snapshot.val().total_requests;
        setUserData(name, points, numOfRequests);
    });
}

function setUserData(name, points, numOfRequests) {
    document.getElementById("name").innerHTML = name;
    document.getElementById('points').innerText = points;
    document.getElementById('requests').innerText = numOfRequests;
}
// ----------------------------------------------------------
