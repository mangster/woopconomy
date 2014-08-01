Template.categorize.posts = function(){
	return Posts.find();
}

Template.categorize.account = function(){
	console.log(Accounts.find({id: this.account}));
	
	return true;
}

Template.categorize.events({ 
	'change #parentCategory': function ( event, template ) { 
	post = this;
	selected = event.target.options[event.target.selectedIndex];
	console.log(this._id);
	Posts.update({_id: this._id}, {$set: {category: selected.id}});
	}, 
	'change #subcategory': function ( event, template ) { 
	post = this;
	selected = event.target.options[event.target.selectedIndex];
	console.log(this._id);
	Posts.update({_id: this._id}, {$set: {subcategory: selected.id}});
	}, 
});


Template.categorize.posts = function(){
    return Posts.find({}, { sort: { amount: 1 }}, {transform: function(doc) {
		//var accountName = Accounts.findOne({_id: "XpnDLRE5a9ECYEYnJ"});
		var account = Accounts.findOne({_id: doc.account});
		if (account){
			var accountName = account.name;
			doc.accountName = accountName;
		}
		
        return doc;
        }
    } );
}

Template.categorize.date = function () {
	var day = ("0" + this.date.getDate()).slice(-2);
	var month = ("0" + (this.date.getMonth() + 1)).slice(-2);
	var year = this.date.getFullYear();
	return year + "-" + month + "-" + day;
}

Template.categorize.categories = function () {
  return Categories.find({}, { sort: { name: 1 }});
}


Template.categorize.hasCategory = function () {
	//console.log(this);
	if (this.category){
		//console.log("has category");
		return true;
	}
	else {
		//console.log("does not have category");
		return false;
	}
}

Template.categorize.hasSubcategory = function () {
	//console.log(this);
	if (this.subcategory){
		//console.log("has subcategory");
		return true;
	}
	else {
		//console.log("does not have category");
		return false;
	}
}

Template.categorize.selectedCategory = function () {
	//console.log(this.category);
	var selectedCategory = Categories.find({_id: this.category});
	var name = "";
	selectedCategory.forEach(function (category){
		//console.log(category.name);
		name = category.name;
	});
	//var name = selectedCategory.name;
	//console.log(selectedCategory);
	//return selectedCategory;
	return name;
}

Template.categorize.selectedSubcategory = function () {
	//console.log(this.category);
	var selectedSubcategory = Subcategories.find({_id: this.subcategory});
	var name = "";
	selectedSubcategory.forEach(function (subcategory){
		//console.log(category.name);
		name = subcategory.name;
	});
	//var name = selectedCategory.name;
	//console.log(selectedCategory);
	//return selectedCategory;
	return name;
}

Template.categorize.subcategories = function () {
	//console.log(this);
	//return Subcategories.find({}, { sort: { name: 1 }});
	return Subcategories.find({parent: this.category}, { sort: { name: 1 }});
}