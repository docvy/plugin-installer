
# docvy-plugin-installer

[![Build Status](https://travis-ci.org/GochoMugo/docvy-plugin-installer.svg?branch=develop)](https://travis-ci.org/GochoMugo/docvy-plugin-installer) [![Coverage Status](https://coveralls.io/repos/GochoMugo/docvy-plugin-installer/badge.svg?branch=develop)](https://coveralls.io/r/GochoMugo/docvy-plugin-installer?branch=develop)

> Installs plugins for the Docvy Application


## installation:

Using [npm][npm] from [github][repo] (**bleeding edge**):

```bash
⇒ npm install GochoMugo/docvy-plugin-installer#develop
```


## usage:

This component may be used programmatically, as in the docvy application, or from the terminal as a stand-alone application.


### terminal usage:

Help information for terminal usage:

```bash
⇒ docvy-plugins -h

  Usage: docvy-plugins [options]

  Options:

    -h, --help                output usage information
    -V, --version             output the version number
    -l, --list                list installed plugins
    -i, --install <plugin>    install <plugin>
    -u, --uninstall <plugin>  uninstall <plugin>

```


### API:

```js
var installer = require("docvy-installer");
```

#### installer.install(names [, callback])

Installs new plugins into the Plugins directory. **Plugin MUST be available through [npm][npm].**

* `names` (Array[String]): array of names of the plugins to install
* `callback` (Function):
  * signature: `callback(err)`
  * On success, `err` will be null
  * On error, `err` will be an `Error` object


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

Example [[Schema Reference](https://raw.githubusercontent.com/GochoMugo/docvy-server/develop/schemas/plugin-descriptor.json)]:
```json
{
  "name": "dp-markdown",
  "version": "1.0.0",
  "author": {
    "name": "GochoMugo",
    "email": "mugo@forfuture.co.ke"
  },
  "icon": "icon128.png",
  "homepage": "https://github.com/GochoMugo/dp-markdown"
}
```


## license:

__The MIT License (MIT)__

Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>

[npm]:https://npmjs.com
[repo]:https://github.com/GochoMugo/docvy-plugin-installer

