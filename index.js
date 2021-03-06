var fs = require('fs');
var path = require('path');
var SourceMapConsumer = require('source-map').SourceMapConsumer;

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
/* jshint -W098 */
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

// based on https://github.com/evanw/node-source-map-support
var cache = {};
function mapSourcePosition(position) {
	var base64 = false;
	var dataUrlPrefix = "data:application/json;base64,";
	var sourceMap = cache[position.source];
	if (!sourceMap && fs.existsSync(position.source)) {
		// Get the URL of the source map
		var fileData = fs.readFileSync(position.source, 'utf8');
		var match = /\/\/[#@]\s*sourceMappingURL=(.*)\s*$/m.exec(fileData);
		if (!match) {
			return position;
		}
		var sourceMappingURL = match[1];

		// Read the contents of the source map
		var sourceMapData;
		if (sourceMappingURL.slice(0, dataUrlPrefix.length).toLowerCase() === dataUrlPrefix) {
			// Support source map URL as a data url
			sourceMapData = new Buffer(sourceMappingURL.slice(dataUrlPrefix.length), "base64").toString();
			base64 = true;
		}
		else {
			// Support source map URLs relative to the source URL
			var dir = path.dirname(position.source);
			sourceMappingURL = path.resolve(dir, sourceMappingURL);

			if (fs.existsSync(sourceMappingURL)) {
				sourceMapData = fs.readFileSync(sourceMappingURL, 'utf8');
			}
		}
		sourceMap = {
			url: sourceMappingURL,
			base64: base64
		};
		if (sourceMapData) {
			sourceMap.map = new SourceMapConsumer(sourceMapData);
		}
		cache[position.source] = sourceMap;
	}

	// Resolve the source URL relative to the URL of the source map
	if (sourceMap && sourceMap.map) {
		var originalPosition = sourceMap.map.originalPositionFor(position);

		// Only return the original position if a matching line was found. If no
		// matching line is found then we return position instead, which will cause
		// the stack trace to print the path and line for the compiled file. It is
		// better to give a precise location in the compiled file than a vague
		// location in the original file.
		if (originalPosition.source !== null) {
			if (sourceMap.base64) {
				originalPosition.source = dataUrlPrefix + originalPosition.source;
			}
			else {
				originalPosition.source = path.resolve(path.dirname(sourceMap.url), originalPosition.source);
			}
			return originalPosition;
		}
	}

	return position;
}


module.exports = {
	options: options,
	color: function (enable) {
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
			if (!errors || errors.length === 0) {
				//writeln(ok('>> ') + head + ' ' + ok('OK') + (i === fileCount ? '\n' : ''));
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

					var position = mapSourcePosition({source:file, line:err.line, column: err.character});

					str += fail(e.toUpperCase()) + ' at ' + position.source + '(' + position.line + ',' + position.column + '):';
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
		var fileReport = fileCount + ' file' + (fileCount === 1 ? '' : 's');
		if (fileCount === 0) {
			fileReport = warn(fileReport);
		}
		if (errorCount === 0) {
			writeln(report + ok('no errors') + ' in ' + fileReport);
		}
		else {
			writeln(report + fail(errorCount + ' error' + ((errorCount === 1) ? '' : 's')) + ' in ' + fileReport + '\n');
		}
	}
};
