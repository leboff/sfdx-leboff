/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { expect, test } from '@salesforce/command/lib/test';
import { Messages } from '@salesforce/core';
import * as Metadata from 'jsforce/lib/api/metadata';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sfdx-leboff', 'picklists');

describe('leboff:picklists:addvalue', () => {
  const picklistTest = test.withOrg({ username: 'test@org.com' }, true).stderr().stdout();

  picklistTest
    .stub(Metadata.prototype, 'read', () => {
      return [
        {
          fullName: 'ExistingField',
          valueSet: {
            valueSetDefinition: {
              value: [{ fullName: 'ExistingValue' }],
            },
          },
        },
      ];
    })

    .stub(Metadata.prototype, 'update', () => {
      return {
        fullName: 'ExistingField',
        success: true,
      };
    })
    .command([
      'leboff:picklists:addvalue',
      '--targetusername',
      'test@org.com',
      '--field',
      'ExistingField',
      '--value',
      'NewValue',
    ])
    .it('adds a new value to an existing picklist field', (ctx) => {
      expect(ctx.stdout).to.contain(
        messages.getMessage('picklists.addvalue.inprogress', ['NewValue', 'ExistingField'])
      );
    });

  picklistTest
    .stub(Metadata.prototype, 'read', () => {
      return [];
    })
    .command([
      'leboff:picklists:addvalue',
      '--targetusername',
      'test@org.com',
      '--field',
      'NonExistentField',
      '--value',
      'NewValue',
    ])
    .it('throws an error if the field does not exist', (ctx) => {
      expect(ctx.stderr).to.contain('Unable to find field NonExistentField');
    });

  picklistTest
    .stub(Metadata.prototype, 'read', () => {
      return [
        {
          fullName: 'ExistingField',
          valueSet: {
            valueSetDefinition: {
              value: [{ fullName: 'ExistingValue' }],
            },
          },
        },
      ];
    })
    .command([
      'leboff:picklists:addvalue',
      '--targetusername',
      'test@org.com',
      '--field',
      'ExistingField',
      '--value',
      'ExistingValue',
    ])
    .it('throws an error if the value already exists in the picklist', (ctx) => {
      expect(ctx.stderr).to.contain(
        'Value ExistingValue already exists in picklist ExistingField.'
      );
    });

  picklistTest
    .stub(Metadata.prototype, 'read', () => {
      return [
        {
          fullName: 'ExistingField',
          valueSet: {},
        },
      ];
    })
    .command([
      'leboff:picklists:addvalue',
      '--targetusername',
      'test@org.com',
      '--field',
      'ExistingField',
      '--value',
      'NewValue',
    ])
    .it('throws an error if the field is not a picklist', (ctx) => {
      expect(ctx.stderr).to.contain('Field ExistingField is not a picklist');
    });
});
