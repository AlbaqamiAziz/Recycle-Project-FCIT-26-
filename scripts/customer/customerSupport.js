//save the current user
var currentUser;

firebase.auth().onAuthStateChanged(function (user) {
    currentUser = user;
    //get chats from firebase
    firebase.database().ref("userChats/" + currentUser.uid).once("value", function (snapshot) {
        if (snapshot.val()) {
            window.location.href = 'chat.html';
        } else {
            removeElement(document.getElementById('loader'));
            document.getElementById('form').style.display = 'flex';
        }
    });
});

document.getElementById('backBtn').onclick = function () {
    window.location.href = "homepage.html";
}

document.getElementById('form').onsubmit = function (e) {
    e.preventDefault();
    validateForm();
}


function removeElement(element) {
    var parent = element.parentNode;
    parent.removeChild(element);
}

function validateForm() {
    var subjectInput = document.getElementById('subject');
    var typeInput = document.getElementById('type');
    var isValid = isValidSubject(subjectInput) && isTypeSelected(typeInput);
    if (isValid) {
        createChat(subjectInput.value, typeInput.value);
    }
}

function isValidSubject(subjectInput) {
    var isValid = subjectInput.value.length > 0;
    if (!isValid) {
        subjectInput.style.borderBottom = '1px solid red';
        // TODO: Add a an error message container
        alert('Subject should not be empty');
    } else {
        subjectInput.style.borderBottom = '1px solid #31842c';
    }
    return isValid;
}

function isTypeSelected(typeInput) {
    var isValid = typeInput.value != 'none';
    if (!isValid) {
        typeInput.style.borderBottom = '1px solid red';
        // TODO: Add a an error message container
        alert('Please select a type');
    } else {
        typeInput.style.borderBottom = '1px solid #31842c';
    }
    return isValid;
}

function createChat(subject, type) {
    var newChatRef = firebase.database().ref("chats").push();

    //add the chat referance to the users' chats list
    var userChat = firebase.database().ref("userChats/" + currentUser.uid).push();
    userChat.set({ chatID: newChatRef.key });

    //add the chat referance to the second users' chats list
    //open chat with the admin
    userChat = firebase.database().ref("userChats/P5XHkjrmNgYxYuNLW67aPLBF5NW2").push();
    userChat.set({ chatID: newChatRef.key });

    //create new chat refrance
    newChatRef.set({
        members: {
            firstUser: currentUser.uid,
            secondUser: 'P5XHkjrmNgYxYuNLW67aPLBF5NW2'
        },
        lastMessage: "",
        subject: subject,
        type: type
    }, function (error) {
        if (error) {
            var errorMessage = error.message;
            alert(errorMessage);
        } else {
            window.location.href = 'chat.html';
        }
    });
}