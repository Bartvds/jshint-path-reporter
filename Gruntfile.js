module.exports = function (grunt) {
	'use strict';

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			//merge reporter into jshint
			options: grunt.util._.defaults(grunt.file.readJSON('.jshintrc'), {
				reporter: 'index.js'
			}),
			pass: [
				'Gruntfile.js',
				'index.js'
			],
			fail: [
				'test/fail_*.js'
			]
		}
	});

	grunt.registerTask('default', ['jshint']);
	grunt.registerTask('test', ['jshint:pass']);
};