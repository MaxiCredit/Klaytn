const http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var StringDecoder = require('string_decoder').StringDecoder;
var register = require('./register-new-user');
var offer = require('./credit-offer');
var claim = require('./credit-claim');
var acceptOffer = require('./accept-offer');
var acceptClaim = require('./accept-claim');

const server = http.createServer((req, res) => {
  var q = url.parse(req.url, true);
  var filename = '.' + q.pathname;
  //var objectname = q.pathname.slice(1);
  var queryStringObject = q.query;
  var extension = filename.slice(filename.lastIndexOf(".") + 1);
  var content = "";

  switch (extension) {
    case "html":
      content = "text/html";
      break;
    case "css":
      content = "text/css";
      break;
    case "png":
      content = "image/png";
      break;
    case "jpg":
      content = "image/jpg";
      break;
    case "jpeg":
      content = "image/jpeg";
      break;
    case "json":
      content = "application/javascript";
      break;
    case "js":
      content = "application/javascript";
      break;
    case "woff":
      content = "application/x-font-woff";
      break;
    case "mp4":
      content = "video/mp4";
      break;
    case "pdf":
      content = "application/pdf";
      break;
    case "txt":
      content = "text/plain";
      break;
  }

  if(req.method === 'POST') {
	switch (filename) {
		case "./register" : 
			register.registerNewUser(req, res);
			break;
		case './create-credit-offer':
			offer.newOffer(req, res);
			break;
		case './create-credit-claim':
			claim.newClaim(req, res);
			break;
		case './accept-offer':
			acceptOffer.acceptCreditOffer(req, res);
			break;
		case './accept-claim':
			acceptClaim.acceptCreditClaim(req, res);
			break;
	}
    } else {
        fs.readFile(filename, function(err, data) {
    		if(err) {
      			res.writeHead(404, {"Content-Type": content});
      			res.end("404 Not found");
    		} else {
			  res.writeHead(200, {"Content-Type": content});
			  res.write(data);
			  res.end();
    		}
  	});
    }
});
server.listen(3000);

