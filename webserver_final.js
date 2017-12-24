#!/usr/bin/env nodejs
var http = require("http");
var url = require("url");
var fs = require('fs');
var qs = require('querystring');


http.createServer(function (request, response) {
    console.log('Request Received');
    var pathname = url.parse(request.url).pathname;
    switch (pathname) {
      case '/':
      case '/index':
          fs.createReadStream('./index.html').pipe(response);
          break;
      default:
          var pathname = url.parse(request.url).pathname;
          fs.createReadStream('.' + pathname)
              .on("error", function (e) {
                  console.log("Error: %s", e);
              })
              .on("readable", function () {
                  this.pipe(response);
              });
          break;
    }
    console.log(request.url);
}).listen(8075, '0.0.0.0', function () {
    console.log('HTTP Listening at http://%s:%s', this.address().address, this.address().port);
});
