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
		setBodyClass(results);
		return results;
	}
});

var loadResults = function () {
	var searchString = Session.get('search.string');
	var limit = Session.get('results.limit') || 30;
	Meteor.subscribe('items', searchString, limit, function () {
		$('body').removeClass('page-loading');
	});
	$('body').addClass('page-loading');
};


Meteor.startup(function () {
	Deps.autorun(loadResults);
	$(window).scroll(function() {
		if($(window).scrollTop() === $(document).height() - $(window).height()) {
			Session.set('results.limit', ItemsCollection.find().count() + 30);
		}
	});
	Meteor.subscribe('users');
});

var emphasizeField = function (field) {
	return function () {
		var str = Session.get('search.string') || '';
		str = App.string.removeNonWordChars(str);
		var baseStr = App.string.replaceSpecialChars(str);
		str = str.split(/\s+/);
		str = str.concat(_.filter(baseStr.split(/\s+/), function (word) {
			return _.indexOf(str, word) === -1;
		}));
		str = str.join('|');
		str = '('+str+')';
		return this[field].replace(new RegExp(str, 'gi'), '**$1**').replace(/\*\*\*\*/gi, '');
	};
};

Template.itemSummary.helpers({
	title: emphasizeField('title'),
	description: emphasizeField('description'),
	editItem: function () {
		return Session.get('item.edit.id') === this._id;
	}
});

var removeEditor = function () {
	Session.set('item.edit.id', undefined);
	Session.set('item.edit.height', undefined);
};

Template.itemSummary.rendered = function () {
	$(this.firstNode).find('.description').css({
		height: Session.get('item.edit.height') + 'px'
	});
	$(this.firstNode).find('.title').css({
		height: Session.get('item.edit.height') + 'px'
	});
};

Template.itemSummary.events({
	'click .result': function (e) {
		e.stopPropagation();
		if (App.auth.canEdit()) {
			Session.set('item.edit.id', this._id);
			Session.set('item.edit.height', $(e.currentTarget).find('.description').height());
			$('body').off('click', removeEditor).on('click', removeEditor);
		}
	}
});
Template.itemSummary.events({
	'click .remove.btn': function () {
		if (!confirm('Are you sure?')) {
			return;
		}
		ItemsCollection.remove(this._id);
	},
	'click .save.btn': function (e) {
		e.stopPropagation();
		var $row = $(e.currentTarget).parents('.row');
		var title = $row.find('.title').val();
		var description = $row.find('.description').val();
		ItemsCollection.update(this._id, {$set: {title: title, description: description, searchable: App.string.replaceSpecialChars(description + ' ' + title).toLowerCase()}});
		removeEditor();
	}
});
Template.itemNew.helpers({
	mock: function () {
		return {title: Session.get('search.string'), description:''};
	},
	hideDefinition: function () {
		return ItemsCollection.find().count() === 0 ? '':'hidden';
	}
});

var clearRow = function ($row) {
	$row.find('.title').val('');
	$row.find('.description').val('');
};
Template.itemNew.events({
	'click .remove.btn': function (e) {
		var $row = $(e.currentTarget).parents('.row');
		clearRow($row);
	},
	'click .save.btn': function (e) {
		var $row = $(e.currentTarget).parents('.row');
		var title = $row.find('.title').val();
		var description = $row.find('.description').val();
		ItemsCollection.insert({title: title, description: description, searchable: App.string.replaceSpecialChars(description + ' ' + title).toLowerCase()});
		clearRow($row);
	}
});

Template.mainMenu.events({
	'click .users.btn': function () {
		App.users.show();
	}
});