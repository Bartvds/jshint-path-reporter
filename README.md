# jshint-path-reporter

[![Build Status](https://secure.travis-ci.org/Bartvds/jshint-path-reporter.png?branch=master)](http://travis-ci.org/Bartvds/jshint-path-reporter) [![Dependency Status](https://gemnasium.com/Bartvds/jshint-path-reporter.png)](https://gemnasium.com/Bartvds/jshint-path-reporter) [![NPM version](https://badge.fury.io/js/jshint-path-reporter.png)](http://badge.fury.io/js/jshint-path-reporter)

> JSHint reporter that displays absolute error path with row/column on one line.

A console reporter similar to the default output except the report displays absolute file paths with the row/column appended in a parsable format. 

This allows convenient use of [JSHint](http://www.jshint.com) from within tools that apply a filter RegExp to console views to turn error lines into clickable links to instantly navigate to the error location.

### Source-map

There is support for [source-map's](https://github.com/mozilla/source-map); if a `//@ sourceMappingURL` is found the reported error position is mapped to the original source file. This works great with output from compilers like [TypeScript](http://www.typescriptlang.org/) or build tools like [grunt-concat-sourcemap](https://github.com/kozy4324/grunt-concat-sourcemap).

### WebStorm

This reporter is tested and actively used in WebStorm with [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint). For maximum effect have a output filter configured in its [edit-tool-dialog](https://www.jetbrains.com/webstorm/webhelp/edit-tool-dialog.html) of the tool you run, something like:

````
$FILE_PATH$[ \t]*[:;,\[\(\{<]$LINE$(?:[:;,\.]$COLUMN$)?.*
````

## Usage

Install from NPM
````
 $ npm install jshint-path-reporter
````

Then pass **the path to the module** as the reporter option (see the [JSHint docs](http://jshint.com/docs)). It is a bit odd but this is how JSHint finds the module. I'm trying to get a fix for this merged in JSHint.

### grunt-contrib-jshint

````js
grunt.initConfig({
	//..
	jshint: {
		options: {
			jshintrc: '.jshintrc',
			reporter: './node_modules/jshint-path-reporter'
		}),
		source: {
			//..
		}
	}
});
````
If `grunt-contrib-jshint` doesn't share `'.jshintrc'` options over multiple target then you need to get it manually and extend or default:

````js
grunt.initConfig({
	//..
	jshint: {
		options: grunt.util._.defaults({
			reporter: './node_modules/jshint-path-reporter'
		}, grunt.file.readJSON('.jshintrc')),
		source: {
			options: {
				//override jshint options
			} 
			//..
		},
		minified : {
			options: {
				//override
			} 
			//..
		}
	}
});
````
## Options

### Globally disable ANSI colouring

For low-tech displays and pure text.
````js
require('jshint-path-reporter').color(false);
````

## Example output

> WebStorm (with link filter and darcula theme):
> ![webstorm darcula](https://raw.github.com/Bartvds/jshint-path-reporter/master/media/example_output_webstorm.png)

## History

* 0.1.4 - Fixed some typos in readme.
* 0.1.3 - Merged some fixes from [eslint-path-formatter](https://github.com/Bartvds/eslint-path-formatter) 
* 0.1.2 - Added source-map support
* 0.1.1 - Split display per file, inlined colors.js, fixed 'too many errors' bug

## Build

Install development dependencies in your git checkout:
````
$ npm install
````

You need the global [grunt](http://gruntjs.com) command:
````
$ npm install grunt-cli -g
````

Build and run tests:
````
$ grunt
````

See the `Gruntfile` for additional commands.

## License

Copyright (c) 2013 Bart van der Schoor

Licensed under the MIT license.

