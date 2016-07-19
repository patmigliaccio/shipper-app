'use strict';

var gulp = require('gulp'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass');

var config = {
    js: {
        src: 'app/**/*.js',
        outputDir: 'app/',
        mapDir: 'maps/',
        outputFile: 'bundle.js'
    },
    css : {
        src: 'assets/css/**/*.scss',
        outputDir: 'assets/css/',
        outputFile: 'styles.css'
    }
};
	
gulp.task('scripts', function() {
    return browserify('app/app.js').bundle()
        .pipe(source(config.js.outputFile))
        .pipe(gulp.dest(config.js.outputDir))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(rename({ suffix: '.min' }))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write(config.js.mapDir))
        .pipe(gulp.dest(config.js.outputDir));
});

//TODO pipe in sass compiling
/*gulp.task('styles', function () {
    return gulp.src(config.css.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(rename(config.css.outputFile))
        .pipe(gulp.dest(config.css.outputDir))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(config.css.outputDir));
});*/

gulp.task('watch', function() {
    gulp.watch(config.js.src, ['scripts']);
    //gulp.watch(config.css.src, ['styles']);
});

gulp.task('default', [
	'scripts',
    //'styles'
]);