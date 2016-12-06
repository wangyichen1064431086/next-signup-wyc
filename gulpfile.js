const promisify = require('promisify-node')
const fs = promisify('fs');
const path = require('path');
const isThere = require('is-there');
const co = require('co');
const mkdirp = require('mkdirp');

const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const cssnext = require('postcss-cssnext');

const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

const rollup = require('rollup').rollup;
const buble = require('rollup-plugin-buble');
const bowerResolve = require('rollup-plugin-bower-resolve');
const uglify = require('rollup-plugin-uglify');
let cache;

const nunjucks = require('nunjucks');

nunjucks.configure('views', {
  noCache: true,
  watch: false
});

function render(view, context) {
  return new Promise(function(resolve, reject) {
    nunjucks.render(view, context, function(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

process.env.NODE_ENV = 'dev';

// change NODE_ENV between tasks.
gulp.task('prod', function(done) {
  process.env.NODE_ENV = 'prod';
  done();
});

gulp.task('dev', function(done) {
  process.env.NODE_ENV = 'dev';
  done();
});

gulp.task('styles', function styles() {
  const DEST = 'public/styles';

  return gulp.src('client/main.scss')
    .pipe($.changed(DEST))
    .pipe($.plumber())
    .pipe($.sourcemaps.init({loadMaps:true}))
    .pipe($.sass({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['bower_components']
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      cssnext({
        features: {
          colorRgba: false
        }
      })
    ]))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(DEST));
});

gulp.task('webpack', (done) => {
  if (process.env.NODE_ENV === 'prod') {
    delete webpackConfig.watch;
  }

  webpack(webpackConfig, function(err, stats) {
    if (err) throw new $.util.PluginError('webpack', err);
    $.util.log('[webpack]', stats.toString({
      colors: $.util.colors.supportsColor,
      chunks: false,
      hash: false,
      version: false
    }));
    done();
  });
});

gulp.task('serve', gulp.parallel('styles', 'webpack', () => {
  gulp.watch('client/**/*.scss', gulp.parallel('styles'));
}));



gulp.task('rollup', () => {
  return rollup({
    context: 'window',
    entry: 'client/main.js',
    plugins: [
        bowerResolve(),
        buble(),
        uglify()
    ],
    cache: cache,
  }).then(function(bundle) {
    cache = bundle;
    return bundle.write({
        format: 'iife',
        dest: 'public/scripts/main.js',
        sourceMap: true,
    }).then(function() {
        console.log('done');
    });
  });
});

gulp.task('html', () => {
  return co(function *() {
    const context = {
      dev: false
    };

    if (process.env.NODE_ENV === 'dev') {
      context.dev = true;
    }

    const result = yield render('register-new.html', context);

    yield fs.writeFile('public/register.html', result, 'utf8');
  });
});

gulp.task('build', gulp.series('prod', gulp.parallel('html', 'styles', 'rollup'), 'dev'));

gulp.task('deploy', function() {
  const DEST = path.resolve(__dirname, `../phone`);

  console.log(`Deploying HTML file to: ${DEST}`);

  return gulp.src(`public/register.html`)
    .pipe($.smoosher({
      ignoreFilesNotFound: true
    }))
    .pipe($.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe($.rename('register-new.html'))
    .pipe(gulp.dest(DEST));
});