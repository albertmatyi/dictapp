App.component('auth').expose({
	isAdmin: function () {
		return Meteor.user() && Meteor.user().profile.role === 'admin';
	}
});