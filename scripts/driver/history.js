// ------------------{Event listeners}-------------------
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        app();
    }
});

document.getElementById('backBtn').onclick = function () {
    window.location.href = "homepage.html";
}
// ------------------------------------------------------

function app() {
    var categories = ['Active', 'Previous', 'Canceled'];

    document.getElementById('table').style.display = 'table';

    // the category is the top bar item that contains a list of requests
    var Category = function (name, list) {
        this.name = ko.observable(name);
        this.list = ko.observableArray(list);
        this.active = ko.observable(false);
        //for the class binding
        this.checkActive = ko.computed(function () {
            return this.active() == true ? 'active' : '';
        }, this);
    };

    // the request that will be stored in each category
    var Request = function (requestID, id, state, date, time) {
        this.requestID = ko.observable(requestID);
        this.id = ko.observable(id);
        this.state = ko.observable(state);
        this.date = ko.observable(date);
        this.time = ko.observable(time);
    };

    var myViewModel = function () {
        var self = this;
        this.categoryList = ko.observableArray();
        this.currentCategory = ko.observable();

        // get all category 
        getCategory(this.categoryList);

        // an event listiner that will be triggered when a category is clicked
        this.displayCategory = function (clickedCategory) {
            if (self.currentCategory()) {
                self.currentCategory().active(false);
            }
            clickedCategory.active(true);
            self.currentCategory(clickedCategory);
            getRequests(self.currentCategory);
        };

        this.showRequest = function (clickedRequest) {
            localStorage.setItem('requestID', clickedRequest.requestID());
            localStorage.setItem('state', clickedRequest.state());
            window.location.href = "details.html";
        };
    };
    ko.applyBindings(new myViewModel);

    function getCategory(categoryList) {
        categories.forEach(category => {
            categoryList.push(new Category(category));
        });
    }

    function getRequests(currentCategory) {
        //clear current requests
        currentCategory().list.removeAll();

        firebase.database().ref("user-requests/" + currentUser.uid).on("child_added", function (snapshot) {
            var requestID = snapshot.val().request_id;
            firebase.database().ref("requests/" + currentCategory().name() + '/' + requestID).on("value", function (request) {
                if (request.val()) {
                    currentCategory().list.push(new Request(request.key, request.val().id, request.val().state, request.val().date, request.val().time));
                }
            });
        });
        // TODO remove request
    }
}