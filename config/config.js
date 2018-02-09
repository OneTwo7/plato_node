var path = require('path');
var rootPath = path.normalize(__dirname + '/../');

module.exports = {
  'development': {
    db: 'mongodb://localhost/plato',
    port: process.env.PORT || 3030,
    sessionSecret: 'Divine Unicorn',
    rootPath: rootPath
  },
  'production': {
    db: process.env.MLAB_URI,
    port: process.env.PORT || 80,
    sessionSecret: process.env.SESSION_SECRET,
    rootPath: rootPath
  }
};
