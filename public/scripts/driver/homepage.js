// ---------------{Event listeners}------------------
var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
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
        window.location.href = "/sessionLogout";
    }).catch((error) => {
        alert(error.message);
    });
}
// ----------------------------------------------------------

// -----------------{Get requests from firebase}----------------
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
        updateRequest(self.requestList, clickedRequest);
    };
};
ko.applyBindings(new myViewModel);


function getRequests(requestList) {
    // check if there is requests to show or not
    firebase.database().ref("requests/Active").orderByChild('state').equalTo('New').on("value", function (requests) {
        if (requests.val()) {
            document.getElementById("message").style.display = 'none';
            document.getElementById('orders').style.display = 'block';
            setRequestsData(requestList, requests);
        } else {
            document.getElementById("message").style.display = 'flex';
            document.getElementById('orders').style.display = 'none';
        }
        removeLoader();
    });
}

function setRequestsData(requestList, requests) {
    //get new requests from firebase
    requests.forEach(request => {
        var requestID = request.key;
        var id = request.val().id;
        var state = request.val().state;
        var date = request.val().date;
        var time = request.val().time;
        var customerId = request.val().customer_id;

        firebase.database().ref("users/customers/" + customerId).on("value", function (customer) {
            var customerName = customer.val().name;
            requestList.push(new Request(requestID, id, state, date, time, customerName));
        });
    });
}

function updateRequest(requestList, clickedRequest) {
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

function removeLoader() {
    var loader = document.getElementById('loader');
    if (loader) {
        var parent = loader.parentNode;
        parent.removeChild(loader);
    }
}
// --------------------------------------------------------------
