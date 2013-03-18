var GoogleAnalytics = require('ga');

var ga = new GoogleAnalytics('UA-39347178-1', 'ghub.io');

module.exports.request = request;
module.exports.error = error;

function request (req) {
  ga.trackPage(req.url);
}

function error (err, pkg) {
  console.error(err, pkg);
  ga.trackEvent({
    category : 'error',
    action : 'parse',
    label : pkg.repository
  });
}
