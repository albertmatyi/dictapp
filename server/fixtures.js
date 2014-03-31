Fixtures={};

var addRooms = function () {
	if (RoomsCollection.find().count() > 0) {
		return;
	}
	console.log('Adding rooms');
	RoomsCollection.insert({title: 'Lobby', workspaces: 3});
	RoomsCollection.insert({title: 'Standard projection room', workspaces: 1});
	RoomsCollection.insert({title: 'Control room', workspaces: 2});
	RoomsCollection.insert({title: 'Immersion', workspaces: 4});
};

var addUsers = function () {
	if (Meteor.users.find().count() > 0) {
		return;
	}
	console.log('Adding users');
	// Accounts.createUser({username: 'admin', password: 'asdasd'});
	// Accounts.createUser({username: 'someone', password: 'asdasd'});
	// Accounts.createUser({username: 'anyone', password: 'asdasd'});
};

var generateMedia = function (timestamp, user, img) {
	var day = moment(timestamp).format('YYYY/MM/DD');
	var data = {project: fixie.fetchPhrase(),
		title: fixie.fetchPhrase(),
		description: fixie.fetchParagraph(),
		tags: fixie.fetchPhrase(),
		path: '/pix/test/'+img,
		mimeType: 'image/jpeg',
		date: day,
		external: true
	};
	data.updated = timestamp;
	data.userId = user;

	var id = MediasCollection.insert(data);

	var incremented = MediaGroupsCollection.update({date: day, userId: data.userId}, {$inc: {count: 1}});
	if (!incremented) {
		MediaGroupsCollection.insert({date: day, userId: data.userId, count: 1, updated: timestamp});
	}

	return id;
};

Fixtures.addMedias = function () {
	if(MediasCollection.find().count() > 0) {
		return;
	}

	console.log('Adding test medias');
	var N = 100;
	var testImgs = 7;

	var today = + new Date();
	var aDay = 1000*60*60*24;
	var groupV = 0;
	var day = today - 356 * aDay;
	var user;
	var users = Meteor.users.find().fetch();
	var img = 0;

	while (N--) {
		if (groupV === 0) {
			groupV = 2 + Math.floor(Math.random()*4);
			day += 1 + Math.floor(Math.random()*7) * aDay;
			user = users[Math.floor(Math.random() * users.length)]._id;
		}
		generateMedia(day, user, (img++)%testImgs + '.jpg');
		groupV -= 1;
	}
};

var fixtures = [
addRooms,
addUsers,
Fixtures.addMedias
];


Meteor.startup(function () {
	_.each(fixtures, function (e) {
		e();
	});
});
