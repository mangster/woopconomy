Template.accounts.events({
    'submit #createAccount': function(e, t) {	
        e.preventDefault();
        var name = document.getElementById("accountName").value;
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
