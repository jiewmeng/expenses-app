'use strict';

/**
 * Starts `nodemon` and `browser-sync`
 */

const path = require('path');
const fs = require('fs');
const nodemon = require('nodemon');
const browserSync = require('browser-sync').create();
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const sass = require('node-sass');
const watch = require('node-watch');

const SRCDIR = path.normalize(`${__dirname}/../src`);
const BUILDDIR = path.normalize(`${__dirname}/../build`);

let browserSyncInitialized = false;

nodemon({
  script: `${SRCDIR}/app.js`,
  watch: `${SRCDIR}`,
  ext: 'js,jsx,jade'
});

let webpacker = webpack(webpackConfig);
let webpackWatcher = webpacker.watch({}, function(err, stats) {
  if (err) {
    console.error(`WEBPACK ERROR: ${err.message}`);
    console.error(err.stack);
    return;
  }

  stats = stats.toJson();
  if (stats.errors.length > 0) {
    return console.error('WEBPACK ERROR', stats.errors);
  }
  if (stats.warnings.length > 0) {
    return console.error('WEBPACK WARNING', stats.warnings);
  }
})

watch(`${SRCDIR}/public/scss`, function() {
  const OUTFILE = `${BUILDDIR}/css/app.css`;
  sass.render({
    file: `${SRCDIR}/public/scss/app.scss`,
    outFile: OUTFILE
  }, function(err, result) {
    if (err) {
      console.error(`SASS ERROR: [Line ${err.line}] ${err.message}`);
      return;
    }
    console.log('SASS RENDERED: ', result.stats);
    fs.writeFile(OUTFILE, result.css, 'utf8', function(err) {
      if (err) console.error('SASS ERROR: Failed to write file');
      console.log(`SASS Wrote to ${OUTFILE}`);
    });
  });
});

nodemon
  .on('start', function() {
    console.log('Nodemon started');
    if (!browserSyncInitialized) {
      browserSync.init({
        proxy: 'http://localhost:8000',
        port: '3000',
        notify: true,
        files: [
          `${BUILDDIR}/**/*`
        ]
      });
      browserSyncInitialized = true;
    } else {
      setTimeout(browserSync.reload, 500);
    }
  })
  .on('quit', function() {
    console.log('Nodemon stopped');
    webpackWatcher.close(() => process.exit(0));
  })
  .on('restart', function(files) {
    console.log('Nodemon restarted');
  });