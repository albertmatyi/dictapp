App.component = function (name) {
	var	parts = name.split(/\./);
	var pkg = App;
	_.each(parts, function(part) {
		if (typeof pkg[part] === 'undefined') {
			pkg[part] = {};
		}
		pkg = pkg[part];
	});
	return {
		expose: function (methods) {
			_.extend(pkg, methods);
		}
	};
};


App.component('helpers').expose({
	capitalize: function (str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
	}
});
