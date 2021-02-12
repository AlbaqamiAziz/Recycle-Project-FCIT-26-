var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        app();
    }
});

function app() {
    getAdminName();

    document.getElementById('openBtn').onclick = function () {
        document.getElementById("myOverlay").style.display = "block";
    }

    document.getElementById('closeBtn').onclick = function () {
        document.getElementById("myOverlay").style.display = "none";
    }

    document.getElementById('addForm').onsubmit = function (e) {
        e.preventDefault();
        validateForm();
    }



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

    function validateForm() {
        var nameInput = document.getElementById('name');
        var phoneInput = document.getElementById('phone');
        var emailInput = document.getElementById('email');
        var passwordInput = document.getElementById('password');
        var isValid = isValidName(nameInput) && isValidEmail(emailInput) && isValidPhone(phoneInput) && isValidPassword(passwordInput);
        if (isValid) {
            createDriver(nameInput.value, phoneInput.value, emailInput.value, passwordInput.value);
        }
    }

    function createDriver(name, phone, email, password) {
        var newDriver = {
            name: name,
            phone: phone,
            email: email,
            password: password
        };
        writeDriverData(newDriver);
    }

    function writeDriverData(newDriver) {
        var newRef = firebase.database().ref('new_drivers/').push();
        newRef.set(newDriver, function (error) {
            if (error) {
                var errorMessage = error.message;
                // TODO: Add a an error message container
                alert(errorMessage);
            } else {
                alert('Driver has been Created');
                document.getElementById("myOverlay").style.display = "none";
            }
        });
    }

    var Driver = function (id, name, phone, email, totalRequests) {
        this.id = ko.observable(id);
        this.name = ko.observable(name);
        this.phone = ko.observable(phone);
        this.email = ko.observable(email);
        this.totalRequests = ko.observable(totalRequests);
    };

    var myViewModel = function () {
        var self = this;
        this.driverList = ko.observableArray();
        this.currentDriver = ko.observable();

        // get all drivers
        getDrivers(this.driverList);

        this.edit = function (clickedDriver) {
            console.log('edit');
        };

        this.delete = function (clickedDriver) {
            console.log('delete');
        };
    };
    ko.applyBindings(new myViewModel);

    function getDrivers(driverList) {
        driverList.removeAll();

        firebase.database().ref("users/drivers").on("child_added", function (snapshot) {
            driverList.push(new Driver(snapshot.key, snapshot.val().name, snapshot.val().phone, snapshot.val().email, snapshot.val().total_requests));
        });
    }
}