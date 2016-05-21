/* jscs:disable  */
/* eslint-disable */

const gulp = require('gulp');
const inject = require('gulp-inject');
const jade = require('gulp-jade');
const sass = require('gulp-sass');
const connect = require('gulp-connect')
const postcss = require('gulp-postcss');
const stylelint = require('stylelint');
const autoprefixer = require('autoprefixer');
const minify = require('cssnano');
const browserify = require('browserify');
const source = require("vinyl-source-stream");
const eslint = require('gulp-eslint');

const paths = {
  scripts: 'src/assets/js/app.js',
  styles: 'src/assets/styles/default.scss',
  jades: 'src/index.jade',
};

// Compile the javascript
gulp.task('scripts', function() {
  return browserify({entries: paths.scripts, debug: true})
  .transform("babelify", {presets: ["es2015"]})
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest('build/js'));
});

// Validate scripts
gulp.task('linter', function() {
  gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.format());
});

// Compile sass into css
gulp.task('styles', function() {
  gulp.src(paths.styles)
    .pipe(sass())
    .pipe(postcss([autoprefixer, stylelint, minify]))
    .pipe(gulp.dest('build/styles'));
});

// Compile jades to html
gulp.task('jades', function() {
  gulp.src(paths.jades)
    .pipe(jade({
      pretty: true,
    }))
    .pipe(gulp.dest('build'))
    .pipe(inject(gulp.src(['./js/app.js', './styles/default.css'], { read: false })));
});

// Server to run application
gulp.task('connect', function() {
  connect.server({
    root: 'build',
    port: 8000,
    livereload: true
  });
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('src/**/*.js', ['scripts']);
  gulp.watch('src/**/*.scss', ['styles']);
  gulp.watch('src/**/*.jade', ['jades']);
});

gulp.task('build', ['scripts', 'linter', 'styles', 'jades', 'connect', 'watch']);

gulp.task('default', ['scripts', 'styles', 'jades']);
