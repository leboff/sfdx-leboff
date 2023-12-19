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
import { MetadataInfo } from 'jsforce';

interface Value {
  fullName: string;
  default: boolean;
  label: string;
  isActive: boolean;
}

interface ValueSetDefinition {
  value: Value[];
}

interface ValueSet {
  valueSetDefinition: ValueSetDefinition;
}

interface CustomField extends MetadataInfo {
  trackHistory: string;
  valueSet: ValueSet;
}
// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-leboff', 'picklists');

export default class PicklistsActivate extends SfdxCommand {
  public static description = messages.getMessage('picklists.activate.commandDescription');

  public static examples = messages.getMessage('picklists.activate.examples').split(os.EOL);

  public static args = [];

  protected static flagsConfig = {
    field: flags.string({
      char: 'f',
      description: messages.getMessage('fieldFlagDescription'),
      required: true,
    }),
    value: flags.string({
      char: 'p',
      description: messages.getMessage('valueFlagDescription'),
      required: true,
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
    const { field, value } = this.flags as {
      field: string;
      value: string;
    };

    let result;
    // const fieldsArray = picklists.split(',');

    // retrieve field from Salesforce org
    const fieldMetadata = (await conn.metadata.read('CustomField', [field])) as CustomField[];
    // go through retrieved fields
    for (const fieldMd of [].concat(fieldMetadata) as CustomField[]) {
      this.ux.log(messages.getMessage('picklists.activate.start', [fieldMd.fullName]));
      if (
        !fieldMd ||
        !fieldMd.valueSet ||
        !fieldMd.valueSet.valueSetDefinition ||
        !fieldMd.valueSet.valueSetDefinition.value
      ) {
        throw new SfdxError(
          messages.getMessage('errorPicklistValuesNotFound', [JSON.stringify(fieldMd)])
        );
      }
      // find our picklist value
      const pickVal = fieldMd.valueSet.valueSetDefinition.value.find((v) => v.fullName === value);

      if (!pickVal) {
        throw new SfdxError(messages.getMessage('errorValueNotFound', [value, field]));
      }
      pickVal.isActive = true;
      // update metadata
      result = await conn.metadata.update('CustomField', fieldMd);
    }

    return JSON.parse(JSON.stringify(result)) as AnyJson;
  }
}
