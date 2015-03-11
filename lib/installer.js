/**
* The Docvy Plugin Installer
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// built-in modules
var fs = require("fs");
var os = require("os");
var path = require("path");


// npm-installed modules
var lodash = require("lodash");
var ncp = require("ncp");
var rimraf = require("rimraf");
var shelljs = require("shelljs");
var utils = require("docvy-utils");


// module variables
var pluginsDir = utils.getPath("app.plugins");
var tmpDir = path.join(os.tmpdir(), "tmp_plugins");


/**
* Install plugins using NPM
*
* @param <packageNames> -- {String|Array} string rep. name of
* pkg
* @param [callback] -- {Function} callback(err)
*/
exports.install = npmInstall;
exports.npmInstall = npmInstall;
function npmInstall(names, callback) {
  callback = utils.defineCallback(callback);
  if (lodash.isString(names)) { names = [names]; }
  var logs = [];
  var numPkgs = 0;
  fs.mkdir(tmpDir, function() {
    for (var index in names) {
      shelljs.exec("npm install " + names[index] +
        " --prefix " + tmpDir, { silent: true }, cb);
    }
  });

  function cb(code, output) {
    if (code !== 0) { logs.push(output); }
    if (++numPkgs === names.length) {
      fs.rmdir(tmpDir + "/.bin", function() { });
      ncp(tmpDir + "/node_modules/", pluginsDir, function(err) {
        if (err) { logs.push(err); }
        shelljs.rm("-r", tmpDir);
        return callback(logs.length === 0 ? null : logs);
      });
    }
  }
}


/**
* Listing installed plugins
*
* @param [callback] -- {Function} callback(err, plugins)
*/
exports.listPlugins = listPlugins;
function listPlugins(callback) {
  callback = utils.defineCallback(callback);
  fs.readdir(pluginsDir, function(err, files) {
    return callback(err, files);
  });
}


/**
* Uninstall plugin(s)
*
* @param <names> -- {String|Array} name of plugin(s)
* @param [callback] -- {Function} callback(err)
*/
exports.uninstall = uninstall;
function uninstall(names, callback) {
  callback = utils.defineCallback(callback);
  if (lodash.isString(names)) { names = [names]; }
  var errs = [];
  var numPlugins = 0;
  for (var index in names) {
    rimraf(pluginsDir + "/" + names[index], cb);
  }

  function cb(err) {
    if (err) { errs.push(err); }
    if (++numPlugins === names.length) {
      return callback(errs.length === 0 ? null : errs);
    }
  }
}
