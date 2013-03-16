var RegClient = require('npm-registry-client');
var http = require('http');
var parse = require('github-url').toUrl;
var serve = require('ecstatic')(__dirname + '/static');
var url = require('url');
var track = require('./lib/track');

var client = new RegClient({
  registry : 'http://registry.npmjs.org/',
  cache : __dirname + '/cache'
});

module.exports = http.createServer(function (req, res) {
  if (static(req, res)) return;

  track.request(req);
  client.get(req.url, function (err, pkg) {
    var location = 'http://npmjs.org' + req.url;

    if (!err && pkg.repository) {
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
    res.end('');
  });
});

function static (req, res) {
  var pathname = url.parse(req.url).pathname;
  if (pathname == '/' || pathname == '/favicon.ico') {
    serve(req, res)
    return true;
  }
  return false;
}

