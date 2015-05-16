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
      ncp(tmpDir + "/node_modules/", pluginsDir, function(err) {
        if (err) {
          return callback(new errors.
            PluginsMoveFromTempError(err));
        }
        return callback(null);
      }); // ncp
    }); // npm.commands.install
  }); // npm.load
}


/**
* Install plugins from Directory
*
* @param <dirpath> -- {String} path to directory
* @param <callback> -- {Function} callback(err)
*/
exports.dirInstall = dirInstall;
function dirInstall(dirpath, callback) {
  callback = utils.defineCallback(callback);
  fs.exists(dirpath, function(exists) {
    if (! exists) {
      return callback(new errors.DirectoryNotExistingError());
    }
    var pluginName = path.basename(dirpath);
    var destPath = path.join(pluginsDir, pluginName);
    ncp(dirpath, destPath, function(err) {
      if (err) {
        return callback(new errors.PluginsMoveFromTempError(err));
      }
      return callback(null);
    });
  });
}


/**
* Listing installed plugins
*
* @param [callback] -- {Function} callback(err, descriptors)
*/
exports.listPlugins = listPlugins;
function listPlugins(callback) {
  callback = utils.defineCallback(callback);
  fs.readdir(pluginsDir, function(err, files) {
    if (err) { return callback(new errors.PluginsListingError(err)); }
    var fullpath, pkg;
    var descriptors = [];
    for (var index in files) {
      fullpath = path.join(pluginsDir, files[index], "package.json");
      try {
        pkg = require(fullpath);
        descriptors.push({
          name: pkg.name,
          version: pkg.version || "",
          description: pkg.description || "",
          author: pkg.author || "",
          icon: pkg.icon || "",
          homepage: pkg.homepage || ""
        });
      } catch (err) {
        /*
        * we shall ignore this error and only list those plugins
        * we can load
        */
      }
    }
    return callback(null, descriptors);
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
