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
    document.getElementById('table').style.display = 'table';

    var Certifecate = function(id, date, points) {
        this.id = ko.observable(id);
        this.date = ko.observable(date);
        this.points = ko.observable(points);
    };

    var myViewModel = function() {
        var self = this;
        this.certificateList = ko.observableArray();

        // get all certificates 
        getCertifecates(this.certificateList);

        this.showCertifecate = function(clickedCertifecate) {
            localStorage.setItem('points', clickedCertifecate.points());
            window.location.assign("/certificate");
        };
    };
    ko.applyBindings(new myViewModel);

    function getCertifecates(certificateList) {
        firebase.database().ref("certificates/").orderByChild('customer_id').equalTo(currentUser.uid).once("value").then(function(certificate) {
            if (!certificate.val()) {
                document.getElementById("message").style.display = 'flex';
                document.getElementById('certificates').style.display = 'none';
            } else {
                document.getElementById("message").style.display = 'none';
                document.getElementById('certificates').style.display = 'flex';
            }
        });

        firebase.database().ref("certificates/").orderByChild('customer_id').equalTo(currentUser.uid).on("child_added", function(certificate) {
            certificateList.push(new Certifecate(certificate.key, certificate.val().date, certificate.val().points));
        });
    }
}