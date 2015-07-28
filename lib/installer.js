/**
* The Docvy Plugin Installer
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


exports = module.exports = {
    dirInstall: dirInstall,
    install: npmInstall,
    listPlugins: listPlugins,
    npmInstall: npmInstall,
    uninstall: uninstall,
};


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
 * @param  {String|String[]} packages - name of packages
 * @param  {Function} [callback]
 */
function npmInstall(packages, callback) {
  callback = utils.defineCallback(callback);
  if (lodash.isString(packages)) {
    packages = [packages];
  }
  return npm.load({
    loglevel: "silent",
    prefix: tmpDir,
  }, function(loadErr) {
    if (loadErr) {
      return callback(new errors.NpmLoadError(loadErr));
    }
    npm.commands.install(packages, function(installErr) {
      if (installErr) {
        return callback(new errors.NpmInstallError(installErr));
      }
      ncp(tmpDir + "/node_modules/", pluginsDir, function(copyError) {
        if (copyError) {
          return callback(new errors.PluginsMoveFromTempError(copyError));
        }
        return callback(null);
      }); // ncp
    }); // npm.commands.install
  }); // npm.load
}


/**
 * Install plugins from Directory
 *
 * @param  {String} dirpath - path to directory
 * @param  {Function} [callback]
 */
function dirInstall(dirpath, callback) {
  callback = utils.defineCallback(callback);
  return fs.exists(dirpath, function(exists) {
    if (!exists) {
      return callback(new errors.DirectoryNotExistingError());
    }
    var pluginName = path.basename(dirpath);
    var destPath = path.join(pluginsDir, pluginName);
    return ncp(dirpath, destPath, function(copyError) {
      if (copyError) {
        return callback(new errors.PluginsMoveFromTempError(copyError));
      }
      return callback(null);
    });
  });
}


/**
 * Listing installed plugins
 *
 * @param {Function} [callback] - callback(err, descriptors)
 */
function listPlugins(callback) {
  callback = utils.defineCallback(callback);
  return fs.readdir(pluginsDir, function(readdirErr, files) {
    if (readdirErr) {
      return callback(new errors.PluginsListingError(readdirErr));
    }
    var fullpath, pkg;
    var descriptors = [ ];
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
          homepage: pkg.homepage || "",
        });
    } catch (requireErr) {
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
 * @param  {String|String[]} names - name of plugin(s)
 * @param  {Function} [callback]
 */
function uninstall(names, callback) {
  callback = utils.defineCallback(callback);
  if (lodash.isString(names)) {
    names = [names];
  }
  var errs = [ ];
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
