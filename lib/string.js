
const charmap = {
	// Hungarian chars
	'Á': 'A', 'á': 'a', 'É': 'e', 'é': 'e', 'Í': 'I', 'í': 'i', 'Ó': 'O', 'ó': 'o', 'Ö': 'O', 'ö': 'o', 'Ő': 'O', 'ő': 'o', 'Ú': 'u', 'ú': 'u', 'Ü': 'U', 'ü': 'u', 'Ű': 'u', 'ű': 'u',
	// Romanian chars (+ wrongly written t, & s,)
	'Ă': 'a', 'ă': 'a', 'Â': 'a', 'â': 'a', 'Î': 'i', 'î': 'i', 'ș': 's', 'ş': 's', 'ț': 't', 'ţ': 't', 'Ţ': 'T', 'Ț': 'T', 'Ș': 'S', 'Ş': 'S'
};

const specialCharsString = _.map(charmap, function (v, k) { return k; }).join('');
const nonWordRegExp = new RegExp('[^\\w_\\- ' + specialCharsString + ']', 'gi');

App.component('string').expose({
	replaceSpecialChars: function (str) {
		if (!str) {
			return '';
		}
		str = str.split('');
		_.each(str, function (c, i) {
			if (charmap[c]) {
				str[i] = charmap[c];
			}
		});
		return str.join('');
	},
	capitalize: function (str) {
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
	removeNonWordChars: function (str, replaceWithEmptyStr) {
		return str.replace(nonWordRegExp, replaceWithEmptyStr ? '':' ').trim();
	}
});
