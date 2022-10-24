/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { expect, test } from '@salesforce/command/lib/test';
import * as Metadata from 'jsforce/lib/api/metadata';

describe('leboff:customfields:fieldhistory', () => {
  const fieldHistoryTest = test
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

  fieldHistoryTest
    .stub(Metadata.prototype, 'read', () => {
      return {
        fieldMetadata: { fullName: 'Account.Test__c' },
      };
    })
    .command([
      'leboff:customfields:fieldhistory',
      '--targetusername',
      'asdf@org.com',
      '--customfields',
      'Account.Test__c',
      '--json',
    ])
    .it('enables a single field', (ctx) => {
      // console.log(ctx)
      expect(ctx.stdout).to.contain('"status": 0');
    });

  fieldHistoryTest
    .stub(Metadata.prototype, 'read', () => {
      return {
        fieldMetadata: { fullName: 'Account.Test__c' },
      };
    })
    .command([
      'leboff:customfields:fieldhistory',
      '--targetusername',
      'asdf@org.com',
      '--customfields',
      'Account.Test__c,Account.Test1__c',
      '--json',
    ])
    .it('enables multiple field', (ctx) => {
      // console.log(ctx)
      expect(ctx.stdout).to.contain('"status": 0');
    });
});
