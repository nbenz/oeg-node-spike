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
    mocha: {
      all: {
        src: ['tests/tests.html']
      },
      options: {
        run: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-mocha');
  grunt.loadNpmTasks('grunt-eslint');

  grunt.registerTask('default', ['eslint', 'mocha']);
};
