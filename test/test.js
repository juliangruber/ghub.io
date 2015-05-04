var webtap = require('webtap');
var ghub = require('..');
var fs = require('fs');

var test = webtap(ghub);

var usage = fs.readFileSync(__dirname + '/../static/index.html').toString();

test('valid package', 'GET /review', function (t, res) {
  t.equal(res.headers.location, 'https://github.com/juliangruber/review');
  t.equal(res.statusCode, 302);
  t.body('-> https://github.com/juliangruber/review');
});

test('valid package', 'HEAD /review', function (t, res) {
  t.equal(res.headers.location, 'https://github.com/juliangruber/review');
  t.equal(res.statusCode, 302);
  t.body('');
});

test('not found', 'GET /sdf098sdf098', function (t, res) {
  t.equal(res.headers.location, 'https://www.npmjs.com/package/sdf098sdf098');
  t.equal(res.statusCode, 302);
  t.body('-> https://www.npmjs.com/package/sdf098sdf098');
});

test('with repository', 'GET /jsonp', function (t, res) {
  t.equal(res.headers.location, 'https://github.com/LearnBoost/jsonp');
  t.equal(res.statusCode, 302);
  t.body('-> https://github.com/LearnBoost/jsonp');
});

test('shorthand repository syntax', 'GET /binomial-cdf', function (t, res) {
  t.equal(res.headers.location, 'https://github.com/kenany/binomial-cdf');
  t.equal(res.statusCode, 302);
  t.body('-> https://github.com/kenany/binomial-cdf');
});

test('bitbucket', 'GET /program', function (t, res) {
  t.equal(res.headers.location, 'https://www.npmjs.com/package/program');
  t.equal(res.statusCode, 302);
  t.body('-> https://www.npmjs.com/package/program');
});

test('homepage', 'GET /ihaveahomepage', function (t, res) {
  t.equal(res.headers.location, 'https://github.com/juliangruber/ghub.io');
  t.equal(res.statusCode, 302);
  t.body('-> https://github.com/juliangruber/ghub.io');
});

test('GET /', function (t, res) {
  t.equal(res.headers['content-type'], 'text/html; charset=UTF-8');
  t.equal(res.statusCode, 200);
  t.body(usage);
});

test('GET /robots.txt', function (t, res) {
  t.equal(res.statusCode, 404);
  t.body('File not found. :(');
});

test('GET /favicon.ico', function (t, res) {
  t.equal(res.statusCode, 404);
  t.body('File not found. :(');
});
