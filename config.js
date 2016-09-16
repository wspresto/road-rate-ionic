var argv = require('yargs').argv;
var VERSION = argv.version || require('./package.json').version;
var TARGET = argv.min ? 'prod' : 'dev';

module.exports = {
  version: VERSION,
  target: TARGET,
  src: './www/',
  build: './www/dist/',
  paths: {
    scssVars: '/css/variables.scss',
    ngDocs: './docs/'
  },
  constants: {
    USER: 'user1'
  },
  globs: {
    sass: ['+(app|scss)/**/!(variables).scss'],
    templates: ['js/**/*.html'],
    scripts: ['js/**/*module*.js', 'js/**/*controller*.js', 'js/**/*.js', ],
    assets: ['assets/**/*']
  },
  fonts: {
      dev: [],
      prod: []
  },
  cssLibs: {
      dev: [],
      prod: []
  },
  libs: [
        'underscore/underscore.js'
        ]   
};
