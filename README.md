# sfdx-leboff

Some commands that were missing

[![Version](https://img.shields.io/npm/v/sfdx-leboff.svg)](https://npmjs.org/package/sfdx-leboff)
[![GH Actions](https://github.com/leboff/sfdx-leboff/actions/workflows/release.yml/badge.svg)](https://github.com/leboff/sfdx-leboff/actions)
[![Coverage Status](https://coveralls.io/repos/github/leboff/sfdx-leboff/badge.svg?branch=main)](https://coveralls.io/github/leboff/sfdx-leboff?branch=main)
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
sfdx-leboff/1.5.0 linux-x64 node-v16.14.2
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx leboff:dashboards:runninguser -n <string> -t <string> [-c <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-leboffdashboardsrunninguser--n-string--t-string--c-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx leboff:flows:activate [-n <string>] [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-leboffflowsactivate--n-string--p-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx leboff:flows:deactivate [-n <string>] [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-leboffflowsdeactivate--n-string--p-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx leboff:flows:delete [-n <string>] [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-leboffflowsdelete--n-string--p-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx leboff:folders:copysharing -s <string> -t <string> [-n <string>] [-e <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-lebofffolderscopysharing--s-string--t-string--n-string--e-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)
* [`sfdx leboff:reports:move -f <string> [-n <string>] [-c <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-leboffreportsmove--f-string--n-string--c-string--v-string--u-string---apiversion-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx leboff:dashboards:runninguser -n <string> -t <string> [-c <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Modify the dashboard running user or view as option

```
USAGE
  $ sfdx leboff:dashboards:runninguser -n <string> -t <string> [-c <string>] [-v <string>] [-u <string>] [--apiversion 
  <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --userwhereclause=userwhereclause                                             Where clause used to find the
                                                                                    running user. Required if type is
                                                                                    SpecifiedUser

  -n, --developername=developername                                                 (required) The developer name of the
                                                                                    dashboard to modify

  -t, --dashboardtype=dashboardtype                                                 (required) The Dashboard running
                                                                                    user type. Acceptable values are
                                                                                    LoggedInUser, SpecifiedUser, and
                                                                                    MyTeamUser

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
  sfdx leboff:dashboards:runninguser --targetusername myOrg@example.com  --developername My_Dashboard --userwhereclause 
  "email='test@example.com'"
```

_See code: [src/commands/leboff/dashboards/runninguser.ts](https://github.com/leboff/sfdx-leboff/blob/v1.5.0/src/commands/leboff/dashboards/runninguser.ts)_

## `sfdx leboff:flows:activate [-n <string>] [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Activate latest version of a Flow based on API Name

```
USAGE
  $ sfdx leboff:flows:activate [-n <string>] [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] 
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

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
  sfdx leboff:flows:activate --targetusername myOrg@example.com  --developername My_Flow
```

_See code: [src/commands/leboff/flows/activate.ts](https://github.com/leboff/sfdx-leboff/blob/v1.5.0/src/commands/leboff/flows/activate.ts)_

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

_See code: [src/commands/leboff/flows/deactivate.ts](https://github.com/leboff/sfdx-leboff/blob/v1.5.0/src/commands/leboff/flows/deactivate.ts)_

## `sfdx leboff:flows:delete [-n <string>] [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Delete a Flow and all versions based on API Name

```
USAGE
  $ sfdx leboff:flows:delete [-n <string>] [-p <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] 
  [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

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
  sfdx leboff:flows:delete --targetusername myOrg@example.com  --developername My_Flow
```

_See code: [src/commands/leboff/flows/delete.ts](https://github.com/leboff/sfdx-leboff/blob/v1.5.0/src/commands/leboff/flows/delete.ts)_

## `sfdx leboff:folders:copysharing -s <string> -t <string> [-n <string>] [-e <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Copy sharing from one folder to another

```
USAGE
  $ sfdx leboff:folders:copysharing -s <string> -t <string> [-n <string>] [-e <string>] [-v <string>] [-u <string>] 
  [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -e, --targetnamespace=targetnamespace                                             The namespace folder to copy sharing
                                                                                    to

  -n, --sourcenamespace=sourcenamespace                                             The namespace of the folder to copy
                                                                                    sharing from

  -s, --sourcefolder=sourcefolder                                                   (required) The developername of the
                                                                                    folder to copy sharing from

  -t, --targetfolder=targetfolder                                                   (required) The developername folder
                                                                                    to copy sharing to

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
  sfdx leboff:folders:copysharing --targetusername myOrg@example.com  --sourcefolder CompanyDashboards --targetfolder 
  OtherDashboards
```

_See code: [src/commands/leboff/folders/copysharing.ts](https://github.com/leboff/sfdx-leboff/blob/v1.5.0/src/commands/leboff/folders/copysharing.ts)_

## `sfdx leboff:reports:move -f <string> [-n <string>] [-c <string>] [-v <string>] [-u <string>] [--apiversion <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

Move reports from one folder to another

```
USAGE
  $ sfdx leboff:reports:move -f <string> [-n <string>] [-c <string>] [-v <string>] [-u <string>] [--apiversion <string>]
   [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -c, --whereclause=whereclause                                                     Where clause used to find reports to
                                                                                    move

  -f, --foldername=foldername                                                       (required) The developer name of the
                                                                                    folder to move the reports to

  -n, --developername=developername                                                 The developer name of the report to
                                                                                    move

  -u, --targetusername=targetusername                                               username or alias for the target
                                                                                    org; overrides default target org

  -v, --targetdevhubusername=targetdevhubusername                                   username or alias for the dev hub
                                                                                    org; overrides default dev hub org

  --apiversion=apiversion                                                           override the api version used for
                                                                                    api requests made by this command

  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLES
  sfdx leboff:reports:move --targetusername myOrg@example.com  --developername My_Report --foldername NewFolder
  sfdx leboff:reports:move --targetusername myOrg@example.com  --whereclause "namepsaceprefix='myns'" --foldername 
  NewFolder
```

_See code: [src/commands/leboff/reports/move.ts](https://github.com/leboff/sfdx-leboff/blob/v1.5.0/src/commands/leboff/reports/move.ts)_
<!-- commandsstop -->
