module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    eslint: {
      options: {
        config: 'config/.eslintrc',
        reset: true
      },
      target: ['Gruntfile.js', 'index.js', 'lib/**/*.js', 'tests/**/*.js']
    },
    mochaTest: {
      test: {
        src: ['tests/**/*.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask('default', ['eslint', 'mochaTest']);
};
