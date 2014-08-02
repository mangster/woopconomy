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
/*
// Copypasted piechart example below

var Slices = new Meteor.Collection(null);
Session.setDefault('pieChartSort','none');
Session.setDefault('pieChartSortModifier',undefined);

if(Slices.find({}).count() === 0){
	for(i = 0; i < 5; i++)
		Slices.insert({
			value:Math.floor(Math.random() * 100)
		});
}

//Functions for the buttons, remove later
Template.pieChart.events({
	'click #add':function(){
		Slices.insert({
			value:Math.floor(Math.random() * 100)
		});
	},
	'click #remove':function(){
		var toRemove = Random.choice(Slices.find().fetch());
		Slices.remove({_id:toRemove._id});
	},
	'click #randomize':function(){
		//loop through bars
		Slices.find({}).forEach(function(bar){
			//update the value of the bar
			Slices.update({_id:bar._id},{$set:{value:Math.floor(Math.random() * 100)}});
		});
	},
	'click #toggleSort':function(){
		if(Session.equals('pieChartSort', 'none')){
			Session.set('pieChartSort','asc');
			Session.set('pieChartSortModifier',{sort:{value:1}});
		}else if(Session.equals('pieChartSort', 'asc')){
			Session.set('pieChartSort','desc');
			Session.set('pieChartSortModifier',{sort:{value:-1}});
		}else{
			Session.set('pieChartSort','none');
			Session.set('pieChartSortModifier',{});
		}
	}
});

Template.pieChart.rendered = function(){
	//Width and height
	var w = 300;
	var h = 300;

	var outerRadius = w / 2;
	var innerRadius = 0;
	var arc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius);

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d) {
			return d.value;
		});

	//Easy colors accessible via a 10-step ordinal scale
	var color = d3.scale.category10();

	//Create SVG element
	var svg = d3.select("#pieChart")
				.attr("width", w)
				.attr("height", h);
				
	//Magnus: define key function?
	var key = function(d){ 
		return d.data._id;
	};

	Deps.autorun(function(){
		var modifier = {fields:{value:1}};

		
		var sortModifier = Session.get('pieChartSortModifier');
		if(sortModifier && sortModifier.sort)
			modifier.sort = sortModifier.sort;

			
		//Magnus: selecting a dataset..	
		var dataset = Slices.find({},modifier).fetch();


		//Magnus: .. and converting them to arcs?
		var arcs = svg.selectAll("g.arc")
					  .data(pie(dataset), key);

		var newGroups = 
			arcs
				.enter()
				.append("g")
				.attr("class", "arc")
				.attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

		//Draw arc paths
		newGroups
			.append("path")
			.attr("fill", function(d, i) {
				return color(i);
			})
			.attr("d", arc);

		//Labels
		newGroups
			.append("text")
			.attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")";
			})
			.attr("text-anchor", "middle")
			.text(function(d) {
				return d.value;
			});

		arcs
			.transition()
			.select('path')
			.attrTween("d", function(d) {
				this._current = this._current || d;
				var interpolate = d3.interpolate(this._current, d);
				this._current = interpolate(0);
				return function(t) {
					return arc(interpolate(t));
				};
			});

		arcs
			.transition()
			.select('text')
			.attr("transform", function(d) {
				return "translate(" + arc.centroid(d) + ")";
			})
			.text(function(d) {
				return d.value;
			});

		arcs
			.exit()
	 		.remove();
	});
};
*/

//Another try....
/*
getSlices = function(){
	var slices = [];
	var subcategories = Subcategories.find({});
	var posts = Posts.find({});
	subcategories.forEach(function (subcategory){
		var amount = 0;
		posts.forEach(function (post){
			if (subcategory._id == post.subcategory){
				amount += post.amount;
				//console.log("match");
			}
		});
		slices.push({label: subcategory.name, value: amount});
	});
	return slices;
}
// Donuts                           
function donutinit() {
	var slices = getSlices();
	console.log(slices);
	var dataset = [ 5, 10, 20, 45, 6, 25 ];

  //Width and height
	var w = 400;
	var h = 400;

	var outerRadius = w / 2;
	var innerRadius = 0;
	var arc = d3.svg.arc()
					.innerRadius(innerRadius)
					.outerRadius(outerRadius);

  // render
  var color = d3.scale.category10();

	var pie = d3.layout.pie();



	var svg = d3.select("#pieChart").append("svg")
				//remove if not working
				.data([slices])
				.attr("width", w)
				.attr("height", h);
				
	var arcs = svg.selectAll("g.arc")
			.data(pie.value(function(d) { return d.amount }))
			//.data(pie(dataset))
			.enter()
			.append("g")
			.attr("class", "arc")
			.attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");
	
	
	arcs.append("path")
		.attr("fill", function(d, i) {
			return color(i);
		})
		.attr("d", arc);	
			
	arcs.append("text")
		.attr("transform", function(d) {
			return "translate(" + arc.centroid(d) + ")";
		})
		.attr("text-anchor", "middle")
		.text(function(d) {
			return d.value;
			
		});
	  
};

Template.home.rendered = function() {
  donutinit();
};*/

