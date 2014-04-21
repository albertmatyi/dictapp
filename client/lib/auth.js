Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL'
});

Handlebars.registerHelper('isAdmin', function () {
	return App.auth.isAdmin();
});