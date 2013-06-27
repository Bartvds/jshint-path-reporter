'use strict';

var useColors = true;

var warn = function (str) {
	if (useColors) {
		return str.yellow;
	}
	return str;
};
var fail = function (str) {
	if (useColors) {
		return str.red;
	}
	return str;
};
var ok = function (str) {
	if (useColors) {
		return str.green;
	}
	return str;
};

module.exports = {
	color: function (use) {
		useColors = use;
	},
	reporter: function (res) {
		var path = require('path');
		require('colors');

		var len = res.length;
		var str = '';

		res.sort(function (a, b) {
			if (a.file < b.file) {
				return -1;
			}
			else if (a.file > b.file) {
				return 1;
			}
			if (a.error.line < b.error.line) {
				return -1;
			}
			else if (a.error.line > b.error.line) {
				return 1;
			}
			if (a.error.character < b.error.character) {
				return -1;
			}
			else if (a.error.character > b.error.character) {
				return 1;
			}
			return 0;
		});

		res.forEach(function (r) {
			var file = path.resolve(r.file);
			var err = r.error;
			var e = err.id;
			e = e.match(/[\w ]+/)[0].toUpperCase();
			if (e === 'ERROR') {
				e = fail(e);
			}
			else {
				e = warn(e);
			}
			str += 'Linting ' + e + ' at ' + file + '(' + err.line + ',' + err.character + ')';
			str += '\n  ' + fail(err.code) + ': ' + warn(err.reason);
			str += '\n  ' + err.evidence;
			str += '\n';
		});

		var report = 'JSHint found ';
		if (len > 0) {
			report += fail(len + ' error' + ((len === 1) ? '' : 's'));
		}
		else {
			report += ok('no errors');
		}
		process.stdout.write(str + '\n' + report + '\n');
	}
};
