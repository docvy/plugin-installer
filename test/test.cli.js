/**
* Tests against the Docvy Plugin Installer CLI
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// built-in modules
var path = require("path");


// npm-installed modules
var shelljs = require("shelljs");
var should = require("should");


// module variables
var script = path.join(__dirname, "/../bin/docvy-plugins ");


describe("version", function() {
  it("retrieves version info from package.json", function() {
    var cmd = shelljs.exec(script + "version", { silent: true });
    cmd.code.should.eql(0);
    should(cmd.output).containEql(require("../package.json").version);
  });
});
