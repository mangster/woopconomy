if (Meteor.isServer) {

  Meteor.startup(function() {

    return Meteor.methods({
		//TODO remove when not needed anymore
      removeAllImports: function() {

        return Imports.remove({});

      },
	  removeAllPosts: function() {

        return Posts.remove({});

      }

    });

  });

}