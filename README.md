# sfdx-leboff

Some commands that were missing

[![Version](https://img.shields.io/npm/v/sfdx-leboff.svg)](https://npmjs.org/package/sfdx-leboff)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/leboff/sfdx-leboff?branch=master&svg=true)](https://ci.appveyor.com/project/heroku/sfdx-leboff/branch/master)
[![Greenkeeper](https://badges.greenkeeper.io/leboff/sfdx-leboff.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/leboff/sfdx-leboff/badge.svg)](https://snyk.io/test/github/leboff/sfdx-leboff)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-leboff.svg)](https://npmjs.org/package/sfdx-leboff)
[![License](https://img.shields.io/npm/l/sfdx-leboff.svg)](https://github.com/leboff/sfdx-leboff/blob/master/package.json)

<!-- toc -->

- [Debugging your plugin](#debugging-your-plugin)
  <!-- tocstop -->
  <!-- install -->
  <!-- usage -->

```sh-session
$ npm install -g sfdx-leboff
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
sfdx-leboff/0.0.0-development darwin-x64 node-v17.4.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```

<!-- usagestop -->
<!-- commands -->

- [`sfdx leboff:flows:deactivate [-n <string>] [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-leboffflowsdeactivate--n-string--p-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

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

_See code: [src/commands/leboff/flows/deactivate.ts](https://github.com/leboff/sfdx-leboff/blob/v0.0.0-development/src/commands/leboff/flows/deactivate.ts)_

<!-- commandsstop -->
<!-- debugging-your-plugin -->

# Debugging your plugin

We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command:

1. Start the inspector

If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch:

```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```

Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:

```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program.
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
   <br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
   Congrats, you are debugging!
