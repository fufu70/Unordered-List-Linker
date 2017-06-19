const gulp = require('gulp');
const gulpLoadPlugins = require('gulp-load-plugins');
const browserSync = require('browser-sync').create();
const del = require('del');
const wiredep = require('wiredep').stream;
const browserify = require('browserify');
const babelify = require('babelify');
const buffer = require('vinyl-buffer');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const runSequence = require('run-sequence');
const sassInlineImage = require('sass-inline-image');
const merge = require('merge-stream');

const CONFIGS = [require('./gulp.config')];

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

var dev = true;

gulp.task('styles', () => {
  let tasks = CONFIGS.map(config => {
    return gulp.src(config.sass.src)
        .pipe($.plumber())
        .pipe($.if(config.isDev, $.sourcemaps.init()))
        .pipe($.sass.sync({
          outputStyle: config.sass.outputStyle,
          precision: 10,
          includePaths: ['.'],
          functions: sassInlineImage({ /* options */ })
        }).on('error', $.sass.logError))
        .pipe($.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
        .pipe($.if(config.isDev, $.sourcemaps.write()))
        .pipe(gulp.dest(config.buildLocations.css))
    .pipe(reload({stream: true}));
  });

  return merge(tasks);
});

gulp.task('html', ['styles'], () => {
  return gulp.src('example/*.html')
    .pipe($.useref({searchPath: ['.tmp', 'example', '.']}))
    .pipe($.if(/\.js$/, $.uglify({compress: {drop_console: true}})))
    .pipe($.if(/\.css$/, $.cssnano({safe: true, autoprefixer: false})))
    .pipe($.if(/\.html$/, $.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {compress: {drop_console: true}},
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', () => {
  return gulp.src('example/images/**/*')
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src(require('main-bower-files')('**/*.{eot,svg,ttf,woff,woff2}', function (err) {})
    .concat('example/fonts/**/*'))
    .pipe($.if(dev, gulp.dest('.tmp/fonts'), gulp.dest('dist/fonts')));
});

gulp.task('extras', () => {
  return gulp.src([
    'example/*',
    '!example/*.html'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'));
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist']));

gulp.task('serve', () => {
  runSequence(['clean', 'wiredep'], ['styles', 'fonts'], () => {
    browserSync.init({
      notify: false,
      port: 9000,
      server: {
        baseDir: ['.tmp', 'example'],
        routes: {
          '/bower_components': 'bower_components'
        }
      }
    });

    gulp.watch([
      'example/*.html',
      'example/images/**/*',
      '.tmp/fonts/**/*'
    ]).on('change', reload);

    gulp.watch('example/styles/**/*.scss', ['styles']);
    gulp.watch('example/fonts/**/*', ['fonts']);
    gulp.watch('bower.json', ['wiredep', 'fonts']);
  });
});

gulp.task('serve:dist', ['default'], () => {
  browserSync.init({
    notify: false,
    port: 9000,
    ghostMode: {
      clicks: true,
      forms: true,
      scroll: true
    },
    server: {
      baseDir: ['dist']
    }
  });
});

// inject bower components
gulp.task('wiredep', () => {
  gulp.src('example/styles/*.scss')
    .pipe($.filter(file => file.stat && file.stat.size))
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)+/
    }))
    .pipe(gulp.dest('example/styles'));

  gulp.src('example/*.html')
    .pipe(wiredep({
      exclude: ['bootstrap-sass'],
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('example'));
});

gulp.task('build', ['html', 'images', 'fonts', 'extras'], () => {
  return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
});

gulp.task('default', () => {
  return new Promise(resolve => {
    dev = false;
    runSequence(['clean', 'wiredep'], 'build', resolve);
  });
});