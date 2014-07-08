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

