var gulp = require('gulp');
var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var connect = require('gulp-connect');
var config = require('../config').app;
var handlers = require('../handlers');

// TODO: Split this task up. 
// 1. Compile to separate js classes
// 2. Minify
// 3. Concatenate everything.

var browserifyConfig = {
    settings: {
      transform: [
        'reactify', 
        'babelify'
      ]
    },
    src: config.src + 'index.jsx',
    dest: config.dest + 'js',
    outputName: 'index.js',
    debug: gutil.env.type === 'dev'
};

watchify.args.debug = browserifyConfig.debug;

var bundler = watchify(browserify(browserifyConfig.src, watchify.args));

browserifyConfig.settings.transform.forEach(function(t) {
  bundler.transform(t);
});

gulp.task('javascript', bundle);
bundler.on('update', bundle);

function bundle() {
  return bundler.bundle()
  .on('error', handlers.error('browserfy-error'))
  .pipe(source(browserifyConfig.outputName))
  .pipe(gulp.dest(browserifyConfig.dest))
  .pipe(connect.reload());
}
