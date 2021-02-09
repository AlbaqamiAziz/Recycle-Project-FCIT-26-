// Open sidemenu
document.getElementById('openBtn').onclick = function () {
    document.getElementById("side_menu").style.width = "100%";
}

// close sidemenu
document.getElementById('closeBtn').onclick = function () {
    document.getElementById("side_menu").style.width = "0%";
}

// logout
document.getElementById('logoutBtn').onclick = function () {
    firebase.auth().signOut().then(() => {
        window.location.href = "../login.html";
    }).catch((error) => {
        alert(error.message);
    });
}

document.getElementById('newRequestbtn').onclick = function(){
    window.location.href = "newRequest.html";
}

var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        getUserData();
    }
});

function getUserData() {
    var userRef = firebase.database().ref('users/' + currentUser.uid);
    userRef.on('value', (snapshot) => {
        var points = snapshot.val().current_points;
        var name = snapshot.val().name;
        var index = name.indexOf(" ");
        name = (index > -1) ? name.substring(0, index) : name;
        document.getElementById("name").innerHTML = name;
        document.getElementById('points').innerText = points;
        document.getElementById('name').innerText = name;
    });
}