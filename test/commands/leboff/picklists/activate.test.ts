/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { expect, test } from '@salesforce/command/lib/test';
import * as Metadata from 'jsforce/lib/api/metadata';

describe('leboff:picklists:activate', () => {
  const picklistActivateTest = test
    .withOrg({ username: 'test@org.com' }, true)
    .stderr()
    .stdout()
    .withConnectionRequest(() => {
      return Promise.resolve({});
    })
    .stub(Metadata.prototype, 'update', () => {
      return {
        fullName: 'Account.Test__c',
        success: true,
      };
    });

  picklistActivateTest
    .stub(Metadata.prototype, 'read', () => {
      return {
        fullName: 'Account.Test__c',
        valueSet: {
          valueSetDefinition: {
            value: [
              { fullName: 'Test1', label: 'Test1', isActive: false },
              { fullName: 'Test2', label: 'Test2', isActive: false },
            ],
          },
        },
      };
    })
    .command([
      'leboff:picklists:activate',
      '--targetusername',
      'asdf@org.com',
      '--field',
      'Account.Test__c',
      '--value',
      'Test1',
      '--json',
    ])
    .it('activates a value', (ctx) => {
      // console.log(ctx)
      expect(ctx.stdout).to.contain('"status": 0');
    });

  picklistActivateTest
    .stub(Metadata.prototype, 'read', () => {
      return {
        fullName: 'Account.Test__c',
        valueSet: {
          valueSetDefinition: {
            value: [
              { fullName: 'Test1', label: 'Test1', isActive: false },
              { fullName: 'Test2', label: 'Test2', isActive: false },
            ],
          },
        },
      };
    })
    .command([
      'leboff:picklists:activate',
      '--targetusername',
      'asdf@org.com',
      '--field',
      'Account.Test__c',
      '--value',
      'Test3',
      '--json',
    ])
    .it('doesnt activate a missing value', (ctx) => {
      expect(ctx.stdout).to.contain('not found in picklist');
    });
});