getSlices = function(){
	var slices = [];
	var subcategories = Subcategories.find({});
	var posts = Posts.find({});
	subcategories.forEach(function (subcategory){
		var amount = 0;
		posts.forEach(function (post){
			if (subcategory._id == post.subcategory){
				amount += post.amount;
				//console.log("match");
			}
		});
		slices.push({legendLabel: subcategory.name, magnitude: Math.abs(amount)});
	});
	return slices;
}

Template.home.rendered = function() {
	var canvasWidth = 300, //width
		  canvasHeight = 300,   //height
		  outerRadius = 100,   //radius
		  color = d3.scale.category20(); //builtin range of colors
	 
		var dataSet = [
		  {"legendLabel":"One", "magnitude":20}, 
		  {"legendLabel":"Two", "magnitude":40}, 
		  {"legendLabel":"Three", "magnitude":50}, 
		  {"legendLabel":"Four", "magnitude":16}, 
		  {"legendLabel":"Five", "magnitude":50}, 
		  {"legendLabel":"Six", "magnitude":8}, 
		  {"legendLabel":"Seven", "magnitude":30}];
		dataSet = getSlices();
			var vis = d3.select("#pieChart").append("svg")//create the SVG element inside the <body>
				.data([dataSet]) //associate our data with the document
				.attr("width", canvasWidth) //set the width of the canvas
				.attr("height", canvasHeight) //set the height of the canvas
				.append("svg:g") //make a group to hold our pie chart
				  .attr("transform", "translate(" + 1.5*outerRadius + "," + 1.5*outerRadius + ")") // relocate center of pie to 'outerRadius,outerRadius'
		 
			// This will create <path> elements for us using arc data...
			var arc = d3.svg.arc()
			  .outerRadius(outerRadius);
		
			var pie = d3.layout.pie() //this will create arc data for us given a list of values
			  .value(function(d) { return d.magnitude; }) // Binding each value to the pie
			  .sort( function(d) { return null; } );
		 
			// Select all <g> elements with class slice (there aren't any yet)
			var arcs = vis.selectAll("g.slice")
			  // Associate the generated pie data (an array of arcs, each having startAngle,
			  // endAngle and value properties) 
			  .data(pie)
			  // This will create <g> elements for every "extra" data element that should be associated
			  // with a selection. The result is creating a <g> for every object in the data array
			  .enter()
			  // Create a group to hold each slice (we will have a <path> and a <text>
			  // element associated with each slice)
			  .append("svg:g")
			  .attr("class", "slice");    //allow us to style things in the slices (like text)
		 
			arcs.append("svg:path")
			  //set the color for each slice to be chosen from the color function defined above
			  .attr("fill", function(d, i) { return color(i); } )
			  //this creates the actual SVG path using the associated data (pie) with the arc drawing function
			  .attr("d", arc);
		 
			// Add a legendLabel to each arc slice...
			arcs.append("svg:text")
			  .attr("transform", function(d) { //set the label's origin to the center of the arc
				//we have to make sure to set these before calling arc.centroid
				d.outerRadius = outerRadius + 50; // Set Outer Coordinate
				d.innerRadius = outerRadius + 45; // Set Inner Coordinate
				return "translate(" + arc.centroid(d) + ")";
			  })
			  .attr("text-anchor", "middle") //center the text on it's origin
			  .style("fill", "Purple")
			  .style("font", "bold 12px Arial")
			  .text(function(d, i) { return dataSet[i].legendLabel; }); //get the label from our original data array
		 
			// Add a magnitude value to the larger arcs, translated to the arc centroid and rotated.
			arcs.filter(function(d) { return d.endAngle - d.startAngle > .2; }).append("svg:text")
			  .attr("dy", ".35em")
			  .attr("text-anchor", "middle")
			  //.attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")"; })
			  .attr("transform", function(d) { //set the label's origin to the center of the arc
				//we have to make sure to set these before calling arc.centroid
				d.outerRadius = outerRadius; // Set Outer Coordinate
				d.innerRadius = outerRadius/2; // Set Inner Coordinate
				return "translate(" + arc.centroid(d) + ")rotate(" + angle(d) + ")";
			  })
			  .style("fill", "White")
			  .style("font", "bold 12px Arial")
			  .text(function(d) { return d.data.magnitude; });
		 
			// Computes the angle of an arc, converting from radians to degrees.
			function angle(d) {
			  var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
			  return a > 90 ? a - 180 : a;
			}
		
}