// Gulp modules
var gulp    = require('gulp')
,   connect = require('gulp-connect')
,   bump    = require('gulp-bump')
,   argv    = require('yargs').argv
,   uglify  = require('gulp-uglify')
,   rename  = require('gulp-rename');

// Path variables
var demoDir = './demo'
,   srcDir  = './src'
,   distDir = './dist';

// A handy little demo server
gulp.task('connect', function(){
  connect.server({
    root: './',
    port: 8888,
    livereload: argv.livereload == 'false' ? false : true
  });
});

gulp.task('html-reload', function(){
  gulp.src(demoDir + '/*.html')
    .pipe(connect.reload());
});

gulp.task('connect-watch', function(){
  if(argv.livereload != 'false') {
    gulp.watch([demoDir + '/**/*.html', demoDir + '/**/*.css', demoDir + '/**/*.js'], ['html-reload']);
  }
});

gulp.task('build', function(){
  // Grab any JS in the src dir
  gulp.src(srcDir + '/*.js')
    // Copy the expanded version to dist
    .pipe(gulp.dest(distDir))
    // Minify
    .pipe(uglify({
      preserveComments: 'some'
    }))
    // Rename the minified version
    .pipe(rename(function(path){
      path.basename += '.min';
    }))
    // Copy the minified version to dist
    .pipe(gulp.dest(distDir));
});

gulp.task('serve', ['connect', 'connect-watch']);

// Default task
gulp.task('default', ['build']);

// Versioning helpers

gulp.task('bump', function(){
  var type = argv.type || 'patch';
  gulp.src(['package.json', 'bower.json'])
    .pipe(bump({ type: type }))
    .pipe(gulp.dest('./'));
});