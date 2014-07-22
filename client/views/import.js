function loadHandler(event) {
	var csv = event.target.result;
	processData(csv);
}

function processData(csv) {
	var allTextLines = csv.split(/\r\n|\n/);
	for (var i=0; i<allTextLines.length; i++) {
		var data = allTextLines[i].split(';');
		var row = [];
		var fixedRow = {};
		if (new Date(data[0]) != "Invalid Date"){
			for (var j=0; j<data.length; j++) {
				row.push(data[j]);
			}
			fixedRow.dateObject = new Date(row[0]);
			fixedRow.date = row[0];
			fixedRow.description = row[1];
			fixedRow.amount = parseFloat(row[2]);
			Imports.insert(fixedRow);
		}
	}
}

function errorHandler(evt) {
	if(evt.target.error.name == "NotReadableError") {
		alert("Can't read file");
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

Template.import.events({ 
	'click #clearImports' : function(e, t) {
		e.preventDefault();
		//TODO change to remove imports for this user only
		Meteor.call("removeAllImports");
		return false;
    },
	'click #saveToAccount' : function(e, t) {
		e.preventDefault();
		var selected = document.getElementById("account");
		var accountId = selected.options[selected.selectedIndex].id;
		//var account = Accounts.find({id: accountId});
		//var account = Accounts.findOne();
		var currentImports = Imports.find();
		currentImports.forEach(function (post){
			Posts.insert({account: accountId, date: post.date, description: post.description, amount: post.amount});
		});
		return false;
    },
	'change #fileselect': function ( event, template ) { 
	// fetch FileList object 
		var files = event.target.files || event.dataTransfer.files; 
		getAsText(files[0]);
	}, 
});

Template.import.rows = function(){
	
	return Imports.find();
}

Template.import.accounts = function () {
  return Accounts.find({}, { sort: { name: 1 }});
}

