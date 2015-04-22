/**
* Tests against the Docvy Plugin Installer Core
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


// built-in modules
var fs = require("fs");


// npm-installed modules
var Jayschema = require("jayschema");
var should = require("should");


// own modules
var errors = require("../lib/errors");
var installer = require("../lib/installer");


// module variables
var testPkgName = "utils";
var testPackage = "docvy/" + testPkgName + "#develop";
var nonExistingPlugin = "docvy/non-existing-plugin";
var npmInstallTimeout = 0;
var schemaFetchTimeout = 0;
var validator = new Jayschema(Jayschema.loaders.http);
var pluginListSchema = {
  "$schema": "http://json-schema.org/schema#",
  "type": "array",
  "items": {
    "$ref": "https://raw.githubusercontent.com/docvy/server/develop/schemas/plugin-descriptor.json#"
  }
};


// clean-up
after(function(done) {
  installer.uninstall(testPackage, function(err) {
    should(err).not.be.ok;
    done();
  });
});


describe("installer module", function() { });


describe("installer.install", function() {

  it("is same as installer.npmInstall", function() {
    should(installer.install).eql(installer.npmInstall);
  });

});


describe("installer.npmInstall", function() {
  this.timeout(npmInstallTimeout);

  beforeEach(function(done) {
    installer.uninstall(testPackage, function(err) {
      should(err).not.be.ok;
      done();
    });
  });

  it("allows a string", function(done) {
    installer.npmInstall(testPackage, function(err) {
      should(err).not.be.ok;
      done();
    });
  });

  it("allows an array of string(s)", function(done) {
    installer.npmInstall([testPackage], function(err) {
      should(err).not.be.ok;
      done();
    });
  });

  it("installs plugin", function(done) {
    installer.npmInstall([testPackage], function(err) {
      should(err).not.be.ok;
      installer.listPlugins(function(err, plugins) {
        should(err).not.be.ok;
        should(plugins).containEql(testPkgName);
        done();
      });
    });
  });

  it("passes NpmInstallError if package is not found",
  function(done) {
    installer.npmInstall(nonExistingPlugin, function(err) {
      should(err).be.ok.and.instanceOf(errors.NpmInstallError);
      done();
    });
  });

});


describe("installer.list", function() {
  this.timeout(schemaFetchTimeout);

  it("passes an array of all installed plugins", function(done) {
    installer.listPlugins(function(err, plugins) {
      should(err).not.be.ok;
      should(plugins).be.an.Array;
      done();
    });
  });

  it("passes an array of plugin descriptors", function(done) {
    installer.listPlugins(function(err, plugins) {
      should(err).not.be.ok;
      validator.validate(plugins, pluginListSchema,
      function(errs) {
        should(errs).not.be.ok;
        done();
      });
    });
  });

});


describe("installer.uninstall", function() {
  this.timeout(npmInstallTimeout);

  beforeEach(function(done) {
    installer.npmInstall(testPackage, function(err) {
      should(err).not.be.ok;
      done();
    });
  });

  it("allows a string", function(done) {
    installer.uninstall(testPackage, function(err) {
      should(err).not.be.ok;
      done();
    });
  });

  it("allows an array of string(s)"), function(done) {
    installer.uninstall([testPackage], function(err) {
      should(err).not.be.ok;
      done();
    });
  };

  it("removes plugins", function(done) {
    installer.uninstall(testPackage, function(err) {
      should(err).not.be.ok;
      installer.listPlugins(function(err, plugins) {
        should(err).not.be.ok;
        should(plugins).be.an.Array.and.not.containEql(testPackage);
        done();
      });
    });
  });

  it("ignores error if plugin is not installed", function(done) {
    installer.uninstall(nonExistingPlugin, function(err) {
      should(err).not.be.ok;
      done();
    });
  });

});
