// if driver is not registered search in new drivers
firebase.database().ref("requests/Closed").once("value").then(function(snapshot) {
    document.getElementById('num').innerText = snapshot.numChildren()
});