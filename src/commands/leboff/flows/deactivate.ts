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
import { RecordResult } from 'jsforce';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-leboff', 'flows.deactivate');

export default class FlowsDeactivate extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = messages.getMessage('examples').split(os.EOL);

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

    this.ux.startSpinner(messages.getMessage('inprogress', [developername]));

    const conn = this.org.getConnection();

    let flowDefinitionQuery = `Select Id, ActiveVersionId, DeveloperName, LatestVersionId from FlowDefinition where DeveloperName = '${developername}'`;

    if (namespaceprefix) {
      flowDefinitionQuery += ` AND NamespacePrefix = '${namespaceprefix}'`;
    }

    interface FlowDefinition {
      Id: string;
      ActiveVersionId: string;
      DeveloperName: string;
      LatestVersionId: string;
    }

    // Query the org
    const result = await conn.tooling.query<FlowDefinition>(flowDefinitionQuery);

    if (!result.records || result.records.length <= 0) {
      this.ux.stopSpinner('Error');
      throw new SfdxError(messages.getMessage('errorFlowNotFound', [developername]));
    }

    const flowdefinition = result.records[0];

    if (!flowdefinition.ActiveVersionId) {
      this.ux.stopSpinner(messages.getMessage('flowDeactivated'));
      return { developername };
    }

    let flowResult: RecordResult;
    try {
      flowResult = await conn.tooling.sobject('FlowDefinition').update({
        Id: flowdefinition.Id,
        Metadata: {
          activeVersionNumber: '',
        },
      });
    } catch (ex) {
      this.ux.error(ex);
    }

    if (!flowResult || !flowResult.success) {
      this.ux.stopSpinner('Error');
      throw new SfdxError(messages.getMessage('errorFlowUpdate', [developername]));
    }

    this.ux.stopSpinner(messages.getMessage('deactivateSuccess'));
    // Return an object to be displayed with --json
    return { developername, Id: flowResult.id };
  }
}
