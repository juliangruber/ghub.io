var RegClient = require('npm-registry-client');
var http = require('http');
var parse = require('github-url').toUrl;
var serve = require('ecstatic')(__dirname + '/static');

var client = new RegClient({
  registry : 'http://registry.npmjs.org/',
  cache : __dirname + '/cache'
});

var server = http.createServer(function (req, res) {
  var match = req.url.match(/^\/[a-zA-Z-]+(\/?)$/);
  if (!match) return serve(req, res);

  client.get('/' + match[1], function (err, pkg) {
    var location = 'http://npmjs.org' + req.url;

    if (!err && pkg.repository) {
      repo = parse(pkg.repository);
      if (!repo) console.error('couldn\'t parse repo: ' + pkg.repository);
      else location = repo;
    }

    res.statusCode = 302;
    res.setHeader('location', location);
    res.end('');
  });
});

var port = Number(process.argv[2]) || 7000;
server.listen(port, function () {
  console.log('server listening on port ' + port);
});
