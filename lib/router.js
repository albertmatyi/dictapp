Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'notFound',
	loadingTemplate: 'loading',
	fastRender: true
});

Router.map(function () {
	this.route('home', {
		path: '/',
		data: function () {
			return {
			};
		}
	});
});