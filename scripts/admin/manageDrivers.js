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
        var isValid = isValidName(nameInput) && isValidEmail(emailInput) && isValidPhone(phoneInput);
        if (isValid) {
            isPhoneExists(nameInput, phoneInput, emailInput);
        }
    }

    function isPhoneExists(nameInput, phoneInput, emailInput) {
        firebase.database().ref('users/drivers').orderByChild('phone').equalTo(phoneInput.value).limitToFirst(1).once('value').then(function (snapshot) {
            if (snapshot.val()) {
                phoneInput.style.borderBottom = '1px solid red';
                // TODO: Add a an error message container   
                alert('Phone number is already used by another driver');
            } else {
                phoneInput.style.borderBottom = '1px solid #31842c'
                createDriver(nameInput.value, phoneInput.value, emailInput.value);
            }
        });
    }

    function createDriver(name, phone, email) {
        var newDriver = {
            name: name,
            phone: phone,
            email: email,
            password: generatePassword()
        };
        writeDriverData(newDriver);
    }

    function generatePassword() {
        var pass = '';
        var str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
            'abcdefghijklmnopqrstuvwxyz0123456789@#$';

        for (i = 1; i <= 8; i++) {
            var char = Math.floor(Math.random()
                * str.length + 1);

            pass += str.charAt(char)
        }

        return pass;
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
                document.getElementById('addForm').reset();
                document.getElementById("myOverlay").style.display = "none";

                var subject = "Account information for your Recycle account"
                var body = "Hello, welcome to our Recycle team. We are looking forward to working with you " + newDriver.name + ".%0D%0A%0D%0A" +
                    "Use the following information to login to your account:%0D%0A%0D%0A" +
                    "Email: " + newDriver.email + "%0D%0APassword: " + newDriver.password + "%0D%0A%0D%0A" +
                    "Follow this link to activate your account: link will be here soon"+
                    "𝐃𝐨 𝐧𝐨𝐭 𝐟𝐨𝐫𝐠𝐞𝐭 𝐭𝐨 𝐜𝐡𝐚𝐧𝐠𝐞 𝐲𝐨𝐮𝐫 𝐩𝐚𝐬𝐬𝐰𝐨𝐫𝐝";

                window.open('mailto:' + newDriver.email + '?subject=' + subject + '&body=' + body);
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
            if (driverList.length == 0) {
                removeLoader();
            }
        });
    }
}