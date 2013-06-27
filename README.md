# jshint-path-reporter

[![Build Status](https://secure.travis-ci.org/Bartvds/jshint-path-reporter.png?branch=master)](http://travis-ci.org/Bartvds/jshint-path-reporter) [![Dependency Status](https://gemnasium.com/Bartvds/jshint-path-reporter.png)](https://gemnasium.com/Bartvds/jshint-path-reporter) [![NPM version](https://badge.fury.io/js/jshint-path-reporter.png)](http://badge.fury.io/js/jshint-path-reporter)

> JSHint reporter that displays absolute error path with row/column on one line

A console reporter similar to the default output except the report displays absolute file paths with the row/column appended in a parsable format. 

This allows convenient use of [JSHint](http://jshint.com) from within tools that apply a filter RegExp to console views to turn error lines into clickable links to instantly navigate to the error location.

Tested in WebStorm with [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint) (be sure to have a filter configured).

## Usage

Install from NPM
````
 $ npm install jshint-path-reporter
````

Then pass the module as the  reporter option (see [JSHINT docs](http://jshint.com/docs))

For usage in `grunt-contrib-jshint` use the reporter option; for example merge it with your `.jshintrc` options:

````
grunt.initConfig({
	//..
	jshint: {
		options: grunt.util._.defaults(grunt.file.readJSON('.jshintrc'), {
			reporter: './node_modules/jshint-path-reporter'
		}),
		//..
	}
});
````

You can globally disable ANSI colouring:

````
	require('jshint-path-reporter').color(false);
````

## Example output

````
Linting ERROR at D:\projects\jshint-path-reporter\test\fail.js(2,1)
  W117: 'undeclaredVar' is not defined.
  undeclaredVar = 123;
Linting ERROR at D:\projects\jshint-path-reporter\test\fail.js(4,1)
  W061: eval can be harmful.
  eval('123');

JSHint found 2 errors
````

## History

* 0.1.0 - First release

## License

Copyright (c) 2013 Bart van der Schoor

Licensed under the MIT license.

