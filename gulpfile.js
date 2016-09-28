var args = require('yargs').argv;
var del = require('del');
var fs = require('fs');
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var gulpif = require('gulp-if');
var iife = require('gulp-iife');
var insert = require('gulp-insert');
var uglify = require('gulp-uglify');
var cleanCSS = require('gulp-clean-css');
var templateCache = require('gulp-angular-templatecache');
var ngConstant = require('gulp-ng-constant');
var replace = require('gulp-replace');
var merge = require('merge-stream');
var exec = require('child_process');
var watch = require('gulp-watch')

//constants
var config = require('./config');

gulp.task('clean', clean);
gulp.task('fonts', fonts);
gulp.task('lib-js', libJS);
gulp.task('lib-css', libCSS);
gulp.task('build-js', buildJS);
gulp.task('build-html', buildHTML);
gulp.task('build-sass', buildSASS);
gulp.task('build', ['build-js', 'build-html', 'build-sass', 'lib-js', 'lib-css', 'fonts']);
gulp.task('default', ['build']);
gulp.task('help', function () {
    console.log('available commands: [build, build-js, build-css]');
});
gulp.task('watch', function () {
  gulp.watch([
      'www/**/*',
      '!www/dist/*',
      '!www/fonts/*',
      '!www/lib/*'
  ], ['default']);
});

function clean () {
  return del([(config.build + '**')]);
}
function buildJS () {
  var ng = gulp.src(config.globs.scripts, {cwd: config.src});
  var constants = ngConstant({
      name: 'unisys.onboarding.constants',
      constants: config.constants,
      stream: true
  });
  return merge(ng, constants)
    .pipe(iife())
    .pipe(concat('app.js'))
    //.pipe(gulpif(!args.dev, uglify()))
    .pipe(gulp.dest(config.build));
}
function buildSASS () {
  var scssVars = fs.readFileSync(config.src + config.paths.scssVars, 'utf8').toString();
  return gulp.src(config.globs.sass, {cwd: config.src})
    .pipe(concat('app.scss'))
    .pipe(insert.prepend(scssVars))
    .pipe(sass({
      includePaths: [config.src]
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer())
    .pipe(gulp.dest(config.build));
}
function fonts () {
  var modules = gulp.src(config.fonts, {cwd: './node_modules/'})
    .pipe(gulp.dest(config.fontsDest));
  return merge(modules);
}
function libCSS () {
  var modules = gulp.src(config.cssLibs, {cwd: './node_modules/'})
    .pipe(concat('lib.css'))
    .pipe(gulp.dest(config.build));
  return merge(modules);
}
function libJS () {
  var modules = gulp.src(config.libs, {cwd: './node_modules/'})
    .pipe(concat('lib.js'))
    .pipe(gulpif(!args.dev, uglify()))
    .pipe(gulp.dest(config.build));
  return merge(modules);
}
function buildHTML () {
  return gulp.src(config.globs.templates, {cwd: config.src})
    .pipe(templateCache({
      module: 'unisys.onboarding.templates',
      standalone: true
    }))
    .pipe(gulpif(!args.dev, uglify()))    
    .pipe(gulp.dest(config.build));
}

