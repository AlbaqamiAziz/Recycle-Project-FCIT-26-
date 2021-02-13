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
    if (!event.target.matches("#openBtn")) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
}
// -----------------------------------------------------

function app() {
    getAdminName();

    // MVC
    var Chat = function (member, lastMessage, chatID) {
        this.member = ko.observable(member);
        this.lastMessage = ko.observable(lastMessage);
        this.chatID = ko.observable(chatID);
        this.messageList = ko.observableArray();
    }

    var Message = function (content, sender, timestamp, messageID) {
        this.content = ko.observable(content);
        this.sender = ko.observable(sender);
        this.timestamp = ko.observable(timestamp);
        this.chatID = ko.observable(messageID);
        this.checkSender = ko.computed(function () {
            return currentUser.uid == this.sender() ? "me" : "other";
        }, this);
    }

    var myViewModel = function () {
        var self = this;
        this.currentChat = ko.observable();
        this.chatList = ko.observableArray();

        getChats(self.chatList);

        this.displayChat = function (clickedChat) {
            self.currentChat(clickedChat);
            getMessages(self.currentChat);
        }

        this.deleteMessages = function () {
            firebase.database().ref("chatMessages/" + self.currentChat().chatID()).remove();
        }

        this.endChat = function () {
            // listen for chat removed
            firebase.database().ref("userChats/" + currentUser.uid).on("child_removed", function () {
                getChats(self.chatList);
                self.currentChat(null);
            });

            //remove chat from user chats
            removeRef(firebase.database().ref("userChats/P5XHkjrmNgYxYuNLW67aPLBF5NW2"));
            //remove all chat messages
            removeRef(firebase.database().ref("chatMessages/" + self.currentChat().chatID()));
            //remove chat 
            removeRef(firebase.database().ref("chats/" + self.currentChat().chatID()));
            removeRef(firebase.database().ref("userChats/" + currentUser.uid));
        }

        this.openSideMenu = function () {
            document.getElementById("myDropdown").classList.add("show");
        }

        this.sendMessage = function () {
            var newMessage = document.getElementById("newMessage").value;
            var messageRef = firebase.database().ref("chatMessages/" + self.currentChat().chatID()).push();
            messageRef.set({
                sender: currentUser.uid,
                content: newMessage,
            });

            firebase.database().ref("chats/" + self.currentChat().chatID()).update({
                lastMessage: newMessage
            });

            document.getElementById("newMessage").value = "";
        }
    };
    ko.applyBindings(new myViewModel);


    // ------------------{Event listeners}-------------------
    var foundUserID;
    document.getElementById("closeBtn").onclick = function () {
        document.getElementById("myOverlay").style.display = "none";
        document.getElementById("card").style.display = "none";
        document.getElementById("search").value = "";
        foundUserID = null;
    };

    document.getElementById("openSearchBtn").onclick = function () {
        document.getElementById("myOverlay").style.display = "block";
    };

    document.getElementById("search").onkeypress = function (e) {
        //if enter is pressed
        var phone = document.getElementById("search").value;
        findUserByName(phone);
    };

    document.getElementById("card").onclick = (function () {
        var newChatRef = firebase.database().ref("chats").push();

        //add the chat referance to the users" chats list
        var userChat = firebase.database().ref("userChats/" + currentUser.uid).push();
        userChat.set({
            chatID: newChatRef.key
        });

        //add the chat referance to the second users" chats list
        userChat = firebase.database().ref("userChats/" + foundUserID).push();
        userChat.set({
            chatID: newChatRef.key
        });

        //create new chat refrance
        newChatRef.set({
            members: {
                firstUser: currentUser.uid,
                secondUser: foundUserID
            },
            lastMessage: ""
        }, function (error) {
            if (error) {
                var errorMessage = error.message;
                alert(errorMessage);
            } else {
                document.getElementById("myOverlay").style.display = "none";
            }
        });
    });
    // -----------------------------------------------------

    // ------------------{Search for user}-------------------
    function findUserByName(phone) {
        //check if name exists
        firebase.database().ref("users/customers").orderByChild("phone").limitToFirst(1).equalTo(phone).once("value", function (users) {
            if (users.val()) {
                users.forEach((user) => {
                    //save user data
                    foundUserID = user.key;
                    document.getElementById("card-name").innerText = user.val().name;
                    //show the card and reset search
                    document.getElementById("card").style.display = "block";
                    document.getElementById("search").value = "";
                });
            } else {
                //hide the card
                document.getElementById("card").style.display = "none";
            }
        });
    }

    function createChat(chatList, senderID, chat) {
        //get the other member"s name
        firebase.database().ref("users/customers/" + senderID).once("value", function (user) {
            chatList.push(new Chat(user.val().name, chat.val().lastMessage, chat.key));
            if (chatList.length == 0) {
                removeLoader();
            }
        });
    }
    // -----------------------------------------------------

    // ------------------{Get chats}-------------------
    function updateChat(chatList, message, chatID) {
        chatList().forEach(chat => {
            if (chat.chatID() == chatID) {
                chat.lastMessage(message);
                return;
            }
        });
    }

    function getChats(chatList) {
        chatList.removeAll();

        //get chats from firebase
        firebase.database().ref("userChats/" + currentUser.uid).on("child_added", function (snapshot) {

            var chatID = snapshot.val().chatID;

            firebase.database().ref("chats/" + chatID).once("value", function (chat) {
                var members = chat.val().members;
                //check if current user is one of the chat members
                if (members.firstUser == currentUser.uid || members.secondUser == currentUser.uid) {
                    //get the other members" id 
                    var senderID = members.firstUser == currentUser.uid ? members.secondUser : members.firstUser;
                    createChat(chatList, senderID, chat);
                }
            });

            firebase.database().ref("chats/" + chatID).on("child_changed", function (message) {
                updateChat(chatList, message.val(), chatID);
            });
        });
    }

    function getMessages(currentChat) {
        //clear current messages
        currentChat().messageList.removeAll();

        //get chats from firebase
        firebase.database().ref("chatMessages/" + currentChat().chatID()).on("child_added", function (chatMessage) {
            currentChat().messageList.push(new Message(chatMessage.val().content, chatMessage.val().sender, chatMessage.val().timestamp, chatMessage.key));
        });

        // listen for messages removed
        messagesRemoved(currentChat);
    }

    function messagesRemoved(currentChat) {
        firebase.database().ref("chatMessages/" + currentChat().chatID()).on("child_removed", function () {
            currentChat().messageList.removeAll();
        });
    }

    function removeRef(ref) {
        ref.set({
            data: null
        }, (error) => {
            if (error) {
                // The write failed...
            } else {
                return;
            }
        });
    }
    // -----------------------------------------------------
}

