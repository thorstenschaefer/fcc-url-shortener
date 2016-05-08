var express = require('express');

var app = express();

var urlMapping = [];

// binding for new urls
app.get("/new/:targetUrl", function(req, res) {
  var targetUrl = req.params.targetUrl;
  console.log("Request for new URL: " + targetUrl);
  if (isValidUrl(targetUrl)) {
    // We could possibly search if the target URL is already contained
    // in the array and if so use the existing number. We don't do it here,
    // because we should use a different data structure to avoid O(n) search.
    
    console.log("Target URL is valid");
    var number = urlMapping.push(targetUrl);
    res.json( { 
      "original_url": targetUrl, 
      "short_url" : req.protocol + '://' + req.get('host') + "/" + number });
  } else {
    console.log("Target URL is invalid");
    res.send("The URL " + targetUrl + " is not in a recognized format.");
  }
});

// binding for short urls
app.get("/:shortUrl", function(req, res) {
  var shortUrl = req.params.shortUrl;
  console.log("Requesting short URL: " + shortUrl);

  if (shortUrl.match(/^\d+$/) != null) {
    console.log("Short url only has numbers");
    var index = +shortUrl - 1;
    if (index < 0 || index >= urlMapping.length) {
      res.send("Short URL " + shortUrl + " not in index");
      return;
    }
    
    // valid shortened URL
    var target = urlMapping[index];
    res.redirect(target);
    return;
  } else {
    res.send("Invalid short URL: " + shortUrl);
  }
});


var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log('Node.js listening on port ' + port + '...');
});

function isValidUrl(str) {
  var pattern = /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/;
  return pattern.test(str);
}