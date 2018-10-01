var base = require('./webpack.base.conf');

base.externals = [
  function (context, request, callback) {
    if (request[0] == '.') {
      callback();
    } else {
      callback(null, "require('" + request + "')");
    }
  }
];
base.watch = true;
module.exports = base;
