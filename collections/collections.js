PropertiesCollection = new Meteor.Collection('properties');
ItemsCollection = new Meteor.Collection('items');

var buildCondition = function (str) {
	str = App.string.removeNonWordChars(str);
	var words = _.map(str.split(/\s+/), App.string.replaceSpecialChars);
	var rex = _.map(words, function (word) {
		return {searchable: {$regex: '.*' + word + '.*'}};
	});
	return {$and: rex};
};

App.component('items').expose({
	find: function (searchStr, limit) {
		if (!searchStr) {
			return [];
		}
		limit = limit || 30;
		var condition = searchStr ? buildCondition(searchStr):{};
		var results = ItemsCollection.find(
			condition,
			{limit: limit, sort: {title: 1}});
		return results;
	}
});


if (Meteor.isServer) {
	Meteor.publish('items', function (searchString, limit) {
		return App.items.find(searchString, limit);
	});
	Meteor.publish('users', function () {
		if (this.userId && App.auth.isAdmin(this.userId)) {
			return Meteor.users.find();
		}
		return [];
	});
	var adminAndOtherUser = function (userId, doc) {
		return App.auth.isAdmin(userId) && userId !== doc._id;
	};
	Meteor.users.allow({
		remove: adminAndOtherUser,
		update: adminAndOtherUser
	});
	Meteor.users.deny({
		update: function (userId, doc) {
			return !adminAndOtherUser(userId, doc);
		}
	});
	ItemsCollection.allow({
		insert: App.auth.canEdit,
		update: App.auth.canEdit,
		remove: App.auth.canEdit
	});
}