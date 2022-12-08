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
import { MetadataInfo, SaveError } from 'jsforce';

interface CustomField extends MetadataInfo {
  trackHistory: string;
}
// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-leboff', 'customfields');

export default class CustomFieldsFieldHistory extends SfdxCommand {
  public static description = messages.getMessage('customfields.fieldHistory.commandDescription');

  public static examples = messages.getMessage('customfields.fieldHistory.examples').split(os.EOL);

  public static args = [];

  protected static flagsConfig = {
    customfields: flags.string({
      char: 'c',
      description: messages.getMessage('customFieldsFlagDescription'),
      required: true,
    }),
    disable: flags.boolean({
      char: 'd',
      description: messages.getMessage('disableFlagDescription'),
      default: false,
    }),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const conn = this.org.getConnection();
    const { customfields, disable } = this.flags as {
      customfields: string;
      disable: boolean;
    };

    const results = [];
    const fieldsArray = customfields.split(',');

    const fields = (await conn.metadata.read('CustomField', fieldsArray)) as CustomField[];
    for (const field of [].concat(fields) as CustomField[]) {
      this.ux.log(messages.getMessage('customfields.fieldHistory.start', [field.fullName]));
      try {
        const track = (!disable).toString();

        if (field.trackHistory !== track) {
          field.trackHistory = track;
          const result = await conn.metadata.update('CustomField', field);

          if (!Array.isArray(result)) {
            if (result.success) {
              this.ux.log(
                messages.getMessage('customfields.fieldHistory.success', [field.fullName])
              );
            } else {
              for (const error of [].concat(result.errors) as SaveError[]) {
                this.ux.log(
                  messages.getMessage('customfields.fieldHistory.error', [error.message])
                );
              }
            }
          }
          results.push(result);
        } else {
          this.ux.log(messages.getMessage('customfields.fieldHistory.noop', [field.fullName]));
        }
      } catch (err) {
        this.ux.error(err);
      }
    }

    return JSON.parse(JSON.stringify(results)) as AnyJson;
  }
}
