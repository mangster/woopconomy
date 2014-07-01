/*
// Publish all nodes for a given map
Meteor.publish("mapNodes", function (impactMapId) {
  check(impactMapId, String);
  return MapNodes.find({impactMap: impactMapId});
});

// Publish the set of impact maps the logged-in user can see.
Meteor.publish("impactMaps", function () {
  return ImpactMaps.find({$or: [{"public": true},
                             {owner: this.userId}]});
});
*/