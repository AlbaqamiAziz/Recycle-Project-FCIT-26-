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
document.getElementById('createChatBtn').onclick = function() {
        var newChatRef = firebase.database().ref("chats/Active").push();

        //create new chat refrance
        newChatRef.set({
            customer_id: currentUser.uid,
            admin_id: '0WiE31F3LAhYtHnNsm6F4QyAla43',
            lastMessage: "",
        }, function(error) {
            if (error) {
                var errorMessage = error.message;
                alert(errorMessage);
            } else {
                localStorage.setItem('chatID', newChatRef.key);
                localStorage.setItem('state', 'Active');
                window.location.assign("/Chat");
            }
        });
    }
    // ------------------------------------------------------

function app() {
    var categories = ['Active', 'Closed'];

    document.getElementById('table').style.display = 'table';

    // the category is the top bar item that contains a list of chats
    var Category = function(name, list) {
        this.name = ko.observable(name);
        this.list = ko.observableArray(list);
        this.active = ko.observable(false);
        //for the class binding
        this.checkActive = ko.computed(function() {
            return this.active() == true ? 'active' : '';
        }, this);
    };

    // the chat that will be stored in each category
    var Chat = function(chatID, adminID, lastMessage, name) {
        this.chatID = ko.observable(chatID);
        this.adminID = ko.observable(adminID);
        this.lastMessage = ko.observable(lastMessage);
        this.name = ko.observable(name);
    };

    var myViewModel = function() {
        var self = this;
        this.categoryList = ko.observableArray();
        this.currentCategory = ko.observable();

        // get all category 
        getCategory(this.categoryList);
        this.categoryList().forEach((category) => {
            getChats(category);
        });

        // an event listiner that will be triggered when a category is clicked
        this.displayCategory = function(clickedCategory) {
            if (self.currentCategory()) {
                self.currentCategory().active(false);
            }
            clickedCategory.active(true);
            self.currentCategory(clickedCategory);

            if(clickedCategory.name() == "Closed"){
                document.getElementById("createChatBtn").style.display = 'none';
            }else {
                document.getElementById("createChatBtn").style.display = 'block';
            }

            firebase.database().ref("chats/" + clickedCategory.name()).orderByChild('customer_id').equalTo(currentUser.uid).on("value", function(chat) {
                if (!chat.val()) {
                    document.getElementById("message").style.display = 'flex';
                    document.getElementById('orders').style.display = 'none';
                } else {
                    document.getElementById("message").style.display = 'none';
                    document.getElementById('orders').style.display = 'flex';
                }
            });
        };
        
        this.displayCategory(this.categoryList()[0]);
        
        this.showChat = function(clickedChat) {
            localStorage.setItem('chatID', clickedChat.chatID());
            localStorage.setItem('state', self.currentCategory().name());
            window.location.assign("/Chat");
        };
    };
    ko.applyBindings(new myViewModel);
    
    function getCategory(categoryList) {
        categories.forEach(category => {
            categoryList.push(new Category(category));
        });
    }
    
    function getChats(currentCategory) {
        //clear current chats
        currentCategory.list.removeAll();
        
        firebase.database().ref("chats/" + currentCategory.name()).orderByChild('customer_id').equalTo(currentUser.uid).on("child_added", function(chat) {

            firebase.database().ref("users/admins/" + chat.val().admin_id).once("value", function(admin) {
                currentCategory.list.push(new Chat(chat.key, chat.val().admin_id, chat.val().lastMessage, admin.val().name));

                firebase.database().ref("chats/" + currentCategory.name() + "/" + chat.key).on("child_changed", function(message) {
                    updateChat(currentCategory.list, message.val(), chat.key);
                });
            });
        });

        firebase.database().ref("chats/" + currentCategory.name()).orderByChild('customer_id').equalTo(currentUser.uid).on("child_removed", function(removedChat) {
            currentCategory.list().forEach(chat => {
                if (chat.chatID() == removedChat.key) {
                    currentCategory.list.remove(chat);
                }
            });
        });
    }
}

function updateChat(chatList, message, chatID) {
    chatList().forEach(chat => {
        if (chat.chatID() == chatID) {
            chat.lastMessage(message);
            return;
        }
    });
}