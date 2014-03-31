PropertiesCollection = new Meteor.Collection('properties');
ItemsCollection = new Meteor.Collection('items');

var cleanWord = function (word) {
	return word.replace(/[^\w_-]/gi, '');
};

var buildCondition = function (fields, str) {
	var words = _.map(str.split(' '), cleanWord);
	fields = '\'\'' + _.map(fields, function (f) { return ', this.'+f; }).join(' ');

	var condition = 'true';
	_.each(words, function (word) {
		if (word.length) {
			condition += ' && str.match(/'+word+'/gi)';
		}
	});

	var filter = 'function () { var str = [:fields].join(\' \'); return :condition; }';
	filter = filter
	.replace(/:fields/gi, fields)
	.replace(/:condition/gi, '' + condition);

	return {$where: filter};
};

App.component('items').expose({
	find: function (searchStr, limit) {
		if (!searchStr) {
			return [];
		}
		limit = limit || 30;
		var condition = searchStr ? buildCondition(['title', 'description'], searchStr):{};
		var results = ItemsCollection.find(
			condition,
			{limit: limit, sort: {title: 1}});
			//, sort: {updated: -1}
		console.log('Found ' + results.count() + ' results');
		console.log('searching with: ' + searchStr);
		return results;
	}
});


if (Meteor.isServer) {
	Meteor.publish('items', function (searchString, limit) {
		return App.items.find(searchString, limit);
	});
}