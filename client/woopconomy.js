// Router configuration

Router.configure({
   layoutTemplate: 'main'
 });

Router.map(function () {
	this.route('home', {
		path: '/',  //overrides the default '/home'
	  });
	this.route('import');
	this.route('categories');
	this.route('accounts');
	this.route('categorize');
});



Template.home.posts = function(){
	return Posts.find();
}

Template.home.events({ 
	'click #clearPosts' : function(e, t) {
		e.preventDefault();
		//TODO change to remove imports for this user only
		Meteor.call("removeAllPosts");
		return false;
    },
});

Template.home.posts = function(){
    return Posts.find({}, {transform: function(doc) {
		//var accountName = Accounts.findOne({_id: "XpnDLRE5a9ECYEYnJ"});
		var account = Accounts.findOne({_id: doc.account});
		//console.log(new Date(doc.date));
		if (account){
			var accountName = account.name;
			doc.accountName = accountName;
		}
		
        return doc;
        }
    });
}
/*
Template.home.months = function(){
	Months = new Meteor.Collection(null);
	//Months.insert({month: 5, year: 2014});
	var posts = Posts.find();
	posts.forEach(function (post){
		var postMonth = post.date.getMonth();
		var postYear = post.date.getFullYear();
		var foundMonth = (Months.find({month: postMonth, year: postYear}));
		var createMonth = true;
		foundMonth.forEach(function (foundMonth){
			createMonth = false;
		});
		if (createMonth){
			console.log("creating the month");
			//Months.insert({month: postMonth, year: postYear});
		}
	});
	return Months.find();
}*/

Template.home.months = function(){
	Months = new Meteor.Collection(null);
	var foundMonths = getMonths();
	if (foundMonths != null){
		for (var i = 0; i  < foundMonths.length; i++){
			var monthArray = new Array();
			monthArray[0] = "January";
			monthArray[1] = "February";
			monthArray[2] = "March";
			monthArray[3] = "April";
			monthArray[4] = "May";
			monthArray[5] = "June";
			monthArray[6] = "July";
			monthArray[7] = "August";
			monthArray[8] = "September";
			monthArray[9] = "October";
			monthArray[10] = "November";
			monthArray[11] = "December";
			Months.insert({name: monthArray[foundMonths[i].month], month: foundMonths[i].month, year: foundMonths[i].year});
		}
	}
	return Months.find({}, { sort: { month: 1 }});
}

getMonths = function(){
	var foundMonths = [];
	var posts = Posts.find();
	posts.forEach(function (post){
		var postMonth = post.date.getMonth();
		var postYear = post.date.getFullYear();
		var createMonth = true;
		for (var i = 0; i  < foundMonths.length; i++){
			if (foundMonths[i].year == postYear){
				if(foundMonths[i].month == postMonth){
					createMonth = false;
				}
			}
		}
		if (createMonth){
			foundMonth = {month: postMonth, year: postYear};
			foundMonths.push(foundMonth);
		}


	});
	return foundMonths;
}

Template.home.date = function () {
	var day = ("0" + this.date.getDate()).slice(-2);
	var month = ("0" + (this.date.getMonth() + 1)).slice(-2);
	var year = this.date.getFullYear();
	return year + "-" + month + "-" + day;
}

Template.home.categories = function () {
  return Categories.find({}, { sort: { name: 1 }});
}

Template.home.subcategories = function () {
	return Subcategories.find({}, { sort: { parent: 1 }});
}

Template.home.amount = function () {
	var posts = Posts.find({subcategory: this._id});
	var amount = 0;
	posts.forEach(function (post){
		amount += post.amount;
	});
	return amount;
}


Template.home.monthAmount = function () {
	console.log(this);
}

Handlebars.registerHelper('amountByMonth', function (categoryId, year, month) {
	var posts = Posts.find({subcategory: categoryId});
	var amount = 0;
	posts.forEach(function (post){
		if (post.date.getMonth() == month && post.date.getFullYear() == year){
			amount += post.amount;
		}
	});
	return Math.round(amount);
});

Template.home.amountUncategorized = function () {
	var posts = Posts.find({subcategory: ""});
	var amount = 0;
	posts.forEach(function (post){
		amount += post.amount;
	});
	return amount;
}

Template.home.parentCategory = function () {
	var subcategory = this;
	var parent = ""
	var category = Categories.find({_id: this.parent});
	category.forEach(function (category){
		parent = category.name
	});
	return parent;
}
