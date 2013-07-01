# jshint-path-reporter

[![Build Status](https://secure.travis-ci.org/Bartvds/jshint-path-reporter.png?branch=master)](http://travis-ci.org/Bartvds/jshint-path-reporter) [![Dependency Status](https://gemnasium.com/Bartvds/jshint-path-reporter.png)](https://gemnasium.com/Bartvds/jshint-path-reporter) [![NPM version](https://badge.fury.io/js/jshint-path-reporter.png)](http://badge.fury.io/js/jshint-path-reporter)

> JSHint reporter that displays absolute error path with row/column on one line

A console reporter similar to the default output except the report displays absolute file paths with the row/column appended in a parsable format. 

This allows convenient use of [JSHint](http://jshint.com) from within tools that apply a filter RegExp to console views to turn error lines into clickable links to instantly navigate to the error location.

Tested and actively used in WebStorm with [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint) (be sure to have a filter configured).

## Usage

Install from NPM
````
 $ npm install jshint-path-reporter
````

Then pass **the path to the module** as the reporter option (see the [JSHINT docs](http://jshint.com/docs)). It's a bit odd but this is how JSHINT finds the module. I'm pushing for a fix in JSHint but it will take for it to bubble back.

### grunt-contrib-jshint

Note: `grunt-contrib-jshint` acts oddly if you have multiple targets and specify a `reporter` and  `jshintrc` both in shared options, so you need to get your `'.jshintrc'` manually and merge like in the  example (until it's fixed upstream). 

````
grunt.initConfig({
	//..
	jshint: {
		options: grunt.util._.defaults(grunt.file.readJSON('.jshintrc'), {
			reporter: './node_modules/jshint-path-reporter'
		}),
		source: {
			//..
		}
	}
});
````
## Options

### Globally disable ANSI colouring

For low-tech displays and pure text.
````
require('jshint-path-reporter').color(false);
````

## Example output


> WebStorm (with link filter and darcula theme):
> ![webstorm darcula](https://raw.github.com/Bartvds/jshint-path-reporter/master/media/example_output_webstorm.png)

## History

* 0.1.1 - Split display per file, inlined colors.js, fixed 'too many errors' bug
* 0.1.0 - First release

## License

Copyright (c) 2013 Bart van der Schoor

Licensed under the MIT license.

