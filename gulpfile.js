const gulp = require('gulp');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const mocha = require('gulp-mocha');
const clean = require('gulp-clean');
const runSequence = require('run-sequence');
 
gulp.task('lint', function() {
  return gulp
    .src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('clean', function() {
  return gulp
    .src(['lib/**/*.js', 'test/**/*.js', 'bin/**/*.js'], {read: false})
    .pipe(clean());
});

gulp.task('transcompile', function() {
  return gulp
    .src("src/**/*.js")
    .pipe(babel())
    .pipe(gulp.dest("./"));
});

gulp.task('test', function() {
  return gulp
    .src('test/**/*.js', { read: false })
    .pipe(mocha({ growl: true }))
});

gulp.task('default', function() {
  runSequence(
    'clean',
    'transcompile', 
    'test',
    'lint'
  );
});

gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['default']);
});
