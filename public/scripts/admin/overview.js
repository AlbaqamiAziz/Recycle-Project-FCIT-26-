var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        app();
    }
});

function app() {
    MVC();
    getAdminName();
    getNumOf("requests/Active", "active-requests");
    getNumOf("users/customers", "total-customers");
    getNumOf("users/drivers", "total-drivers");
    getChart();
}

function MVC() {
    var Driver = function (name, totalRequests) {
        this.name = ko.observable(name);
        this.totalRequests = ko.observable(totalRequests);
    };

    var myViewModel = function () {
        this.driverList = ko.observableArray();

        // get all drivers
        getDrivers(this.driverList);
    };
    ko.applyBindings(new myViewModel);

    function getDrivers(driverList) {
        driverList.removeAll();

        firebase.database().ref("users/drivers").orderByChild('total_requests').limitToLast(5).once("value", function (snapshot) {
            snapshot.forEach(driver => {
                console.log(driver.val());
                driverList.push(new Driver(driver.val().name, driver.val().total_requests));
            });
        });
    }
}

function getNumOf(ref,elementId) {
    firebase.database().ref(ref).once("value").then(function (snapshot) {
        document.getElementById(elementId).innerText = snapshot.numChildren();
    });
}

function getChart() {
    var reqPerMonth = [
        ["Month", "Process", { role: "style" }],
        ["Jan", 0, "#48722c"],
        ["Feb", 0, "#517f32"],
        ["Mar", 0, "#598b38"],
        ["Apr", 0, "#517f26"],
        ["June", 0, "#679f41"],
        ["July", 0, "#6da845"],
        ["Aug", 0, "#7eb25d"],
        ["Sep", 0, "#94bd7f"],
        ["Oct", 0, "#a6c796"],
        ["Nov", 0, "#b7d0ab"],
        ["Dec", 0, "#d4e2ce"],
    ];

    // TODO make it with previous requests only
    var ref = firebase.database().ref("requests/Previous");
    ref.once("value").then(function (snapshot) {
        snapshot.forEach(request => {
            var date = new Date(request.val().date);
            reqPerMonth[date.getMonth() + 1][1] += 1;
        });
        startDraw(reqPerMonth);
    });
}

function startDraw(reqPerMonth) {
    removeLoader();
    google.charts.load("current", { packages: ["corechart"] });
    google.charts.setOnLoadCallback(drawChart);
    function drawChart() {
        var data = google.visualization.arrayToDataTable(reqPerMonth);

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
}