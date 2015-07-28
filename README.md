
# docvy-plugin-installer

> Installs plugins for the Docvy Application

[![node](https://img.shields.io/node/v/docvy-plugin-installer.svg?style=flat-square)](https://www.npmjs.com/package/docvy-plugin-installer) [![npm](https://img.shields.io/npm/v/docvy-plugin-installer.svg?style=flat-square)](https://www.npmjs.com/package/docvy-plugin-installer) [![Travis](https://img.shields.io/travis/docvy/plugin-installer.svg?style=flat-square)](https://travis-ci.org/docvy/plugin-installer) [![Gemnasium](https://img.shields.io/gemnasium/docvy/plugin-installer.svg?style=flat-square)](https://gemnasium.com/docvy/plugin-installer) [![Coveralls](https://img.shields.io/coveralls/docvy/plugin-installer.svg?style=flat-square)](https://coveralls.io/github/docvy/plugin-installer?branch=master)


## installation:

```bash
⇒ npm install docvy-plugin-installer
```


## usage:

This component may be used programmatically, as in the docvy application, or from the terminal as a stand-alone application.


### terminal usage:

Help information for terminal usage:

```bash

⇒ docvy-plugins help
 docvy-plugins: The Docvy Plugin Installer

     dir-install <dirpath>    install plugin from <dirpath>
     help                     show this help information
     install <plugin>         install <plugin>
     list                     list installed plugins
     npm-install <plugin>     install <plugin> from NPM
     uninstall <plugin>       uninstall <plugin>
     version                  show version information

 See https://github.com/docvy/plugin-installer for feature-requests and bug-reports

```


### API:

```js
var installer = require("docvy-installer");
```

#### installer.install(names [, callback])

The installer defaults to installing from NPM. See [installer.npmInstall](#npmInstall) for more information.


<a name="npmInstall"></a>
#### installer.npmInstall(names [, callback])

Installs new plugins from NPM. **Plugin MUST be available through [npm][npm].**

* `names` (Array[String]): array of names of the plugins to install
* `callback` (Function):
  * signature: `callback(err)`


#### installer.dirInstall(dirpath [, callback])

Installs plugin from directory at `dirpath`.

* `dirpath` (String): path to the directory holding the plugins content
* `callback` (Function):
  * signature: `callback(err)`


#### installer.uninstall(names [, callback])

Uninstalls a plugins from the Plugins directory.

* `names` (Array[String]): array of names of plugins to uninstall
* `callback` (Function):
  * signature: `callback(err)`
  * On success, `err` will be `null`
  * On error, `err` will be an `Error` object


#### installer.listPlugins([callback])

Lists all the installed plugins

* `callback` (Function):
  * signature: `callback(err, pluginsInfo)`
  * On success, `err` will be `null` and `pluginsInfo` will be an array of [plugins descriptors](#descriptor)
  * On error, `err` will be an `Error` object and `pluginsInfo` be `null`


<a name="descriptor"></a>
#### plugin descriptor

Describes a plugin.

Example [[Schema Reference](https://raw.githubusercontent.com/docvy/server/develop/schemas/plugin-descriptor.json)]:
```json
{
  "name": "dp-markdown",
  "version": "1.0.0",
  "author": {
    "name": "GochoMugo",
    "email": "mugo@forfuture.co.ke"
  },
  "icon": "icon128.png",
  "homepage": "https://github.com/docvy/dp-markdown"
}
```


## license:

__The MIT License (MIT)__

Copyright (c) 2015 Forfuture LLC <we@forfuture.co.ke> <br />
Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>

[npm]:https://npmjs.com
[repo]:https://github.com/docvy/plugin-installer
