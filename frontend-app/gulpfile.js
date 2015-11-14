var gulp = require('gulp');
var browserSync = require('browser-sync');
var del = require('del');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minfiyCss = require('gulp-minify-css');
var minifyHtml = require('gulp-minify-html');
var runSequence = require('run-sequence');

gulp.task('clean', function(callback) {
    return del('dist');
});

gulp.task('copy-assets', function() {
    return gulp.src('./app/assets/**')
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('copy-fonts', function() {
    return gulp.src('./app/fonts/*')
        .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('copy-images', function() {
    return gulp.src('./app/images/*')
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('copy-views', function() {
    return gulp.src('./app/views/**/*.html')
        .pipe(minifyHtml({empty: true}))
        .pipe(gulp.dest('./dist/views'));
});

gulp.task('minify', function() {
    return gulp.src('app/index.html')
        .pipe(usemin({
            assetsDir: 'app',
            libcss: [minfiyCss(), 'concat'],
            customcss: [minfiyCss(), 'concat'],
            libjs: [uglify(), 'concat'],
            customjs: [uglify(), 'concat']
        }))
        .pipe(gulp.dest('dist'))
});

gulp.task('build', function(callback) {
    runSequence(
        'clean',
        'copy-assets',
        'copy-fonts',
        'copy-fonts',
        'copy-images',
        'copy-views',
        'minify',
        function(error) {
            if (error) {
                console.log(error.message);
            } else {
                console.log('Built Successfully');
            }
            callback(error);
        });
});

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('watch', ['browserSync'], function() {
    var watchFiles = [
        'app/*.html',
        'app/views/**/*.html',
        'app/scripts/**/*.js',
        'app/styles/**/*.css',
    ];

    gulp.watch(watchFiles, browserSync.reload);
});
