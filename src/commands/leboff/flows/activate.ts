/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { activate, getFlowDefinition } from '../../../util/flows';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-leboff', 'flows');

export default class FlowsActivate extends SfdxCommand {
  public static description = messages.getMessage('activate.commandDescription');

  public static examples = messages.getMessage('activate.examples').split(os.EOL);

  public static args = [];

  protected static flagsConfig = {
    developername: flags.string({
      char: 'n',
      description: messages.getMessage('developernameFlagDescription'),
    }),
    namespaceprefix: flags.string({
      char: 'p',
      description: messages.getMessage('namespaceprefixFlagDescription'),
    }),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const { developername, namespaceprefix } = this.flags as {
      developername: string;
      namespaceprefix: string;
    };
    const conn = this.org.getConnection();

    this.ux.startSpinner(messages.getMessage('activate.inprogress', [developername]));

    try {
      const flowdefinition = await getFlowDefinition(
        {
          developername,
          namespaceprefix,
        },
        conn
      );

      await activate(flowdefinition, conn);
      this.ux.stopSpinner(messages.getMessage('activate.success'));

      // Return an object to be displayed with --json
      return JSON.parse(JSON.stringify(flowdefinition)) as AnyJson;
    } catch (ex) {
      this.ux.stopSpinner('Error');
      throw ex;
    }
  }
}
