/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { expect, test } from '@salesforce/command/lib/test';
import * as Metadata from 'jsforce/lib/api/metadata';

describe('leboff:picklists:deactivate', () => {
  const picklistDeactivateTest = test
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

  picklistDeactivateTest
    .stub(Metadata.prototype, 'read', () => {
      return {
        fullName: 'Account.Test__c',
        valueSet: {
          valueSetDefinition: {
            value: [
              { fullName: 'Test1', label: 'Test1', isActive: true },
              { fullName: 'Test2', label: 'Test2', isActive: true },
            ],
          },
        },
      };
    })
    .command([
      'leboff:picklists:deactivate',
      '--targetusername',
      'asdf@org.com',
      '--field',
      'Account.Test__c',
      '--value',
      'Test1',
      '--json',
    ])

    .it('deactivates a value', (ctx) => {
      // console.log(ctx)
      expect(ctx.stdout).to.contain('"status": 0');
    });

  picklistDeactivateTest
    .stub(Metadata.prototype, 'read', () => {
      return {
        fullName: 'Account.Test__c',
        valueSet: {
          valueSetDefinition: {
            value: [
              { fullName: 'Test1', label: 'Test1', isActive: true },
              { fullName: 'Test2', label: 'Test2', isActive: true },
            ],
          },
        },
      };
    })
    .command([
      'leboff:picklists:deactivate',
      '--targetusername',
      'asdf@org.com',
      '--field',
      'Account.Test__c',
      '--value',
      'Test3',
      '--json',
    ])

    .it('doesnt deactivate a missing value', (ctx) => {
      expect(ctx.stdout).to.contain('not found in picklist');
    });
});
