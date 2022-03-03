/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import AnalyticsApi from '../../../util/analytics';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-leboff', 'dashboards');

interface Dashboard {
  Id: string;
  DeveloperName: string;
  NamespacePrefix: string;
}
interface DashboardMetadata {
  [name: string]: AnyJson;
}

interface User {
  Id: string;
  Email: string;
  Username: string;
  Name: string;
}

export default class DashboardsRunningUser extends SfdxCommand {
  public static description = messages.getMessage('runninguser.commandDescription');

  public static examples = messages.getMessage('runninguser.examples').split(os.EOL);

  public static args = [];

  protected static flagsConfig = {
    developername: flags.string({
      char: 'n',
      description: messages.getMessage('developernameFlagDescription'),
      required: true,
    }),
    dashboardtype: flags.string({
      char: 't',
      description: messages.getMessage('dashboardtypeFlagDescription'),
      required: true,
    }),
    userwhereclause: flags.string({
      char: 'c',
      description: messages.getMessage('userwhereclauseFlagDescription'),
    }),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  protected static VALID_TYPES = ['SpecifiedUser', 'LoggedInUser', 'MyTeamUser'];

  public async run(): Promise<AnyJson> {
    const { developername, userwhereclause, dashboardtype } = this.flags as {
      developername: string;
      userwhereclause: string;
      dashboardtype: string;
    };

    if (!DashboardsRunningUser.VALID_TYPES.includes(dashboardtype)) {
      throw new SfdxError(messages.getMessage('errorBadDashboardtype', [dashboardtype]));
    }

    if (dashboardtype === 'SpecifiedUser' && !userwhereclause) {
      throw new SfdxError(messages.getMessage('errorWhereClause', [dashboardtype]));
    }

    const conn = this.org.getConnection();

    const api = new AnalyticsApi(conn);

    this.ux.startSpinner(messages.getMessage('runninguser.inprogress', [developername]));

    const dashboardQuery = `Select Id, DeveloperName, NamespacePrefix from Dashboard where DeveloperName = '${developername}'`;

    const dashboardResults = await conn.query<Dashboard>(dashboardQuery);
    if (!dashboardResults.records || dashboardResults.records.length <= 0) {
      throw new SfdxError(messages.getMessage('errorDashboardNotFound', [developername]));
    }
    const dashboard = dashboardResults.records[0];

    const dashboardMetadata: DashboardMetadata = {
      dashboardType: dashboardtype,
    };

    if (dashboardtype === 'SpecifiedUser') {
      const userQuery = `Select Id, Name, Email, Username from User where ${userwhereclause} LIMIT 1`;
      const userResults = await conn.query<User>(userQuery);
      if (!userResults.records || userResults.records.length <= 0) {
        throw new SfdxError(messages.getMessage('errrorUserNotFound', [userwhereclause]));
      }

      const user = userResults.records[0];
      dashboardMetadata.runningUser = { id: user.Id };
    }
    try {
      // Return an object to be displayed with --json
      const res = await api.updateDashboard(dashboard.Id, dashboardMetadata);
      return JSON.parse(JSON.stringify(res)) as AnyJson;
    } catch (ex) {
      this.ux.stopSpinner('Error');
      throw ex;
    }
  }
}
