'use strict';

var _ = require('lodash'),
    gulp = require('gulp'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    rename = require('gulp-rename'),
    //lazy-load gulp plugins
    plugins = require('gulp-load-plugins')({
        rename: {
            'gulp-angular-templatecache': 'templateCache'
        }
    }),
    runSequence = require('run-sequence'),
    path = require('path'),
    endOfLine = require('os').EOL;

// File asset locations and configuration
var defaultAssets = require('./config/assets/default');

// Set NODE_ENV to 'test' //TODO implement TDD
gulp.task('env:test', function () {
    process.env.NODE_ENV = 'test';
});

// Set NODE_ENV to 'development'
gulp.task('env:dev', function () {
    process.env.NODE_ENV = 'development';
});

// Set NODE_ENV to 'production'
gulp.task('env:prod', function () {
    process.env.NODE_ENV = 'production';
});

// Watch Files For Changes
gulp.task('watch', function () {
    // Start livereload
    plugins.livereload.listen();
    
    // Add watch rules
    gulp.watch(defaultAssets.server.views).on('change', plugins.livereload.changed);
    gulp.watch(defaultAssets.server.allJS, ['eslint']).on('change', plugins.livereload.changed);
    gulp.watch(defaultAssets.client.js, ['eslint']).on('change', plugins.livereload.changed);
    gulp.watch(defaultAssets.client.css, ['csslint']).on('change', plugins.livereload.changed);
    gulp.watch(defaultAssets.client.sass, ['sass', 'csslint']).on('change', plugins.livereload.changed);
    gulp.watch(defaultAssets.client.less, ['less', 'csslint']).on('change', plugins.livereload.changed);

    if (process.env.NODE_ENV === 'production') {
        gulp.watch(defaultAssets.server.gulpConfig, ['templateCache', 'eslint']);
        gulp.watch(defaultAssets.client.views, ['templateCache']).on('change', plugins.livereload.changed);
    } else {
        gulp.watch(defaultAssets.server.gulpConfig, ['eslint']);
        gulp.watch(defaultAssets.client.views).on('change', plugins.livereload.changed);
    }
});


// CSS linting task
gulp.task('csslint', function (done) {
    return gulp.src(defaultAssets.client.css)
        .pipe(plugins.csslint('.csslintrc'))
        .pipe(plugins.csslint.reporter())
        .pipe(plugins.csslint.reporter(function (file) {
            if (!file.csslint.errorCount) {
                done();
            }
        }));
});

// ESLint JS linting task
gulp.task('eslint', function () {
    var assets = _.union(
        defaultAssets.server.gulpConfig,
        defaultAssets.server.allJS,
        defaultAssets.client.js
    );

    return gulp.src(assets)
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format());
});

// JS minifying task
gulp.task('uglify', function () {
    var assets = _.union(
        defaultAssets.client.js,
        defaultAssets.client.templates
    );

    return gulp.src(assets)
        .pipe(plugins.browserify())
        .pipe(plugins.ngAnnotate())
        .pipe(plugins.uglify({
            mangle: false
        }))
        .pipe(plugins.concat('application.min.js'))
        .pipe(gulp.dest('public/dist'));
});

// CSS minifying task
gulp.task('cssmin', function () {
    return gulp.src(defaultAssets.client.css)
        .pipe(plugins.csso())
        .pipe(plugins.concat('application.min.css'))
        .pipe(gulp.dest('public/dist'));
});

// Sass task
gulp.task('sass', function () {
    return gulp.src(defaultAssets.client.sass)
        .pipe(plugins.sass())
        .pipe(plugins.autoprefixer())
        .pipe(plugins.rename(function (file) {
            file.dirname = file.dirname.replace(path.sep + 'scss', path.sep + 'css');
        }))
        .pipe(gulp.dest('./modules/'));
});

// Angular template cache task
gulp.task('templateCache', function () {
    return gulp.src(defaultAssets.client.views)
        .pipe(plugins.templateCache('templates.js', {
            root: 'modules/',
            module: 'core',
            templateHeader: '(function () {' + endOfLine + '	\'use strict\';' + endOfLine + endOfLine + '	angular' + endOfLine + '		.module(\'<%= module %>\'<%= standalone %>)' + endOfLine + '		.run(templates);' + endOfLine + endOfLine + '	templates.$inject = [\'$templateCache\'];' + endOfLine + endOfLine + '	function templates($templateCache) {' + endOfLine,
            templateBody: '		$templateCache.put(\'<%= url %>\', \'<%= contents %>\');',
            templateFooter: '	}' + endOfLine + '})();' + endOfLine
        }))
        .pipe(gulp.dest('build'));
});

// Lint CSS and JavaScript files.
gulp.task('lint', function (done) {
    runSequence('sass', ['csslint', 'eslint'], done);
});

// Lint project files and minify them into two production files.
gulp.task('build', function (done) {
    runSequence('env:dev', 'lint', ['uglify', 'cssmin'], done);
});

// Run the project in development mode
gulp.task('default', function (done) {
    runSequence('env:dev', 'lint', 'watch', done);
});

// Run the project in production mode
gulp.task('prod', function (done) {
    runSequence('templateCache', 'build', 'env:prod', 'lint', 'watch', done);
});