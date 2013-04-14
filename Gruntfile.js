module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      js: {
        options: { separator: ';' },
        src: [
          'src/namespace.js',
          'src/math.js',
          'src/turtle/turtle.js',
          'src/turtle/*.js',
          'src/system.js',
          'src/examples.js'
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: { banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n' },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.js.dest %>'],
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['concat', 'uglify']);

};
