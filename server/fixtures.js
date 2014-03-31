Fixtures={};

var addSomeDefs = function () {

};

var fixtures = [
addSomeDefs
];


Meteor.startup(function () {
	_.each(fixtures, function (e) {
		e();
	});
});
