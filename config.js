var argv = require('yargs').argv;
var VERSION = argv.version || require('./package.json').version;
var TARGET = argv.min ? 'prod' : 'dev';

module.exports = {
  version: VERSION,
  target: TARGET,
  src: './www/',
  build: './www/dist/',
  fontsDest: './www/fonts/',
  paths: {
    scssVars: '/css/variables.scss',
    ngDocs: './docs/'
  },
  constants: {
    GOOGLE_API_KEY: 'AIzaSyA3Ydfsl4tqTyxG1m3ANowCScn4zXFZFs0',
    GOOGLE_API_URLS: {
      GEOCODING: 'https://maps.googleapis.com/maps/api/geocode/json',
      DIRECTIONS: 'https://maps.googleapis.com/maps/api/directions/json'
    },
    MOCK: {
      LATITUDE: '38.954555',
      LONGITUDE: '-77.351302'
    },
    FIREBASE: {

    }
  },
  globs: {
    sass: ['+(js|css)/**/!(variables).scss'],
    templates: ['js/**/*.html'],
    scripts: ['js/**/*module*.js', 'js/**/*controller*.js', 'js/**/*.js' ],
    assets: ['assets/**/*']
  },
  fonts: [

  ],
  cssLibs: [

  ],
  libs: [
        'underscore/underscore.js',
        'moment/moment.js',
        'angular-moment/angular-moment.js',
        'firebase/firebase.js',
        'angular-esri-map/dist/angular-esri-core.js',
        'angular-esri-map/dist/angular-esri-map.js'   
        ]   
};
