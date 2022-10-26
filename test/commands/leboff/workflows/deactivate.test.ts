/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { expect, test } from '@salesforce/command/lib/test';
import * as Metadata from 'jsforce/lib/api/metadata';

describe('leboff:workflows:deactivate', () => {
  const deactivateTest = test
    .withOrg({ username: 'test@org.com' }, true)
    .stderr()
    .stdout()
    .withConnectionRequest(() => {
      return Promise.resolve({});
    })
    .stub(Metadata.prototype, 'update', () => {
      return {
        fullName: 'Account.Test',
        success: true,
      };
    });

  deactivateTest
    .stub(Metadata.prototype, 'read', () => {
      return {
        workflowMetadata: { fullName: 'Account.Test', active: 'true' },
      };
    })
    .command([
      'leboff:workflows:deactivate',
      '--targetusername',
      'asdf@org.com',
      '--apiname',
      'Account.Test',
      '--json',
    ])
    .it('deactivates a workflow', (ctx) => {
      // console.log(ctx)
      expect(ctx.stdout).to.contain('"status": 0');
    });
});
