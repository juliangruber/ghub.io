#!/usr/bin/env node

var server = require('..');

var port = process.env.PORT || process.argv[2] || 7000;
server.listen(port, function () {
  console.log('server listening on port ' + port);
});
