'use strict';

/**
 * Starts watchers (WebPack JS/SCSS) and servers
 * API Server (nodemon): http://localhost:3030
 * Client Server (browser-sync): http://localhost:8000
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
const BUILDDIR = path.normalize(`${__dirname}/../public`);

let browserSyncInitialized = false;

nodemon({
  script: `${SRCDIR}/app.js`,
  watch: `${SRCDIR}`,
  ext: 'js'
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
    console.error('WEBPACK ERROR');

    stats.errors.forEach(console.error.bind(console));
    return;
  }
  if (stats.warnings.length > 0) {
    return console.error('WEBPACK WARNING', stats.warnings);
  }
})

console.log(`${SRCDIR}/public/scss`)
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

watch(`${SRCDIR}/public`, function(file) {
  let relativePath = path.relative(`${SRCDIR}/public`, file);

  if (relativePath.match(/^(react|scss)/)) {
    return console.log(`WATCH: skip ${relativePath}`);
  }

  let destPath = `${BUILDDIR}/${relativePath}`;
  let destPathRelativeBuild = path.relative(BUILDDIR, destPath)
  fs.createReadStream(file)
    .pipe(fs.createWriteStream(destPath))
    .on('finish', () => console.log(`Wrote to ${destPathRelativeBuild}`));
});

nodemon
  .on('start', function() {
    console.log('Nodemon started');
    if (!browserSyncInitialized) browserSync.init({
      server: BUILDDIR,
      notify: true,
      files: [
        `${BUILDDIR}/**/*`
      ]
    });
    browserSyncInitialized = true;
  })
  .on('quit', function() {
    console.log('Nodemon stopped');
    webpackWatcher.close(() => process.exit(0));
  })
  .on('restart', function(files) {
    console.log('Nodemon restarted');
  });
