var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

module.exports = {
  'development': {
    db: 'mongodb://localhost/plato',
    port: process.env.PORT || 3030,
    rootPath: rootPath
  },
  'production': {
    db: 'mongodb://localhost/plato',
    port: process.env.PORT || 80,
    rootPath: rootPath
  }
};