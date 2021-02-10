// -----------------{Event listeners}---------------- 
var currentUser, cuurentRequest;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        getRequestData();
    }
});

document.getElementById('backBtn').onclick = function () {
    window.location.href = "history.html";
};

document.getElementById('cancelBtn').onclick = function () {
    document.getElementById('overlay').style.display = 'flex';
};

document.getElementById('yesBtn').onclick = function () {
    cancelRequest();
};

document.getElementById('noBtn').onclick = function () {
    document.getElementById('overlay').style.display = 'none';
};
// -------------------------------------------------------

// ----------------{Get data from firebase}---------------
function getRequestData() {
    var requestID = localStorage.getItem('requestID');
    var state = localStorage.getItem('state');

    // get request details
    firebase.database().ref('requests/' + state + '/' + requestID).once('value', (request) => {
        cuurentRequest = request;
        var date = request.val().date;
        var time = request.val().time;
        var id = request.val().id;
        var driverID = request.val().driver_id;

        setRequestData(date, time, id, driverID);

        removeElement(document.getElementById('loader'));
        document.getElementById('order').style.display = 'flex';
    });
}

function setRequestData(date, time, id, driverID) {
    // set request details
    document.getElementById("date").innerText = date;
    document.getElementById('id').innerText = id;
    document.getElementById('time').innerText = time;

    // check if request is accepted by driver
    if (driverID == '') {
        document.getElementById('driver').innerText = 'Request is not accepted yet';
        removeElement(document.getElementById('callBtn'));
    } else {
        firebase.database().ref('users/' + driverID).once('value', (driver) => {
            var driverName = driver.val().name;
            document.getElementById('driver').innerText = driverName;
        });
    }
}
// -------------------------------------------------------

// ----------------{Cancel request}---------------
function cancelRequest() {
    // Remove request from active 
    firebase.database().ref('requests/' + cuurentRequest.val().state + '/' + cuurentRequest.key).remove();
    
    // copy request data to a new request
    var request = cuurentRequest.val();
    request.state = 'Canceled';
    
    // add request from canceled 
    firebase.database().ref('requests/Canceled/' + cuurentRequest.key).set(request, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(error.message);
        } else {
            localStorage.clear();
            window.location.href = "history.html";
        }
    });
}
// -----------------------------------------------

function removeElement(element) {
    var parent = element.parentNode;
    parent.removeChild(element);
}