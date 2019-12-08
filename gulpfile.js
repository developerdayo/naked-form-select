const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const glob = require('glob');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const pump = require('pump');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

function sassTask(done) {
    const sassOptions = {
        errLogToConsole: true,
        outputStyle: 'compressed'
    };
    const plugins = [
        autoprefixer()
    ];

    return gulp.src('src/naked-form-select.scss')
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('compiled/css'))
}

function babelTask() {
  return gulp.src('src/naked-form-select.js')
  .pipe(babel())
  .pipe(gulp.dest('compiled/js'));
}

function uglifyTask() {
  return gulp.src('src/naked-form-select.js')
  .pipe(babel({
      presets: ['@babel/preset-env']
  }))
  .pipe(uglify())
  .pipe(gulp.dest('compiled/js'));
}

function watchTask() {
    "use strict";
    gulp.watch('src/naked-form-select.scss', sassTask);
    gulp.watch('src/naked-form-select.js', babelTask);
}

gulp.task('sass', sassTask); // dev css; includes sourcemap
gulp.task('babel', babelTask);
gulp.task('uglify', uglifyTask);

gulp.task('default', gulp.parallel('sass', 'babel')); // dev sass and babel
gulp.task('watch', gulp.series('default', watchTask)); // watch; includes dev sass and babel