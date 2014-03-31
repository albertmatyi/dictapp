Package.describe({
	summary: 'Fixiejs provides mock content for fast prototyping UI'
});

Package.on_use(function (api, where) {
	api.add_files(['fixie.js'], 'client');
	api.add_files(['fixie.js'], 'server');

	if (api.export) {
		api.export('fixie');
	}
});