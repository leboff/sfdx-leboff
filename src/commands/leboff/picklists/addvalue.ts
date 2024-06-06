import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
import { CustomField } from '../../../util/types';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-leboff', 'picklists');

export default class PicklistsAddValue extends SfdxCommand {
  public static description = messages.getMessage('picklists.addvalue.commandDescription');
  public static examples = messages.getMessage('picklists.addvalue.examples').split(os.EOL);

  public static args = [];
  protected static flagsConfig = {
    field: flags.string({
      char: 'f',
      description: 'Field to add value to',
      required: true,
    }),
    value: flags.string({
      char: 'p',
      description: 'Value to add',
      required: true,
    }),
    isdefault: flags.boolean({
      char: 'd',
      description: 'Set this value as the default value',
      required: false,
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
    const { field, value, isdefault } = this.flags as {
      field: string;
      value: string;
      isdefault: boolean;
    };

    const pickVal = {
      fullName: value,
      label: value,
      isActive: true,
      default: !!isdefault,
    };

    this.ux.log(messages.getMessage('picklists.addvalue.inprogress', [value, field]));
    // retrieve picklist from Salesforce
    const picklists = (await conn.metadata.read('CustomField', [field])) as
      | CustomField[]
      | CustomField;

    let picklist: CustomField;
    // set picklist to either first value if array or single value
    if (!picklists || (Array.isArray(picklists) && picklists.length === 0)) {
      throw new SfdxError(messages.getMessage('picklists.error.fieldNotFound', [field]));
    }
    if (Array.isArray(picklists)) {
      picklist = picklists[0];
    } else {
      picklist = picklists;
    }

    if (picklist.valueSet && picklist.valueSet.valueSetDefinition) {
      const vals = picklist.valueSet.valueSetDefinition.value;
      if (vals.find((v) => v.fullName === pickVal.fullName)) {
        throw new SfdxError(messages.getMessage('picklists.error.valueExists', [value, field]));
      }
      vals.push(pickVal);
    } else {
      throw new SfdxError(messages.getMessage('picklists.error.notPicklist', [field]));
    }

    const result = await conn.metadata.update('CustomField', picklist);
    return JSON.parse(JSON.stringify(result)) as AnyJson;
  }
}
