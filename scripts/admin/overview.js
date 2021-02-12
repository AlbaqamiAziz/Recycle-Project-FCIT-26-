var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        app();
    }
});

function app() {
    getAdminName();
    getNumOfRequests();
    getNumOf("customers");
    getNumOf("drivers");
    getChart();

    var Driver = function (name, totalRequests) {
        this.name = ko.observable(name);
        this.totalRequests = ko.observable(totalRequests);
    };

    var myViewModel = function () {
        var self = this;
        this.driverList = ko.observableArray();

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

        firebase.database().ref("users/drivers").orderByChild('total-requests').limitToFirst(5).once("value", function (snapshot) {
            snapshot.forEach(driver => {
                driverList.push(new Driver(driver.val().name, driver.val().total_requests));
            });
        });
    }
}
function getNumOfRequests() {
    var ref = firebase.database().ref("requests/Active");
    ref.once("value").then(function (snapshot) {
        document.getElementById("active-requests").innerText = snapshot.numChildren();
    });
}
function getNumOf(type) {
    firebase.database().ref("users/" + type).once("value").then(function (snapshot) {
        document.getElementById("total-" + type).innerText = snapshot.numChildren();
    });
}
function getChart() {
    // var array = ["Month", "Process", { role: "style" }];
    // getRequestsPerMonth(array);

    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ["Month", "Process", { role: "style" }],
            ["Jan", 8, "#48722c"],
            ["Feb", 10, "#517f32"],
            ["Mar", 19, "#598b38"],
            ["June", 17, "#679f41"],
            ["July", 10, "#6da845"],
            ["Aug", 23, "#7eb25d"],
            ["Sep", 6, "#94bd7f"],
            ["Oct", 5, "#a6c796"],
            ["Nov", 4, "#b7d0ab"],
            ["Dec", 7, "#d4e2ce"],
        ]);

        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1,
            {
                calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation"
            },
            2]);

        var options = {
            bar: { groupWidth: "20%" },
            legend: { position: "none" },
        };
        var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
        chart.draw(view, options);
    }

    // function getRequestsPerMonth(array) {
    //     const monthNames = ["January", "February", "March", "April", "May", "June",
    //         "July", "August", "September", "October", "November", "December"
    //     ];

    //     var ref = firebase.database().ref("requests/Active");
    //     ref.once("value").then(function (snapshot) {
    //         snapshot.forEach(element => {
    //             var date = new Date(element.val().date);
    //             console.log(monthNames[date.getMonth()]);
    //         });
    //     });
    // }
}