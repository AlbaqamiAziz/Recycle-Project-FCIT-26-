// ---------------{Event listeners}------------------
var currentUser, driverCity;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        getDriverCity();
    }
});

function getDriverCity() {
    firebase.database().ref("users/drivers/" + currentUser.uid).once("value", function (snapshot) {
        driverCity = snapshot.val().city;
        app();
    });
}

document.getElementById('openBtn').onclick = function () {
    document.getElementById("side_menu").style.width = "100%";
}

document.getElementById('closeBtn').onclick = function () {
    document.getElementById("side_menu").style.width = "0%";
}

document.getElementById('logoutBtn').onclick = function () {
    firebase.auth().signOut().then(() => {
        window.location.href = "/sessionLogout";
    }).catch((error) => {
        alert(error.message);
    });
}
// ----------------------------------------------------------

// -----------------{Get requests from firebase}----------------
function app() {
    var Request = function (requestID, id, state, date, time, customerName) {
        this.requestID = ko.observable(requestID);
        this.id = ko.observable(id);
        this.state = ko.observable(state);
        this.date = ko.observable(date);
        this.time = ko.observable(time);
        this.customerName = ko.observable(customerName);
        this.active = ko.observable(false);
        //for the class binding
        this.checkActive = ko.computed(function () {
            return this.active() == true ? 'toggle' : '';
        }, this);

        // if new request created show requests and hide message
        displayMessageAndReq('none', 'block');
    };

    var myViewModel = function () {
        var self = this;
        this.requestList = ko.observableArray();

        // get all requests 
        getRequests(this.requestList);


        // an event listiner that will be triggered when a request is clicked
        this.toggle = function (clickedRequest) {
            clickedRequest.active(!clickedRequest.active());
        };

        this.accept = function (clickedRequest) {
            updateRequest(clickedRequest);
        };
    };
    ko.applyBindings(new myViewModel);


    function getRequests(requestList) {
        // check if there is requests to show or not
        firebase.database().ref("requests/Active").orderByChild('state').equalTo('New').on("value", function (requests) {
            if (requests.val()) {
                requestList.removeAll();
                setRequestsData(requestList, requests);
            } else {
                // if there is no requests to show display message
                displayMessageAndReq('flex', 'none');
            }
            removeLoader();
        });
    }

    function setRequestsData(requestList, requests) {
        //get new requests from firebase
        requests.forEach(request => {
            // if the request are in the driver city
            if (request.val().city == driverCity) {
                var requestID = request.key;
                var id = request.val().id;
                var state = request.val().state;
                var date = request.val().date;
                var time = request.val().time;
                var customerId = request.val().customer_id;

                firebase.database().ref("users/customers/" + customerId).once("value", function (customer) {
                    var customerName = customer.val().name;
                    requestList.push(new Request(requestID, id, state, date, time, customerName));
                });
            }
        });
    }

    function updateRequest( clickedRequest) {
        //get new requests from firebase
        firebase.database().ref("requests/Active/" + clickedRequest.requestID()).update({
            state: 'Accepted',
            driver_id: currentUser.uid
        }, function (error) {
            if (error) {
                var errorMessage = error.message;
                // TODO: Add a an error message container
                alert(errorMessage);
            }
        });
    }

    function displayMessageAndReq(messageDisplay, reqDisplay) {
        document.getElementById("message").style.display = messageDisplay;
        document.getElementById('orders').style.display = reqDisplay;
    }

    function removeLoader() {
        var loader = document.getElementById('loader');
        if (loader) {
            var parent = loader.parentNode;
            parent.removeChild(loader);
        }
    }
    // --------------------------------------------------------------
}
