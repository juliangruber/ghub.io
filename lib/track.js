var GoogleAnalytics = require('ga');

var ga = process.env.ga
  ? new GoogleAnalytics(process.env.ga, 'ghub.io')
  : false

module.exports.request = request;
module.exports.error = error;

function request (req) {
  if (ga) ga.trackPage(req.url);
}

function error (pkg) {
  if (ga) ga.trackEvent({
    category : 'error',
    action : 'parse',
    label : pkg.repository
  });
}
