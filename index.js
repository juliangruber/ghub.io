var http = require('http');
var parse = require('github-url').toUrl;
var serve = require('ecstatic')(__dirname + '/static');
var url = require('url');
var track = require('./lib/track');
var os = require('os');
var level = require('level');
var sub = require('level-sublevel');
var predirect = require('predirect');
var couchSync = require('level-couch-sync');

var db = sub(level(__dirname + '/db'));
var meta = db.sublevel('meta');
var repoUrls = db.sublevel('repo-urls');
var registry = 'http://isaacs.iriscouch.com/registry';
var sync = couchSync(registry, db, meta, function (data, emit) {
  var pkg = data.doc;
  var repoUrl = validUrl(pkg.repository)
    || validUrl(
        pkg.repository && pkg.repository.url
      )
    || validUrl(
        pkg.versions && Object.keys(pkg.versions).length
        && pkg.versions[Object.keys(pkg.versions).pop()].homepage
      );
  if (repoUrl) emit(pkg.name, repoUrl, repoUrls);
});

sync.on('progress', function (ratio) {
  console.log(Math.floor(ratio*10000)/100 + '%');
});

module.exports = http.createServer(function (req, res) {
  if (static(req, res)) return;
  track.request(req);

  var urlParts = req.url.match(/\/([^\/]+)(.*)/);
  var name = urlParts
    ? urlParts[1]
    : req.url;
  var redirect = predirect(req, res);

  repoUrls.get(name, function (err, url) {
    if (err) {
      if (err.name != 'NotFoundError') track.error(err);
      redirect('http://npmjs.org/' + name);
      return;
    }

    if (urlParts) url += urlParts[2];
    redirect(url);
  });
});

function validUrl (url) {
  return typeof url == 'string' && url.length && url.indexOf('github') > -1
    ? url
    : false;
}

function static (req, res) {
  var pathname = url.parse(req.url).pathname;
  if (['/', '/favicon.ico', '/robots.txt'].indexOf(pathname) >= 0) {
    serve(req, res);
    return true;
  }
  return false;
}

