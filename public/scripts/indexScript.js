firebase.database().ref("requests/Previous").once("value").then(function(snapshot) {
    document.getElementById('num').innerText = snapshot.numChildren()
});