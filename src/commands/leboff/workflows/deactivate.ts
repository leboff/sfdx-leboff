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
import { MetadataInfo } from 'jsforce';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-leboff', 'workflows');

interface WorkflowRule extends MetadataInfo {
  active: string;
}
export default class FlowsDeactivate extends SfdxCommand {
  public static description = messages.getMessage('deactivate.commandDescription');

  public static examples = messages.getMessage('deactivate.examples').split(os.EOL);

  public static args = [];

  protected static flagsConfig = {
    apiname: flags.string({
      char: 'n',
      description: messages.getMessage('apinameFlagDescription'),
    }),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const { apiname } = this.flags as {
      apiname: string;
      namespaceprefix: string;
    };
    const conn = this.org.getConnection();

    this.ux.startSpinner(messages.getMessage('deactivate.inprogress', [apiname]));
    const workflowrule = await conn.metadata.read('WorkflowRule', [apiname]);
    let result;
    try {
      (workflowrule as WorkflowRule).active = 'false';
      result = await conn.metadata.update('WorkflowRule', workflowrule);
    } catch (err) {
      this.ux.error(err);
    }

    return JSON.parse(JSON.stringify(result)) as AnyJson;
  }
}
