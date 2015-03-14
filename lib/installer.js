/**
* The Docvy Plugin Installer
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// built-in modules
var fs = require("fs");
var os = require("os");
var npm = require("npm");
var path = require("path");


// npm-installed modules
var lodash = require("lodash");
var ncp = require("ncp");
var rimraf = require("rimraf");
var utils = require("docvy-utils");


// own modules
var errors = require("./errors");


// module variables
var pluginsDir = utils.getPath("app.plugins");
var tmpDir = path.join(os.tmpdir(), "tmp_docvy_plugins");


/**
* Install plugins using NPM
*
* @param <packages> -- {String|Array} name of packages
* @param [callback] -- {Function} callback(err)
*/
exports.install = npmInstall;
exports.npmInstall = npmInstall;
function npmInstall(packages, callback) {
  callback = utils.defineCallback(callback);
  if (lodash.isString(packages)) { packages = [packages]; }
  npm.load({
    loglevel: "silent",
    prefix: tmpDir
  }, function(err) {
    if (err) { return callback(new errors.NpmLoadError(err)); }
    npm.commands.install(packages, function(err) {
      if (err) { return callback(new errors.NpmInstallError(err)); }
      // ensure pluginsDir exists
      fs.mkdir(pluginsDir, function() {
        ncp(tmpDir + "/node_modules/", pluginsDir, function(err) {
          if (err) {
            return callback(new errors.
              PluginsMoveFromTempError(err));
          }
          return callback(null);
        }); // ncp
      }); // fs.mkdir
    }); // npm.commands.install
  }); // npm.load
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
    if (err) { return callback(new errors.PluginsListingError(err)); }
    return callback(null, files);
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
