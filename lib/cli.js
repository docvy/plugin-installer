/**
* The Docvy Plugin Installer CLI
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// npm-installed modules
var program = require("commander");


// interface definition
program
  .version(require("../package.json").version)
  .option("-l, --list", "list installed plugins")
  .option("-i, --install <plugin>", "install <plugin>")
  .option("-u, --uninstall <plugin>", "uninstall <plugin>")
  .parse(process.argv);
