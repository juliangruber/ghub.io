var http = require('http');
var tap = require('tap');
var ghub = require('..');
var fs = require('fs');

var usage = fs.readFileSync(__dirname + '/../static/index.html').toString();

test('GET /<valid-package>', function (t) {
  t.req('GET', '/review', function (res) {
    t.equal(res.headers.location, 'https://github.com/juliangruber/review');
    t.equal(res.statusCode, 302);
    t.body('-> https://github.com/juliangruber/review');
  });
});

test('HEAD /<valid-package>', function (t) {
  t.req('HEAD', '/review', function (res) {
    t.equal(res.headers.location, 'https://github.com/juliangruber/review');
    t.equal(res.statusCode, 302);
    t.body('');
  });
});

test('GET /<package-not-found>', function (t) {
  t.req('GET', '/sdf098sdf098', function (res) {
    t.equal(res.headers.location, 'http://npmjs.org/sdf098sdf098');
    t.equal(res.statusCode, 302);
    t.body('-> http://npmjs.org/sdf098sdf098');
  });
});

test('GET /<package-without-repository>', function (t) {
  t.req('GET', '/mysql', function (res) {
    t.equal(res.headers.location, 'http://npmjs.org/mysql');
    t.equal(res.statusCode, 302);
    t.body('-> http://npmjs.org/mysql');
  });
});

test('GET /', function (t) {
  t.req('GET', '/', function (res) {
    t.equal(res.headers['content-type'], 'text/html; charset=UTF-8');
    t.equal(res.statusCode, 200);
    t.body(usage);
  });
});

test('GET /robots.txt', function (t) {
  t.req('GET', '/robots.txt', function (res) {
    t.equal(res.statusCode, 404);
    t.body('File not found. :(');
  })
});

test('GET /favicon.ico', function (t) {
  t.req('GET', '/favicon.ico', function (res) {
    t.equal(res.statusCode, 404);
    t.body('File not found. :(');
  })
});

function test (name, cb) {
  tap.test(name, function (t) {
    t.req = req;
    ghub.listen(cb.bind(null, t));

    function req (method, path, cb) {
      var opts = {
        hostname : 'localhost',
        port : ghub.address().port,
        path : path,
        method : method
      }
      var req = http.request(opts, function (res) {
        t.body = body;
        cb(res);

        function body (str) {
          var data = '';
          res.on('data', function (d) { data += d });
          res.on('end', function () {
            t.equal(data, str);
            ghub.close(t.end.bind(t));
          });
        }
      })
      req.on('error', t.notOk.bind(t));
      req.end();
    }
  });
}
