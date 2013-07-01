var options = {style: 'ansi'};
// copied colors from color.js
var colorWrap = {
	//grayscale
	'white': ['\033[37m', '\033[39m'],
	'grey': ['\033[90m', '\033[39m'],
	'black': ['\033[30m', '\033[39m'],
	//colors
	'blue': ['\033[34m', '\033[39m'],
	'cyan': ['\033[36m', '\033[39m'],
	'green': ['\033[32m', '\033[39m'],
	'magenta': ['\033[35m', '\033[39m'],
	'red': ['\033[31m', '\033[39m'],
	'yellow': ['\033[33m', '\033[39m']
};
var wrapStyle = function (str, color) {
	str = '' + str;
	if (options.style === 'ansi' && colorWrap.hasOwnProperty(color)) {
		var arr = colorWrap[color];
		return arr[0] + str + arr[1];
	}
	return str;
};
/* js hint -W098 */
var warn = function (str) {
	return wrapStyle(str, 'yellow');
};
var fail = function (str) {
	return wrapStyle(str, 'red');
};
var ok = function (str) {
	return wrapStyle(str, 'green');
};
var accent = function (str) {
	return wrapStyle(str, 'white');
};
var writeln = function (str) {
	if (arguments.length === 0) {
		str = '';
	}
	console.log(str);
};

module.exports = {
	options: options,
	color: function (enable){
		options.style = enable ? 'ansi' : false;
	},
	reporter: function (errors, data) {
		var path = require('path');

		var fileCount = data.length;
		var errorCount = 0;
		var i = 0;

		data.forEach(function (res) {
			i++;
			//console.dir(res);
			var errors = res.errors;
			var file;
			if (res.file) {
				file = path.resolve(res.file);
			}
			if (!file) {
				file = '<unknown file>';
			}
			var head = 'File \'' + res.file + '\'';
			if (!errors || errors.length == 0) {
				writeln(ok('>> ') + head + ' ' + ok('OK') + (i === fileCount ? '\n' : ''));
			} else {
				writeln(fail('>> ') + head);// + ' ' + fail(errors.length + ' error' + (errors.length == 1 ? '' : 's')));
				errorCount += errors.length;
				errors.sort(function (a, b) {
					if (a && !b) {
						return -1;
					}
					else if (!a && b) {
						return 1;
					}
					if (a.line < b.line) {
						return -1;
					}
					else if (a.line > b.line) {
						return 1;
					}
					if (a.character < b.character) {
						return -1;
					}
					else if (a.character > b.character) {
						return 1;
					}
					return 0;
				});

				errors.forEach(function (err) {
					var str = '';
					if (!err) {
						return;
					}
					var e;
					// '(error)'
					if (err.id) {
						e = err.id.match(/[\w ]+/);
						if (e) {
							e = e[0];
						}
					}
					if (!e) {
						e = 'error';
					}

					str += fail(e.toUpperCase()) + ' at ' + file + '(' + err.line + ',' + err.character + '):';
					str += '\n' + (err.code ? warn('[' + err.code + ']') + ' ' : '');
					str += warn(err.reason ? err.reason : '<undefined reason>');
					if (typeof err.evidence !== 'undefined') {
						str += '\n' + err.evidence;
					}
					writeln(str);
				});
				writeln('');
			}
		});
		var report = 'JSHint found ';
		if (errorCount === 0) {
			writeln(report + ok('no errors'));
		}
		else {
			writeln(report + fail(errorCount + ' error' + ((errorCount === 1) ? '' : 's')) + '\n');
		}
	}
};
