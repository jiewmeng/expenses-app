/*jslint node: true */
'use strict';

const PARSE_URL = 'http://expenses-app.parseapp.com/';
const PARSE_APP_NAME = 'expenses-app';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var exorcist = require('exorcist');
var spawn = require('child_process').spawn;
var browserSync = require('browser-sync').create();

/**
 * Compiles public javascript with browserify/watchify
 * @param  {function} bundler call to either browserify/watchify
 */
function bundle(bundler) {
	return bundler
		.exclude('react')
		.exclude('react-dom')
		.exclude('parse')
		.exclude('parse-react')
		.transform(babelify, {presets: ['es2015', 'react']})
		.bundle()
		.on('error', (e) => $.util.log(e.message))
		.pipe(exorcist('./public/js/app.js.map'))
		.pipe(source('app.js'))
		.pipe(gulp.dest('./public/js'));
}

/**
 * Watchify public javascript
 */
gulp.task('watchify', function() {
	let opts = Object.assign({}, watchify.args, {
		debug: true
	});
	let watcher = watchify(browserify('./src/public/js/app.jsx', opts));
	let job = bundle(watcher);

	watcher.on('update', () => bundle(watcher));
	watcher.on('log', (m) => $.util.log(m));
	return job;
});

/**
 * Browserify public javascript
 */
gulp.task('browserify', function() {
	return bundle(browserify('./src/public/js/app.jsx', {debug: true}));
});

/**
 * Babel cloud JS
 */
gulp.task('babel', function() {
	return gulp.src('src/cloud/**/*.js')
		.pipe($.sourcemaps.init())
		.pipe($.babel({
			presets: ['es2015']
		}))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('cloud'));
});

/**
 * Browserify public 3rd party javascript (aka libs)
 */
gulp.task('libs', function() {
	return browserify('./public/js/libs.js')
		.require('react')
		.require('react-dom')
		.require('parse')
		.require('parse-react')
		.bundle()
		.pipe(source('libs.js'))
		.pipe(buffer())
		.pipe($.uglify())
		.pipe(gulp.dest('./public/js'));
});

/**
 * Calls `parse develop`
 */
gulp.task('parse-dev', function(done) {
	browserSync.init({
		proxy: PARSE_URL
	});
	let devStream = spawn('parse', ['develop', PARSE_APP_NAME]);
	devStream.stdout.on('data', function(data) {
		let msg = data.toString();
		if (msg.toLowerCase().includes('deployed')) {
			browserSync.reload();
		}
		console.log(data.toString());
	});
	devStream.stderr.on('data', function(data) {
		console.error(data.toString());
	});
	devStream.on('close', done);
});

/**
 * Compiles SCSS
 */
gulp.task('scss', function() {
	gulp.src('./src/public/scss/**/*.scss')
		.pipe($.sourcemaps.init())
		.pipe($.sass().on('error', $.sass.logError))
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('./public/css'));
});

/**
 * Watch changes in both cloud and public javascript files
 */
gulp.task('watch', ['watchify', 'parse-dev'], function() {
	gulp.watch(['./src/public/scss/**/*.scss'], ['scss']);
	gulp.watch(['./src/cloud/**/*.js'], ['babel']);
});

gulp.task('watch-scss', function() {
	gulp.watch(['./src/public/scss/**/*.scss'], ['scss']);
});
/**
 * Compiles all javascript
 */
gulp.task('build', ['libs', 'babel', 'browserify', 'scss']);
gulp.task('default', ['build']);
