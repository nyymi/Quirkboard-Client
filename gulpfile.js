var gulp = require('gulp');
var connect = require('gulp-connect');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var browserify = require('browserify');
var collapse = require('bundle-collapser/plugin');
var source = require('vinyl-source-stream');

gulp.task('connect', function() {
    connect.server({
        root: 'public',
        port: 8080
    });
});

gulp.task('browserify', function() {
    return browserify('./app/app.js')
        .plugin(collapse)
        .bundle()
        .pipe(source('main.js'))
        //.pipe(streamify(uglify()))
        .pipe(gulp.dest('./public/js/'));
});

gulp.task('watch', function() {
    gulp.watch('app/**/*.js', ['browserify']);
});

gulp.task('default', ['browserify', 'connect', 'watch']);
