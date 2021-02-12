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

document.getElementById('callBtn').onclick = function () {
    console.log('call');
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
        var location = request.val().location;
        var customerID = request.val().customer_id;

        setRequestData(date, time, id, location, customerID, state);
    });
}

function setRequestData(date, time, id, location, customerID, state) {
    // set request details
    document.getElementById("date").innerText = date;
    document.getElementById('id').innerText = id;
    document.getElementById('time').innerText = time;

    firebase.database().ref('users/' + customerID).once('value', (customer) => {
        var customerName = customer.val().name;
        document.getElementById('customer').innerText = customerName;

        // remove loader
        removeElement(document.getElementById('loader'));
        document.getElementById('order').style.display = 'flex';
    });

    document.getElementById('locationBtn').onclick = function () {
        window.open(location);
    };

    if (state == 'Canceled' || state == 'Previous') {
        var callBtn = document.getElementById('callBtn');
        if (callBtn) {
            removeElement(callBtn);
        }
        removeElement(document.getElementById('locationBtn'));
    }
}
// -------------------------------------------------------

function removeElement(element) {
    var parent = element.parentNode;
    parent.removeChild(element);
}