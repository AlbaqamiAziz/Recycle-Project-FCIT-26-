var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        app();
    }
});

function app() {
    getAdminName();

    document.getElementById('search').onkeyup = function () {
        var input, filter, table, tr, td, i, txtValue;
        input = document.getElementById("search");
        filter = input.value.toUpperCase();
        table = document.getElementById("table");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[0];
            if (td) {
                txtValue = td.textContent || td.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }

    var Driver = function (id, name, phone, email, city) {
        this.id = ko.observable(id);
        this.name = ko.observable(name);
        this.phone = ko.observable(phone);
        this.email = ko.observable(email);
        this.city = ko.observable(city);
    };

    var myViewModel = function () {
        var self = this;
        this.driverList = ko.observableArray();
        this.currentDriver = ko.observable();

        // get all drivers
        getDrivers(this.driverList);

        this.delete = function (clickedDriver) {
            firebase.database().ref("new_drivers/" + clickedDriver.id()).remove();
            self.driverList.remove(clickedDriver);
            alert("Driver: "+ clickedDriver.name() + " has been deleted");
        };
    };
    ko.applyBindings(new myViewModel);

    function getDrivers(driverList) {
        driverList.removeAll();

        firebase.database().ref("new_drivers").on("child_added", function (snapshot) {
            driverList.push(new Driver(snapshot.key, snapshot.val().name, snapshot.val().phone, snapshot.val().email, snapshot.val().city));
            if (driverList.length == 0) {
                removeLoader();
            }
        });
    }
}