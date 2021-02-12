function getAdminName() {
    var ref = firebase.database().ref("users/admins/" + currentUser.uid);
    ref.once("value").then(function (snapshot) {
        document.getElementById("adminName").innerText = snapshot.val().name;
    });
}

document.getElementById("logout").onclick = function () {
    firebase.auth().signOut().then(() => {
        window.location.href = "../../index.html";
    })
};