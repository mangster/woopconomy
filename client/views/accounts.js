Template.accounts.events({
    'submit #createAccount': function(e, t) {	
        e.preventDefault();
        var name = document.getElementById("categoryName").value;
		Accounts.insert({name: name})
		return false;
    },
	'click .deleteAccount' : function(e, t) {
		e.preventDefault();
		Accounts.remove(this._id);
		console.log("something");
		return false;
    }
});


Template.accounts.accounts = function () {
  return Accounts.find({}, { sort: { name: 1 }});
}


/*
Template.createNode.events({
    'submit #createNode': function(e, t) {
		
        e.preventDefault();
		var currentMap = ImpactMaps.findOne(); //TODO replace with getting current ImpactMap
        var name = document.getElementById("name").value;
        var description = document.getElementById("description").value;
		var impactMap = currentMap._id;
		MapNodes.insert({name: name, description: description, impactMap: impactMap})
		return false;
    }
});

Template.node.events({
	'click .deleteItem' : function(e, t) {
		e.preventDefault();
		MapNodes.remove(this._id);
		return false;
    }
});
*/

/*
HTML

<template name = "nodes">
	<h3>Nodes</h3>
	{{#each nodes}}
		{{> node}}
	{{/each}}
</template>


<template name = "node">
	<div class="panel panel-primary" id="node">
		<div class="panel-heading">
			<h3 class="panel-title">{{name}}</h3>
		</div>
		<div class="panel-body">
			<p>{{description}}</p>
			<button type="submit" class="btn btn-danger deleteItem" href="#">Delete</button>
		</div>
	</div>
</template>

<template name = "createNode">

	<form id="createNode" method="post">
		<div class="form-group" id="createNode">
			<label for="name">Name</label>
			<input id="name" class="form-control" type="text" name="name" placeholder="Name" required>
		</div>
		<div class="form-group" id="createNode">
			<label for="description">Description</label>
			<input id="description" class="form-control" type="text" name="description" placeholder="Description" required>
		</div>	
		<button type="submit" class="btn btn-primary">Create Node</button>
	 </form>

</template>

*/