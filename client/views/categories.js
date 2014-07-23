Template.categories.events({
    'submit #createCategory': function(e, t) {	
        e.preventDefault();
        var name = document.getElementById("categoryName").value;
		Categories.insert({name: name})
		return false;
    },
	'submit #createSubcategory': function(e, t) {	
        e.preventDefault();
		var selected = document.getElementById("parentCategory");
		var parentCategoryId = selected.options[selected.selectedIndex].id;
        var name = document.getElementById("subcategoryName").value;
		Subcategories.insert({parent: parentCategoryId, name: name})
		return false;
    },
	'click .deleteSubcategory' : function(e, t) {
		e.preventDefault();
		Subcategories.remove(this._id);
		return false;
    },
	'click .deleteCategory' : function(e, t) {
		e.preventDefault();
		Categories.remove(this._id);
		return false;
    }
});


Template.categories.categories = function () {
  return Categories.find({}, { sort: { name: 1 }});
}

Template.categories.subcategories = function () {
	return Subcategories.find({parent: this._id}, { sort: { name: 1 }});
}
