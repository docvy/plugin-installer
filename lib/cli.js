/**
* The Docvy Plugin Installer CLI
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// npm-installed modules
var cli = require("commander");
var logger = require("custom-logger").config({
  format: "[%event%]%padding%%message%"
});


// own modules
var installer = require("./installer");


// interface definition
cli
  .version(require("../package.json").version)
  .option("-l, --list", "list installed plugins")
  .option("-i, --install <plugin>", "install <plugin>")
  .option("--npm-install <plugin>", "install <plugin> from NPM")
  .option("--dir-install <dirpath>", "install plugin from <dirpath>")
  .option("-u, --uninstall <plugin>", "uninstall <plugin>")
  .parse(process.argv);


// listing installed plugins
if (cli.list) {
  installer.listPlugins(function(err, plugins) {
    if (err) {
      return logger.error("error listing installed plugins: %s", err);
    }
    var string = "";
    for (var idx = 0; idx < plugins.length; idx++) {
      string += "  " + (idx + 1) + ".  " + plugins[idx].name +
        " - " + plugins[idx].description + "\n";
    }
    logger.info("installed plugins:\n%s", string);
  });
}


// installing plugins
if (cli.install || cli.npmInstall) {
  installer.install(cli.install || cli.npmInstall, function(errs) {
    if (errs) {
      return logger.error("error installing plugins: %j", errs);
    }
    logger.info("plugins installed");
  });
}


if (cli.dirInstall) {
  installer.dirInstall(cli.dirInstall, function(err) {
    if (err) {
      return logger.error("error installing plugin: %j", err);
    }
    logger.info("plugin installed");
  });
}


// uninstalling plugins
if (cli.uninstall) {
  installer.uninstall(cli.uninstall, function(errs) {
    if (errs) {
      return logger.error("error uninstalling plugins: %j", errs);
    }
    logger.info("plugins uninstalled");
  });
}
