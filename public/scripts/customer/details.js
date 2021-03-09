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
        var requestState = request.val().state;

        setRequestData(date, time, id, driverID, state, requestState);

        removeElement(document.getElementById('loader'));
        document.getElementById('order').style.display = 'flex';
    });
}

function setRequestData(date, time, id, driverID, state, requestState) {
    // set request details
    document.getElementById("date").innerText = date;
    document.getElementById('id').innerText = id;
    document.getElementById('time').innerText = time;
    document.getElementById('state').innerText = requestState;

    var callBtn = document.getElementById('callBtn');
    var cancelBtn = document.getElementById('cancelBtn');

    // check if request is accepted by driver
    if (driverID == '') {
        removeElement(callBtn);
        document.getElementById('driver').innerText = 'Request is not accepted yet';
    } else {
        firebase.database().ref('users/drivers/' + driverID).once('value', (driver) => {
            var driverName = driver.val().name;
            var driverPhone = driver.val().phone;
            document.getElementById('driver').innerText = driverName;
            if (state == 'Active') {
                callBtn.href = 'tel:' + driverPhone;
            }
        });
    }

    if (state == 'Canceled' || state == 'Previous') {
        callBtn = document.getElementById('callBtn');
        if (callBtn) {
            removeElement(callBtn);
        }
        removeElement(cancelBtn);
    }
}
// -------------------------------------------------------

// ----------------{Cancel request}---------------
function cancelRequest() {
    // Remove request from active 
    firebase.database().ref('requests/' + localStorage.getItem('state') + '/' + cuurentRequest.key).remove();

    // copy request data to a new request
    var request = cuurentRequest.val();
    request.state = 'canceled';

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