/**
* Error definitions
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// npm-installed modules
var utils = require("docvy-utils");


// error definitions
exports = module.exports = {
  DirectoryNotExistingError: utils.defineError("EPLGINSTENOT", "Directory does NOT exist"),
  NpmInstallError: utils.defineError("EPLGINSTNPMINST", "Error occurred while installing package(s)"),
  NpmLoadError: utils.defineError("EPLGINSTNPMLOAD", "Error occurred while loading npm before installing package(s)"),
  PluginsListingError: utils.defineError("EPLGINSTLIST", "Error occured listing plugins in plugins directory"),
  PluginsMoveFromTempError: utils.defineError("EPLGINSTMOVE", "Error occurred while moving plugins from temporary directory into the application's plugins directory"),
};
