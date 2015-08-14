/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    jasmine_nodejs: {
      test: {
        specs: ['test/**/*Spec.js']
      }
    }
  });

  // These plugins provide necessary tasks.
  
  grunt.loadNpmTasks('grunt-jasmine-nodejs');

  // Default task.
  grunt.registerTask('default', ['jasmine_nodejs:test']);

};
