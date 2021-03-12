// ------------------{Event listeners}-------------------
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currentUser = user;
        app();
    }
});

document.getElementById('backBtn').onclick = function() {
        window.location.assign("/home");
    }
    // ------------------------------------------------------

function app() {
    var categories = ['Active', 'Previous', 'Canceled'];

    document.getElementById('table').style.display = 'table';

    // the category is the top bar item that contains a list of requests
    var Category = function(name, list) {
        this.name = ko.observable(name);
        this.list = ko.observableArray(list);
        this.active = ko.observable(false);
        //for the class binding
        this.checkActive = ko.computed(function() {
            return this.active() == true ? 'active' : '';
        }, this);
    };

    // the request that will be stored in each category
    var Request = function(requestID, id, state, date, time) {
        this.requestID = ko.observable(requestID);
        this.id = ko.observable(id);
        this.state = ko.observable(state);
        this.date = ko.observable(date);
        this.time = ko.observable(time);
    };

    var myViewModel = function() {
        var self = this;
        this.categoryList = ko.observableArray();
        this.currentCategory = ko.observable();

        // get all category 
        getCategory(this.categoryList);
        this.categoryList().forEach((category) => {
            getRequests(category);
        });

        // an event listiner that will be triggered when a category is clicked
        this.displayCategory = function(clickedCategory) {
            if (self.currentCategory()) {
                self.currentCategory().active(false);
            }
            clickedCategory.active(true);
            self.currentCategory(clickedCategory);

            firebase.database().ref("requests/" + clickedCategory.name()).orderByChild('customer_id').equalTo(currentUser.uid).on("value", function(request) {
                if (!request.val()) {
                    document.getElementById("message").style.display = 'flex';
                    document.getElementById('orders').style.display = 'none';
                } else {
                    document.getElementById("message").style.display = 'none';
                    document.getElementById('orders').style.display = 'flex';
                }
            });
        };

        this.displayCategory(this.categoryList()[0]);

        this.showRequest = function(clickedRequest) {
            localStorage.setItem('requestID', clickedRequest.requestID());
            localStorage.setItem('state', self.currentCategory().name());
            window.location.assign("/details");
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
        currentCategory.list.removeAll();

        firebase.database().ref("requests/" + currentCategory.name()).orderByChild('customer_id').equalTo(currentUser.uid).on("child_added", function(request) {
            currentCategory.list.push(new Request(request.key, request.val().id, request.val().state, request.val().date, request.val().time));
        });

        firebase.database().ref("requests/" + currentCategory.name()).orderByChild('customer_id').equalTo(currentUser.uid).on("child_removed", function(removedRequest) {
            currentCategory.list().forEach(request => {
                if (request.requestID() == removedRequest.key) {
                    currentCategory.list.remove(request);
                }
            });
        });
    }
}