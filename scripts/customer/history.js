// this data will be retreived from the database
var categories = [
    {
        name: 'Active',
        list: [
            {
                id: '000123',
                date: '1/5/2021',
                time: '08:00 AM'
            }
            , {
                id: '000123',
                date: '1/5/2021',
                time: '08:00 AM'
            }
            , {
                id: '000123',
                date: '1/5/2021',
                time: '08:00 AM'
            }
            , {
                id: '000123',
                date: '1/5/2021',
                time: '08:00 AM'
            }
        ]
    },
    {
        name: 'Previous',
        list: [
            {
                id: '000123',
                date: '1/5/2021',
                time: '08:00 AM'
            }
        ]
    },
    {
        name: 'Canceled',
        list: [
            {
                id: '000333',
                date: '1/25/2021',
                time: '10:00 AM'
            },
            {
                id: '000123',
                date: '1/5/2021',
                time: '08:00 AM'
            }
        ]
    }
];

// the category is the top bar item that contains a list of orders
var Category = function (name, list) {
    this.name = ko.observable(name);
    this.list = ko.observableArray(list);
    this.active = ko.observable(false);
    //for the class binding
    this.checkActive = ko.computed(function () {
        return this.active() == true ? 'active' : '';
    }, this);
};

// the order that will be stored in each category
var Order = function (id, date, time) {
    this.id = ko.observable(id);
    this.date = ko.observable(date);
    this.time = ko.observable(time);
};

var myViewModel = function () {
    var self = this;
    this.categoryList = ko.observableArray();
    this.currentCategory = ko.observable();

    // get all category 
    getCategory(self.categoryList);

    // set the first category to be the active
    self.categoryList()[0].active(true);
    self.currentCategory(self.categoryList()[0]);

    // an event listiner that will be triggered when a category is clicked
    this.displayCategory = function (clickedCategory) {
        self.currentCategory().active(false);
        clickedCategory.active(true);
        self.currentCategory(clickedCategory);
    };

    this.showOrder = function (clickedOrder) {
        console.log(clickedOrder.id());
        // localStorage.setItem("orderId", clickedOrder.id());
    };
};
ko.applyBindings(new myViewModel);

function getCategory(categoryList) {
    categories.forEach(category => {
        var list = [];
        // get orders
        category.list.forEach(order => {
            list.push(new Order(order.id, order.date, order.time));
        });
        categoryList.push(new Category(category.name, list));
    });
}