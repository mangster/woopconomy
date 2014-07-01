Router.configure({
   layoutTemplate: 'main'
 });

Router.map(function () {
	this.route('home', {
		path: '/',  //overrides the default '/home'
	  });
	this.route('upload');
});

Template.navItems.helpers({
    activeIfTemplateIs: function (template) {
      var currentRoute = Router.current();
      return currentRoute &&
        template === currentRoute.lookupTemplate() ? 'active' : '';
    }
});

Meteor.subscribe("posts");


Meteor.subscribe("accounts");