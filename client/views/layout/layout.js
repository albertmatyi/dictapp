var BG_URL = 'url(/imgs/bg/:number.jpg)';
Meteor.startup(function () {
	$('body').css({
		'background-image': BG_URL.replace(/:number/, Math.floor(Math.random() * 10))
	});
});