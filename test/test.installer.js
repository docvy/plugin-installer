/**
* Tests against the Docvy Plugin Installer Core
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


"use strict";


// built-in modules
var fs = require("fs");
var path = require("path");


// npm-installed modules
var Jayschema = require("jayschema");
var should = require("should");
var utils = require("docvy-utils");


// own modules
var errors = require("../lib/errors");
var installer = require("../lib/installer");


// module variables
var testPkgName = "docvy-utils";
var testPackage = "docvy/utils#develop";
var nonExistingPlugin = "docvy/non-existing-plugin";
var npmInstallTimeout = 1000 * 60; // 1 minute
var schemaFetchTimeout = 0;
var validator = new Jayschema(Jayschema.loaders.http);
var pluginListSchema = {
  "$schema": "http://json-schema.org/schema#",
  "type": "array",
  "items": {
    "$ref": "https://raw.githubusercontent.com/docvy/server/develop/schemas/plugin-descriptor.json#",
  },
};


// clean-up
after(function(done) {
  installer.uninstall(testPackage, function(err) {
    should(err).not.be.ok();
    done();
  });
});


describe("installer module", function() { });


/**
 * installer.install *****************************
 */
describe("installer.install", function() {

  it("is same as installer.npmInstall", function() {
    should(installer.install).eql(installer.npmInstall);
  });

});


/**
 * installer.npmInstall **************************
 */
describe("installer.npmInstall", function() {
  this.timeout(npmInstallTimeout);

  beforeEach(function(done) {
    installer.uninstall(testPackage, function(err) {
      should(err).not.be.ok();
      done();
    });
  });

  it("allows a string", function(done) {
    installer.npmInstall(testPackage, function(err) {
      should(err).not.be.ok();
      done();
    });
  });

  it("allows an array of string(s)", function(done) {
    installer.npmInstall([testPackage], function(err) {
      should(err).not.be.ok();
      done();
    });
  });

  it("installs plugin", function(done) {
    installer.npmInstall([testPackage], function(err) {
      should(err).not.be.ok();
      installer.listPlugins(function(listErr, plugins) {
        should(listErr).not.be.ok();
        var found = false;
        for (var index in plugins) {
          if (plugins[index].name === testPkgName) {
            found = true;
          }
        }
        should(found).be.ok();
        done();
      });
    });
  });

  it("passes NpmInstallError if package is not found",
  function(done) {
    installer.npmInstall(nonExistingPlugin, function(err) {
      should(err).be.ok().and.instanceOf(errors.NpmInstallError);
      done();
    });
  });

});


/**
 * installer.dirInstall **************************
 */
describe("installer.dirInstall", function() {
  var testPluginPath = path.join(__dirname, "/mock/testPluginInstaller");
  var destPath = utils.getPath("app.plugins") + "/testPluginInstaller";

  before(function() {
    try {
      fs.rmdirSync(destPath);
    } catch(err) {
      /** */
    }
  });

  it("installs from a directory", function(done) {
    installer.dirInstall(testPluginPath, function(err) {
      should(err).not.be.ok();
      should(fs.existsSync(destPath)).be.ok();
      done();
    });
  });

  it("errors if directory is missing", function(done) {
    installer.dirInstall(path.join(__dirname, "NotExisting"), function(err) {
      should(err).be.an.instanceOf(errors.DirectoryNotExistingError);
      done();
    });
  });

});


/**
* installer.list ********************************
*/
describe("installer.list", function() {
  this.timeout(schemaFetchTimeout);

  it("passes an array of all installed plugins", function(done) {
    installer.listPlugins(function(err, plugins) {
      should(err).not.be.ok();
      should(plugins).be.an.Array();
      done();
    });
  });

  it("passes an array of plugin descriptors", function(done) {
    installer.listPlugins(function(err, plugins) {
      should(err).not.be.ok();
      validator.validate(plugins, pluginListSchema,
      function(errs) {
        should(errs).not.be.ok();
        done();
      });
    });
  });

  it("ignores plugins whose info could not be loaded", function(done) {
    var pluginPath = path.join(__dirname, "/mock/testPluginInstaller");
    installer.dirInstall(pluginPath, function(err) {
      should(err).not.be.ok();
      installer.listPlugins(function(listErr) {
        should(listErr).not.be.ok();
        done();
      });
    });
  });

});


/**
 * installer.uninstall ***************************
 */
describe("installer.uninstall", function() {
  this.timeout(npmInstallTimeout);

  beforeEach(function(done) {
    installer.npmInstall(testPackage, function(err) {
      should(err).not.be.ok();
      done();
    });
  });

  it("allows a string", function(done) {
    installer.uninstall(testPackage, function(err) {
      should(err).not.be.ok();
      done();
    });
  });

  it("allows an array of string(s)", function(done) {
    installer.uninstall([testPackage], function(err) {
      should(err).not.be.ok();
      done();
    });
  });

  it("removes plugins", function(done) {
    installer.uninstall(testPackage, function(err) {
      should(err).not.be.ok();
      installer.listPlugins(function(listErr, plugins) {
        should(listErr).not.be.ok();
        should(plugins).be.an.Array();
        should(plugins).not.containEql(testPackage);
        done();
      });
    });
  });

  it("ignores error if plugin is not installed", function(done) {
    installer.uninstall(nonExistingPlugin, function(err) {
      should(err).not.be.ok();
      done();
    });
  });

});
