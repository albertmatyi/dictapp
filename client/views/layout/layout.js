var BG_URL = 'url(/imgs/bg/:image)';
Meteor.startup(function () {
	$('body').css({
		'background-image': BG_URL.replace(/:image/, Math.floor(Math.random() * 10) + '.jpg')
	});
	$('body').css({
		'background-image': BG_URL.replace(/:image/, 'congruent_outline.png'),
		'background-size': 'initial'
	});
});