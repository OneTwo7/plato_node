var gulp = require('gulp');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var changed = require('gulp-changed');
var watch = require('gulp-watch');
var exec = require('child_process').exec;
var env = process.env.NODE_ENV;
var tasks = ['vendor', 'bundle'];

// JavaScript vendor task: write one file for external libraries
gulp.task('vendor', function () {
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'node_modules/angular/angular.min.js',
    'node_modules/angular-route/angular-route.min.js',
    'node_modules/angular-resource/angular-resource.min.js',
    'node_modules/ngstorage/ngStorage.min.js',
    'node_modules/toastr/build/toastr.min.js'
  ])
  .pipe(concat('vendor.js'))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('public/dist'));
});

// JavaScript bundle task: write one minified file for app scripts
gulp.task('bundle', function () {
  return gulp.src('public/js/**/*.js')
  .pipe(changed('public/dist'))
  .pipe(concat('bundle.js'))
  .pipe(gulpif(env === 'production', uglify()))
  .pipe(sourcemaps.write('./'))
  .pipe(gulp.dest('public/dist'));
});

// watch task
gulp.task('watch', function () {
  watch('public/js/**/*.js', function () {
    gulp.start('bundle');
  });
});

if (env !== 'production') {
  tasks.push('watch');
}
 
// executable tasks when running 'gulp' command
gulp.task('default', tasks);
