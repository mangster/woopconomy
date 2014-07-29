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
		if (account){
			var accountName = account.name;
			doc.accountName = accountName;
		}
		
        return doc;
        }
    });
}

Template.home.categories = function () {
  return Categories.find({}, { sort: { name: 1 }});
}

Template.home.subcategories = function () {
	return Subcategories.find({parent: this._id}, { sort: { name: 1 }});
}

Template.home.amount = function () {
	var posts = Posts.find({subcategory: this._id});
	var amount = 0;
	posts.forEach(function (post){
		amount += post.amount;
	});
	return amount;
}

Template.home.amountUncategorized = function () {
	var posts = Posts.find({subcategory: ""});
	var amount = 0;
	posts.forEach(function (post){
		amount += post.amount;
	});
	return amount;
}