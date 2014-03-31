Template.searchBox.rendered = function () {
	$(this.firstNode)
	.find('#search-string')
	.val(Session.get('search.string'))
	.focus();
};

var searchTimeout;
var search = function (string, timeout) {
	Meteor.clearTimeout(searchTimeout);
	if (string !== Session.get('search.string')) {
		searchTimeout = Meteor.setTimeout(function () {
			Session.set('search.string', string);
		}, timeout);
	}
};

var clear = function () {
	search('', 0);
	$('.search-box input').val('').focus();
};

Template.searchBox.events({
	'keyup #search-string': function (ev) {
		if (ev.keyCode === 27) { // ESC
			clear();
		} else {
			var string = $(ev.currentTarget).val().trim();
			search(string, 500);
		}
	},
	'click .clear-search': clear
});

var setBodyClass = function (results) {
	var searchString = Session.get('search.string');
	var $body = $('body');
	$body.removeClass('page-search');
	$body.removeClass('page-define');
	$body.removeClass('page-results');
	$body.removeClass('page-default');
	if (searchString) {
		$body.addClass('page-search');
		if (results.count()) {
			$body.addClass('page-results');
		} else {
			$body.addClass('page-define');
		}
	} else {
		$body.addClass('page-default');
	}
};

Template.searchResults.helpers({
	results: function () {
		var results = ItemsCollection.find({});
		console.log('getting results: ' + results.count());
		setBodyClass(results);
		return results;
	}
});


Meteor.startup(function () {
	Deps.autorun(function () {
		var searchString = Session.get('search.string');
		Meteor.subscribe('items', searchString, function () {
			$('body').removeClass('page-loading');
		});
		$('body').addClass('page-loading');
	});
});

var emphasizeField = function (field) {
	return function () {
		var str = Session.get('search.string');
		str = str.split(' ');
		str = str.join('|');
		str = '('+str+')';
		return this[field].replace(new RegExp(str, 'gi'), '**$1**');
	};
};

Template.itemSummary.helpers({
	title: emphasizeField('title'),
	description: emphasizeField('description')
});