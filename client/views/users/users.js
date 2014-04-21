App.component('users').expose({
	show: function () {
		Meteor.subscribe('users');
	}
});

Template.usersTable.helpers({
	users: function () {
		return Meteor.users.find();
	}
});

Template.user.events({
	'click .remove.btn': function () {
		if (!confirm('Are you sure?')) {
			return;
		}
		Meteor.users.remove(this._id);
	}, 
	'change input': function (e) {
		var role = $(e.currentTarget).parents('tr').find('input:checked').val();
		if (role) {
			Meteor.users.update(this._id, {$set: {'profile.role': role}});
		}
	}
});

Template.user.helpers({
	checked: function (role) {
		role = role || 'normal';
		var prole = this.profile.role || 'normal';
		return prole === role ? 'checked="checked"':'';
	}
});