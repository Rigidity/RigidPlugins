const plugins = require('.');

const $ = plugins();
plugins.all($, './builtin');
$.logger.log('Hello, world!');