// ------------------{Event listeners}-------------------
var currentUser;
var chatID = localStorage.getItem('chatID');
var state = localStorage.getItem('state');

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currentUser = user;
        app();
    }
});

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
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
    var Chat = function(admin, chatID) {
        this.admin = ko.observable(admin);
        this.chatID = ko.observable(chatID);
        this.messageList = ko.observableArray();
    }

    var Message = function(content, sender, timestamp, messageID) {
        this.content = ko.observable(content);
        this.sender = ko.observable(sender);
        this.timestamp = ko.observable(timestamp);
        this.chatID = ko.observable(messageID);
        this.checkSender = ko.computed(function() {
            return currentUser.uid == this.sender() ? 'me' : 'other';
        }, this);
    }

    var myViewModel = function() {
        var self = this;
        this.currentChat = ko.observable();

        getChats(this.currentChat);

        this.goBack = function() {
            window.location.assign("/chatHistory");
        }

        this.deleteMessages = function() {
            firebase.database().ref("chatMessages/" + self.currentChat().chatID()).remove();
        }

        this.endChat = function() {
            //remove all chat messages
            firebase.database().ref("chatMessages/" + self.currentChat().chatID()).remove();
            //remove chat 
            var chatRef = firebase.database().ref("chats/" + state + "/" + self.currentChat().chatID());

            chatRef.once("value", (snapshot) => {
                firebase.database().ref("chats/" + "Closed" + "/" + self.currentChat().chatID()).set(snapshot.val(), (error) => {
                    if (!error) {
                        chatRef.remove();
                    }
                });
            });
        }

        firebase.database().ref("chats/Active/").on("child_removed", function(snapshot) {
            if (snapshot.val().customer_id == currentUser.uid) {
                alert("Your chat with " + self.currentChat().admin() + " has been deleted");
                window.location.assign('/home');
            }
        });

        this.openSideMenu = function() {
            document.getElementById("myDropdown").classList.add("show");
        }

        this.sendMessage = function() {
            var newMessage = document.getElementById("newMessage").value;
            if (newMessage.length > 0) {
                var messageRef = firebase.database().ref("chatMessages/" + self.currentChat().chatID()).push();
                messageRef.set({
                    sender: currentUser.uid,
                    content: newMessage,
                });

                firebase.database().ref("chats/" + state + "/" + self.currentChat().chatID()).update({
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
        if (state == "Closed") {
            removeElement(document.getElementById('form'));
            removeElement(document.getElementById('myDropdown'));
            removeElement(document.getElementById('openBtn'));
        }

        //get chats from firebase
        firebase.database().ref("chats/" + state + "/" + chatID).once("value", function(chat) {
            var senderID = chat.val().admin_id;

            firebase.database().ref("users/admins/" + senderID).once("value", function(user) {
                currentChat(new Chat(user.val().name, chat.key));
                getMessages(currentChat);

                // remove the loader
                removeElement(document.getElementById('loader'));
                document.getElementById('display').style.display = 'block';
            });
        });

        firebase.database().ref("chats/" + state + "/").on("child_removed", function(chat) {
            var senderID = chat.val().admin_id;

            firebase.database().ref("users/admins/" + senderID).once("value", function(user) {
                currentChat(new Chat(user.val().name, chat.key));
                getMessages(currentChat);

                // remove the loader
                removeElement(document.getElementById('loader'));
                document.getElementById('display').style.display = 'block';
            });
        });
    }

    function getMessages(currentChat) {
        //get chats from firebase
        firebase.database().ref("chatMessages/" + currentChat().chatID()).on("child_added", function(chatMessage) {
            currentChat().messageList.push(new Message(chatMessage.val().content, chatMessage.val().sender, chatMessage.val().timestamp, chatMessage.key));
            var elem = document.getElementById('messages');
            elem.scrollTop = elem.scrollHeight;
        });

        // listen for messages removed
        firebase.database().ref("chatMessages/" + currentChat().chatID()).on("child_removed", function() {
            currentChat().messageList.removeAll();
            var elem = document.getElementById('messages');
            elem.scrollTop = elem.scrollHeight;
        });
    }
    ko.applyBindings(new myViewModel);
}