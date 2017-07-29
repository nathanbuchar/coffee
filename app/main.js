const { app } = require('electron');
const debug = require('debug')('coffee:main');

app.on('ready', () => {
  debug('app ready');

  require('./lib/app');
});
