var webtap = require('webtap');
var ghub = require('..');
var fs = require('fs');
var test = webtap(ghub);

test('deep url', 'GET /levelup/wiki/Modules', function (t, res) {
  t.equal(
    res.headers.location,
    'https://github.com/rvagg/node-levelup/wiki/Modules'
  );
  t.equal(res.statusCode, 302);
  t.body('-> https://github.com/rvagg/node-levelup/wiki/Modules');
});
