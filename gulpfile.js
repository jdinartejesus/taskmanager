/* jscs:disable  */
/* eslint-disable */

const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const eslint = require('gulp-eslint');
const inject = require('gulp-inject');
const jade = require('gulp-jade');
const sass = require('gulp-sass');
const connect = require('gulp-connect')
const postcss = require('gulp-postcss');
const stylelint = require('stylelint');
const autoprefixer = require('autoprefixer');
const minify = require('cssnano');
const browserify = require('browserify');

const paths = {
  scripts: 'src/assets/js/app.js',
  styles: 'src/assets/styles/default.scss',
  jades: 'src/index.jade',
};

// Compile the javascript
gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
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

gulp.task('build', ['scripts', 'styles', 'jades', 'connect', 'watch']);

gulp.task('default', ['scripts', 'styles', 'jades']);
