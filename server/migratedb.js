var initial = function (version) {
	// return true to update version value, otherwise version number is not updated
	return true;
};


// =========================================================


var migrations = [
initial,
];

// =========================================================

var migrateDb = function () {
	var ver = PropertiesCollection.findOne({key: 'dbversion'});
	if(typeof ver === 'undefined') {
		PropertiesCollection.insert({key: 'dbversion', value: -1});
		ver = -1;
	} else {
		ver = ver.value;
	}

	for (var i = ver + 1; i < migrations.length; i++) {
		console.log('Migrating from version ' + (i-1) + ' to ' + i);
		var ret = migrations[i](i);
		if(ret) {
			var ver = i;
			if (ret === 'downgrade') {
				ver -= 2;
				console.log('Downgrading to ' + ver);
			}
			PropertiesCollection.update({key: 'dbversion'}, {$set: {value: ver}}, {multi: true});
		}
	}
	console.log('Migraton done');
};

Meteor.startup(migrateDb);
