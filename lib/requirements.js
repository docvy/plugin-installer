/**
* The Docvy Plugin Requirements checker
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// npm-installed modules
var shelljs = require("shelljs");


// own modules
var config = require("./config.json");


/**
* Checks if all requirements have been installed
*
* @return {Array}
*/
exports.missingReqs = missingReqs;
function missingReqs() {
  var mReqs = [];
  config.requirements.forEach(function(req) {
    var found = shelljs.which(req);
    if (! found) { mReqs.push(req); }
  });
  return mReqs;
}
