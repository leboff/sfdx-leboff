# sfdx-leboff

Some commands that were missing

[![Version](https://img.shields.io/npm/v/sfdx-leboff.svg)](https://npmjs.org/package/sfdx-leboff)
[![GH Actions](https://github.com/leboff/sfdx-leboff/actions/workflows/release.yml/badge.svg)](https://github.com/leboff/sfdx-leboff/actions)
[![Greenkeeper](https://badges.greenkeeper.io/leboff/sfdx-leboff.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/leboff/sfdx-leboff/badge.svg)](https://snyk.io/test/github/leboff/sfdx-leboff)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-leboff.svg)](https://npmjs.org/package/sfdx-leboff)
[![License](https://img.shields.io/npm/l/sfdx-leboff.svg)](https://github.com/leboff/sfdx-leboff/blob/master/package.json)

<!-- toc -->
* [sfdx-leboff](#sfdx-leboff)
<!-- tocstop -->
    <!-- install -->
    <!-- usage -->
```sh-session
$ npm install -g sfdx-leboff
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
sfdx-leboff/1.0.0 linux-x64 node-v16.13.2
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx leboff:flows:deactivate [-n <string>] [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-leboffflowsdeactivate--n-string--p-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx leboff:flows:deactivate [-n <string>] [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Deactivate a Flow based on API Name

```
USAGE
  $ sfdx leboff:flows:deactivate [-n <string>] [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] 
  [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -n, --developername=developername                                                 The developer name of the flow to
                                                                                    deactivate

  -p, --namespaceprefix=namespaceprefix                                             Use to specify a specific namespace
                                                                                    prefix

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx leboff:flows:deactivate --targetusername myOrg@example.com  --developername My_Flow
```

_See code: [src/commands/leboff/flows/deactivate.ts](https://github.com/leboff/sfdx-leboff/blob/v1.0.0/src/commands/leboff/flows/deactivate.ts)_
<!-- commandsstop -->
