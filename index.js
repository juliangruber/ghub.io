var RegClient = require('npm-registry-client');
var http = require('http');
var parse = require('github-url').toUrl;
var serve = require('ecstatic')(__dirname + '/static');
var url = require('url');
var track = require('./lib/track');
var os = require('os');

var client = new RegClient({
  registry : 'http://registry.npmjs.org/',
  cache : os.tmpDir() + '/ghub.io-cache',
  log : { error: noop, warn: noop, info: noop,
    verbose: noop, silly: noop, http: noop,
    pause: noop, resume: noop }
});

function noop () {}

module.exports = http.createServer(function (req, res) {
  if (static(req, res)) return;

  track.request(req);

  var urlParts = req.url.match(/\/([^\/]+)(.*)/);
  client.get(urlParts ? urlParts[1] : req.url, function (err, pkg) {
    var location = 'http://npmjs.org' + req.url;

    var repoUrl = validUrl(pkg.repository)
      || validUrl(pkg.repository && pkg.repository.url)
      || validUrl(pkg.versions && pkg.versions[Object.keys(pkg.versions).pop()].homepage);

    if (!err && repoUrl) {
      var repo;

      try { repo = parse(repoUrl) }
      catch (err) { track.error(err, pkg) }

      if (!repo) {
        track.error('empty', pkg);
      } else {
        location = repo.replace(/\.git$/, '');
        if (urlParts) {
          location += urlParts[2];
        }
      }
    }

    res.statusCode = 302;
    res.setHeader('location', location);
    if (req.method == 'HEAD') res.end('')
    else res.end('-> ' + location);
  });
});

function validUrl (url) {
  return typeof url == 'string' && url.length && url.indexOf('github') > -1
    ? url
    : false
}

function static (req, res) {
  var pathname = url.parse(req.url).pathname;
  if (['/', '/favicon.ico', '/robots.txt'].indexOf(pathname) >= 0) {
    serve(req, res);
    return true;
  }
  return false;
}

