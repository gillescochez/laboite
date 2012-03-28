module.exports = function(grunt) {

  grunt.initConfig({
    meta: {
      banner: '/*! github.com/gillescochez/laboite */'
    },
    concat: {
      dist: {
        src: [
            '<banner>',
            'src/head.js',
            'src/core.js',
            'src/defaults.js',
            'src/effects.js',
            'src/languages.js',
            'src/layouts.js',
            'src/fn.js',
            'src/foot.js'
        ],
        dest: 'dist/laboite2.js'
      }
    },
    min: {
      dist: {
        src: ['<banner>', 'dist/laboite2.js'],
        dest: 'dist/laboite2.min.js'
      }
    }
  });

  grunt.registerTask('default', 'concat min');
};
