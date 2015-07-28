/**
* The Docvy Plugin Installer CLI
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// npm-installed modules
var program = require("simple-argparse");
var out = require("cli-output");


// own modules
var installer = require("./installer");
var pkg = require("../package.json");


// interface definition
program
  .description("docvy-plugins", "The Docvy Plugin Installer")
  .version(pkg.version)
  .epilog("See https://github.com/docvy/plugin-installer for feature-requests and bug-reports")
  .option("list", "list installed plugins", list)
  .option("install <plugin>", "install <plugin>", npmInstall)
  .option("npm-install <plugin>", "install <plugin> from NPM", npmInstall)
  .option("dir-install <dirpath>", "install plugin from <dirpath>", dirInstall)
  .option("uninstall <plugin>", "uninstall <plugin>", uninstall)
  .parse();


// listing installed plugins
function list() {
  return installer.listPlugins(function(listErr, plugins) {
    if (listErr) {
      return out.error("error listing installed plugins: %s", listErr);
    }
    if (plugins.length === 0) {
      return out.success("no plugins found");
    }
    var string = "";
    for (var idx = 0; idx < plugins.length; idx++) {
      string += "  " + (idx + 1) + ".  " + plugins[idx].name +
        " - " + plugins[idx].description + "\n";
    }
    return out.success("installed plugins:\n%s", string);
  });
}


// installing plugins
function npmInstall() {
  return installer.install(Array.prototype.slice.call(arguments), function(errs) {
    if (errs) {
      return out.error("error installing plugins: %j", errs);
    }
    return out.success("plugins installed");
  });
}


function dirInstall (dirpath) {
  return installer.dirInstall(dirpath, function(err) {
    if (err) {
      return out.error("error installing plugin: %j", err);
    }
    return out.success("plugin installed");
  });
}


// uninstalling plugins
function uninstall() {
  installer.uninstall(Array.prototype.slice.call(arguments), function(errs) {
    if (errs) {
      return out.error("error uninstalling plugins: %j", errs);
    }
    return out.success("plugins uninstalled");
  });
}
