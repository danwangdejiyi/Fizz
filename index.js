var ulog = require('./api/ulog.js');

module.exports = {
	sendUlog: ulog.sendUlog,
	initViewUlog: ulog.initViewUlog,
	initViewComUlog: ulog.initViewComUlog,
	initApp: ulog.initApp,
	initPage: ulog.initPage,
  initConfig: ulog.initConfig
}