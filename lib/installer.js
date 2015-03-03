/**
* The Docvy Plugin Installer
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// npm-installed modules
var lodash = require("lodash");
var shelljs = require("shelljs");


// module variables
var pluginsDir = process.env.HOME + "/.docvy/plugins";


/**
* Install plugins using NPM
*
* @param <packageNames> -- {String|Array} string rep. name of
* pkg
* @param <callback> -- {Function} callback(err)
*/
exports.npmInstall = npmInstall;
function npmInstall(names, callback) {
  if (lodash.isString(names)) { names = [names]; }
  callback = callback || function() { };
  var logs = [];
  var numPkgs = 0;
  function cb(code, output) {
    if (code !== 0) { logs.push(output); }
    if (++numPkgs === names.length) {
      shelljs.mv(__dirname + "/tmp_plugins/*", pluginsDir);
      shelljs.rm("-r", "tmp_plugins");
      return callback(logs);
    }
  }
  for (var index in names) {
    shelljs.exec("npm install " + names[index] +
      "--prefix tmp_plugins", { silent: true }, cb);
  }
}
