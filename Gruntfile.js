/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Task configuration.
        jshint:{
            options: {
                jshintrc: true,
                reporter: require('jshint-stylish')
            },
            all: [ 'src/*.js' ]
        },
        jasmine_nodejs: {
            test: {
                specs: ['test/**/*Spec.js']
            }
        },
        release:  {
            options: {
                add: false,
                beforeRelease: ['default']
            }
        }
    });

    // These plugins provide necessary tasks.
    
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-jasmine-nodejs');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default task.
    grunt.registerTask('default', ['jasmine_nodejs:test','jshint']);
    grunt.registerTask('test', ['jasmine_nodejs:test']);

};
