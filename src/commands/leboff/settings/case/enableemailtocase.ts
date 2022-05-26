/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

interface EmailToCaseSettings {
  enableEmailToCase: true;
}
interface CaseSettings {
  fullName: string;
  emailToCase: EmailToCaseSettings;
}

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-leboff', 'settings');

export default class SettingsCaseEnableEmailToCase extends SfdxCommand {
  public static description = messages.getMessage('case.enableemailtocase.commandDescription');

  public static examples = messages.getMessage('case.enableemailtocase.examples').split(os.EOL);

  public static args = [];

  protected static flagsConfig = {};

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const conn = this.org.getConnection();

    this.ux.startSpinner(messages.getMessage('case.enableemailtocase.start'));

    const enableEmailToCaseSettings = {
      fullName: 'Case',
      emailToCase: { enableEmailToCase: true },
    };

    await conn.metadata.update('CaseSettings', enableEmailToCaseSettings);

    const caseSettings = (await conn.metadata.read('CaseSettings', ['Case'])) as CaseSettings;

    if (caseSettings.emailToCase && caseSettings.emailToCase.enableEmailToCase) {
      this.ux.stopSpinner(messages.getMessage('case.enableemailtocase.success'));
    } else {
      this.ux.stopSpinner(messages.getMessage('case.enableemailtocase.error'));
      throw new SfdxError('Failed to update case settings');
    }

    return JSON.parse(JSON.stringify(caseSettings)) as AnyJson;
  }
}
