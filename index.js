var RegClient = require('npm-registry-client');
var http = require('http');
var parse = require('github-url').toUrl;
var serve = require('ecstatic')(__dirname + '/static');
var url = require('url');
var track = require('./lib/track');

var client = new RegClient({
  registry : 'http://registry.npmjs.org/',
  cache : __dirname + '/cache',
  log : { error: noop, warn: noop, info: noop,
    verbose: noop, silly: noop, http: noop,
    pause: noop, resume: noop }
});

function noop () {}

module.exports = http.createServer(function (req, res) {
  if (static(req, res)) return;

  track.request(req);
  client.get(req.url, function (err, pkg) {
    var location = 'http://npmjs.org' + req.url;

    var repoUrl

    if (pkg.repository) {
      repoUrl = typeof pkg.repository == 'string'
        ? pkg.repository
        : pkg.repository.url
    }

    var validRepo = repoUrl && repoUrl.length
      && repoUrl.indexOf('github') > -1;

    if (!err && validRepo) {
      repo = parse(pkg.repository);
      if (!repo) {
        console.error('couldn\'t parse repo: ' + pkg.repository);
        track.error(pkg);
      } else {
        location = repo;
      }
    }

    res.statusCode = 302;
    res.setHeader('location', location);
    if (req.method == 'HEAD') res.end('')
    else res.end('-> ' + location);
  });
});

function static (req, res) {
  var pathname = url.parse(req.url).pathname;
  if (['/', '/favicon.ico', '/robots.txt'].indexOf(pathname) >= 0) {
    serve(req, res);
    return true;
  }
  return false;
}

