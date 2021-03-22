function getAdminName() {
    var ref = firebase.database().ref("users/admins/" + currentUser.uid);
    ref.once("value").then(function (snapshot) {
        document.getElementById("adminName").innerText = snapshot.val().name;
    });
}

document.getElementById("logout").onclick = function () {
    firebase.auth().signOut().then(() => {
        window.location.assign("/sessionLogout");
    }).catch((error) => {
        alert(error.message);
    });
};

function removeLoader() {
    document.getElementById('main-content').style.display = 'flex';
    var loader = document.getElementById('loader');
    if (loader) {
        removeElement(loader);
    }
}

function removeElement(element) {
    var parent = element.parentNode;
    parent.removeChild(element);
}