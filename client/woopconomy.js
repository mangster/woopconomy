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
});



Template.home.posts = function(){
	return Posts.find();
}

Template.home.account = function(){
	console.log(Accounts.find({id: this.account}));
	
	return true;
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
