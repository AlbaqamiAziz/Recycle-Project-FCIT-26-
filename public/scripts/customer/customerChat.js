// ------------------{Event listeners}-------------------
var currentUser;
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        currentUser = user;
        app();
    }
});

// Close the dropdown menu if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches('#openBtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
// -----------------------------------------------------

function app() {
    // -----------------------------{MVC}----------------------------
    var Chat = function (member, chatID) {
        this.member = ko.observable(member);
        this.chatID = ko.observable(chatID);
        this.messageList = ko.observableArray();
    }

    var Message = function (content, sender, timestamp, messageID) {
        this.content = ko.observable(content);
        this.sender = ko.observable(sender);
        this.timestamp = ko.observable(timestamp);
        this.chatID = ko.observable(messageID);
        this.checkSender = ko.computed(function () {
            return currentUser.uid == this.sender() ? 'me' : 'other';
        }, this);
    }

    var myViewModel = function () {
        var self = this;
        this.currentChat = ko.observable();

        getChats(this.currentChat);

        this.goBack = function () {
            window.location.href = 'homepage.html';
        }

        this.deleteMessages = function () {
            firebase.database().ref("chatMessages/" + self.currentChat().chatID()).remove();
        }

        this.endChat = function () {
            //remove all chat messages
            firebase.database().ref("chatMessages/" + self.currentChat().chatID()).remove();
            //remove chat 
            firebase.database().ref("chats/" + self.currentChat().chatID()).remove();
            firebase.database().ref("userChats/9dw5V2qAYdauGQzUBYtFzNu1C1G3/" + self.currentChat().chatID()).remove();
            firebase.database().ref("userChats/" + currentUser.uid + "/" + self.currentChat().chatID()).remove();
        }


        firebase.database().ref("userChats/" + currentUser.uid).on("child_removed", function () {
            alert("Your chat with " + self.currentChat().member() + " has been deleted");
            window.location.href = 'homepage.html';
        });

        this.openSideMenu = function () {
            document.getElementById("myDropdown").classList.add("show");
        }

        this.sendMessage = function () {
            var newMessage = document.getElementById("newMessage").value;
            if (newMessage.length > 0) {
                var messageRef = firebase.database().ref("chatMessages/" + self.currentChat().chatID()).push();
                messageRef.set({
                    sender: currentUser.uid,
                    content: newMessage,
                });

                firebase.database().ref("chats/" + self.currentChat().chatID()).update({
                    lastMessage: newMessage
                });

                document.getElementById("newMessage").value = "";
                var elem = document.getElementById('messages');
                elem.scrollTop = elem.scrollHeight;
            }
        }
    };
    // ---------------------------------------------------------------

    function removeElement(element) {
        var parent = element.parentNode;
        parent.removeChild(element);
    }

    function getChats(currentChat) {
        //get chats from firebase
        firebase.database().ref("userChats/" + currentUser.uid).on("child_added", function (snapshot) {
            var chatID = snapshot.val().chatID;
            firebase.database().ref("chats/" + chatID).once("value", function (chat) {
                var members = chat.val().members;
                //get the other members' id 
                var senderID = members.firstUser == currentUser.uid ? members.secondUser : members.firstUser;

                firebase.database().ref("users/admins/" + senderID).once("value", function (user) {
                    currentChat(new Chat(user.val().name, chat.key));
                    getMessages(currentChat);

                    // remove the loader
                    removeElement(document.getElementById('loader'));
                    document.getElementById('display').style.display = 'block';
                });
            });
        });
    }

    function getMessages(currentChat) {
        //get chats from firebase
        firebase.database().ref("chatMessages/" + currentChat().chatID()).on("child_added", function (chatMessage) {
            currentChat().messageList.push(new Message(chatMessage.val().content, chatMessage.val().sender, chatMessage.val().timestamp, chatMessage.key));
            var elem = document.getElementById('messages');
            elem.scrollTop = elem.scrollHeight;
        });

        // listen for messages removed
        firebase.database().ref("chatMessages/" + currentChat().chatID()).on("child_removed", function () {
            currentChat().messageList.removeAll();
            var elem = document.getElementById('messages');
            elem.scrollTop = elem.scrollHeight;
        });
    }
    ko.applyBindings(new myViewModel);
}