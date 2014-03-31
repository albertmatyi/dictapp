var initial = function () {
	// return true to update version value, otherwise version number is not updated
	return true;
};

var clearDb = function () {
	console.log('Clearing db');
	ItemsCollection.remove({});
	return true;
};

var fillWithDummyData = function () {
	console.log('Filling with fixieData');
	ItemsCollection.remove({});
	for (var i = 100; i >= 0; i--) {
		ItemsCollection.insert({
			title: fixie.fetchPhrase(),
			description: fixie.fetchParagraph()
		});
	}
	return true;
};

var fs = Npm.require('fs');
var readFileByLine = function (fileName, callback) {
	var fd = fs.openSync(fileName, 'r');
	var step = 1;
	var size = fs.statSync(fileName).size;
	var line = '';
	var pos = 0;
	var buffer = Buffer(step);
	while (size > pos) {
		fs.readSync(fd, buffer, 0, step, pos);
		var c = buffer.toString();
		if (c === '\n') {
			if (callback(line) === false) {
				break;
			}
			line = '';
		} else {
			line += c;
		}
		pos += step;
	}
	fs.close(fd);
};

var regexExtractor = function (re) {
	return function (line) {
		line = line.trim();
		var m = re.exec(line);
		if (m !== null) {
			ItemsCollection.insert({title: m[1], description: m[2]});
		} else if (line.length) {
			console.log(line);
			console.warn('Doesn\'t match');
		}
	};
};


var importData1 = function () {
	var file = process.env.PWD + '/.assets/1.data';
	console.log('Importing...');
	readFileByLine(file, regexExtractor(/title: '([^']+)'\s*,\s*description:\s*'([^']*)'/i));
	console.log('Imported...');
	return true;
};

// =========================================================

var migrations = [
initial,
fillWithDummyData,
clearDb,
importData1
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
			var tver = i;
			if (ret === 'downgrade') {
				tver -= 2;
				console.log('Downgrading to ' + tver);
			}
			PropertiesCollection.update({key: 'dbversion'}, {$set: {value: tver}}, {multi: true});
		}
	}
	console.log('Migraton done');
};

Meteor.startup(migrateDb);
