// ---------------{Event listeners}------------------
var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        // getUserData();
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
    //get new requests from firebase
    firebase.database().ref("requests/Active").orderByChild('state').equalTo('new').on("child_added", function (request) {
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
        var loader = document.getElementById('loader');
        if (loader) {
            removeElement(loader);
            document.getElementById('orders').style.display = 'block';
        }
    });
}

function updateRequest(requestList, clickedRequest) {
    //get new requests from firebase
    firebase.database().ref("requests/Active/" + clickedRequest.requestID()).update({
        state: 'accepted',
        driver_id: currentUser.uid
    }, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        } else {
            appendRequestToDriver(requestList, clickedRequest);
        }
    });
}

function appendRequestToDriver(requestList, clickedRequest) {
    firebase.database().ref('user-requests/' + currentUser.uid + '/' + clickedRequest.requestID()).set({
        request_id: clickedRequest.requestID()
    }, function (error) {
        if (error) {
            var errorMessage = error.message;
            // TODO: Add a an error message container
            alert(errorMessage);
        } else {
            // remove the request from the list
            requestList.remove(clickedRequest);
        }
    });
}

function removeElement(element) {
    var parent = element.parentNode;
    parent.removeChild(element);
}
// --------------------------------------------------------------
