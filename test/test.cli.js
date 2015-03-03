/**
* Tests against the Docvy Plugin Installer CLI
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// npm-installed modules
var shelljs = require("shelljs");
var should = require("should");


describe("-V, --version", function() {

  it("retrieves version info from package.json", function() {
    var cmd = shelljs.exec("./bin/docvy-plugins -V", { silent: true });
    cmd.code.should.eql(0);
    cmd.output.should.containEql(require("../package.json").version);
  });

});
