var http = require('http');
var tap = require('tap');
var ghub = require('..');
var fs = require('fs');

var usage = fs.readFileSync(__dirname + '/../static/index.html').toString();

test('redirect', function (t, get) {
  get('/review', function (res, body) {
    t.equal(res.headers.location, 'https://github.com/juliangruber/review');
    t.equal(res.statusCode, 302);
    body('');
  });
});

test('package not found', function (t, get) {
  get('/sdf098sdf098', function (res, body) {
    t.equal(res.headers.location, 'http://npmjs.org/sdf098sdf098');
    t.equal(res.statusCode, 302);
    body('');
  });
});

test('static', function (t, get) {
  get('/', function (res, body) {
    t.equal(res.headers['content-type'], 'text/html; charset=UTF-8');
    t.equal(res.statusCode, 200);
    body(usage);
  });
});

function test (name, cb) {
  tap.test(name, function (t) {
    ghub.listen(cb.bind(null, t, get));

    function get (url, cb) {
      url = 'http://localhost:' + ghub.address().port + url;
      http.get(url, function (res) {
        cb(res, body);

        function body (str) {
          var data = '';
          res.on('data', function (d) { data += d });
          res.on('end', function () {
            t.equal(data, str);
            ghub.close(t.end.bind(t));
          });
        }
      }).on('error', t.notOk.bind(t));
    }
  });
}
