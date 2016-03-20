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
const postcss = require('gulp-postcss');
const stylelint = require('stylelint');
const autoprefixer = require('autoprefixer');
const minify = require('cssnano');

const paths = {
  scripts: 'src/assets/js/app.js',
  styles: 'src/assets/styles/*.scss',
  jades: 'src/**/*.jade',
};

// Compile the javascript
gulp.task('scripts', function() {
  gulp.src(paths.scripts)
    .pipe(babel({
      presets: ['es2015'],
    }))
    .pipe(eslint())
    .pipe(eslint.format())
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
    .pipe(inject(gulp.src(['./build/**/*.js', './build/**/*.css'], { read: false })))
    .pipe(gulp.dest('build'));
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch('src/**/*.js', 'scripts');
  gulp.watch('src/**/*.scss', 'styles');
  gulp.watch('stc/**/*.jade', 'jades');
});

gulp.task('default', ['scripts', 'styles', 'jades']);
