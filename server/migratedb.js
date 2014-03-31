var initial = function (version) {
	console.warn('Running fixtures');
	PropertiesCollection.remove({});
	PropertiesCollection.insert({key: 'dbversion', value: version});

	return true;
};

var addCameraArraysToRooms = function () {
	console.log('Adding camera array to each room');
	var updts = RoomsCollection.update({}, {$set: {cameras: []}}, {multi: true});
	console.log('Added camera array to ' + updts + ' rooms.');
	return true;
};

var workspaceNtoWorkspaceSizes = function () {
	console.log('Transforming workspace nr into dimensions array');
	var size = {width: 1280, height: 800};
	RoomsCollection.find({}).forEach(function (room) {
		var sizes = [];
		for (var i = 0; i < room.workspaces; i++) {
			sizes.push(size);
		}
		RoomsCollection.update(room._id, {$set: {workspaces: sizes}});
	});
	return true;
};

var addByInfoToMedia = function () {
	var uid = Meteor.users.findOne({username: 'admin'})._id;
	var n = MediasCollection.update({}, {$set: {by: uid}}, {multi: true});
	console.log('Set admin ' + uid + ' as creator for medias (' + n  + ')');
	return true;
};

var renameWorkspacesToScreens = function () {
	RoomsCollection.find({}).forEach(function (room) {
		RoomsCollection.update(room._id, {$set: {screens: room.workspaces}});
		RoomsCollection.update(room._id, {$unset: {worspaces: 1}});
		RoomsCollection.update(room._id, {$unset: {workspaces: 1}});
	});
	return true;
}



// =========================================================


var migrations = [
initial,
addCameraArraysToRooms,
workspaceNtoWorkspaceSizes,
addByInfoToMedia,
renameWorkspacesToScreens
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
