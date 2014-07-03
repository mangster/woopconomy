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

Template.home.posts = function(){
	console.log(Posts.find());
	return Posts.find();
}



function loadHandler(event) {
var csv = event.target.result;
processData(csv);
}
lines = new Meteor.Collection;
function processData(csv) {
	var allTextLines = csv.split(/\r\n|\n/);
	//var lines = [];
	
	for (var i=0; i<allTextLines.length; i++) {
		var data = allTextLines[i].split(';');
			var tarr = [];
			var tarr2 = {};
			for (var j=0; j<data.length; j++) {
				tarr.push(data[j]);
			}
			tarr2.date = tarr[0];
			tarr2.description = tarr[1];
			tarr2.amount = tarr[2];
			lines.insert(tarr2);
	}
	console.log(lines);
}

function errorHandler(evt) {
	if(evt.target.error.name == "NotReadableError") {
		alert("Canno't read file !");
	}
}

function getAsText(fileToRead) {
	var reader = new FileReader();
	// Read file into memory as UTF-8      
	reader.readAsText(fileToRead);
	// Handle errors load
	reader.onload = loadHandler;
	reader.onerror = errorHandler;
}

Template.upload.events({ 'change #fileselect': function ( event, template ) { 
	// fetch FileList object 
	var files = event.target.files || event.dataTransfer.files; 
	
	getAsText(files[0]);
	}, 
});

Template.uploadResult.rows = function(){
	
	return lines.find();
}
