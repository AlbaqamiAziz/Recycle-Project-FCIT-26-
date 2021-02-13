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

function removeLoader(){
    document.getElementById('main-content').style.display = 'flex';
    removeElement(document.getElementById('loader'));
}

function removeElement(element) {
    var parent = element.parentNode;
    parent.removeChild(element);
}