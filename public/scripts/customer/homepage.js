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
        window.location.assign("/sessionLogout"); // ---- edited here -------
    }).catch((error) => {
        alert(error.message);
    });
}

document.getElementById('newRequestbtn').onclick = function () {
    window.location.assign("/NewRequest");
}

document.getElementById('mid-btn').onclick = function () {
    window.location.assign("/History");
}

document.getElementById('certificates-btn').onclick = function () {
    window.location.assign("/certificateRecord");
}
// ----------------------------------------------------------

// -----------------{Get data from firebase}----------------
function getUserData() {
    firebase.database().ref('users/customers/' + currentUser.uid).on('value', (snapshot) => {
        var points = snapshot.val().current_points;
        var totalPoints = snapshot.val().total_points;
        var name = snapshot.val().name;

        var index = name.indexOf(" ");
        name = (index > -1) ? name.substring(0, index) : name;

        var numOfRequests = snapshot.val().total_requests;
        var numOfCertificates = totalPoints / 1000;
        setUserData(name, points, totalPoints, numOfRequests, numOfCertificates);
        checkCirteficates(numOfCertificates, totalPoints);
    });
}

function setUserData(name, points, totalPoints, numOfRequests, numOfCertificates) {
    document.getElementById("name").innerHTML = name;
    document.getElementById('points').innerText = points;
    document.getElementById('requests').innerText = numOfRequests;
    document.getElementById('certificates').innerText = numOfCertificates;
    document.getElementById('totalPoints').innerText = totalPoints;
    document.getElementById('usedPoints').innerText = totalPoints - points;
    document.getElementById('totalRiyals').innerText = points / 20;
}
// ----------------------------------------------------------


// -----------------{Create certificate & update customers' location}---------------------
function checkCirteficates(numOfCertificates, totalPoints) {
    if (numOfCertificates > 0) {
        firebase.database().ref("certificates/").orderByChild('customer_id').equalTo(currentUser.uid).once("value").then(function (snapshot) {
            if (snapshot.numChildren() < numOfCertificates) {
                createCertificate(totalPoints);
            }
        });
    }
}

function createCertificate(totalPoints) {
    // get certificate id
    firebase.database().ref("certificates/count").once("value").then(function (snapshot) {
        var newId = snapshot.val() + 1;
        var today = new Date();
        var date = dateFormat(today);

        var newCertificate = {
            id: newId,
            date: date,
            customer_id: currentUser.uid,
            points: totalPoints
        };
        updateCount(newId, newCertificate);
    });
}

function dateFormat(date) {
    var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    return date.getFullYear() + "-" + month + "-" + day;
}

function updateCount(newId, newCertificate) {
    firebase.database().ref('certificates').update({
        count: newId
    }, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        } else {
            // write the new certificate to the database
            writeCertificateData(newCertificate);
        }
    });
}

function writeCertificateData(newCertificate) {
    var certificatesRef = firebase.database().ref('certificates');
    var newCertificateRef = certificatesRef.push();
    newCertificateRef.set(newCertificate, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(error.message);
        }
    });
}
// -----------------------------------------------------------------------------------