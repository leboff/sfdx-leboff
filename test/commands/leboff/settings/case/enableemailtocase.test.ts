/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { expect, test } from '@salesforce/command/lib/test';
import * as Metadata from '../../../../../node_modules/jsforce/lib/api/Metadata';

describe('leboff:settings:case:enableemailtocase', () => {
  const caseSettingsTest = test
    .withOrg({ username: 'test@org.com' }, true)
    .stderr()
    .stdout()
    .withConnectionRequest(() => {
      return Promise.resolve({});
    })
    .stub(Metadata.prototype, 'update', () => {
      return {};
    });

  caseSettingsTest
    .stub(Metadata.prototype, 'read', () => {
      return {
        emailToCase: { enableEmailToCase: true },
      };
    })
    .command([
      'leboff:settings:case:enableemailtocase',
      '--targetusername',
      'asdf@org.com',
      '--json',
    ])
    .it('enables emailtocase', (ctx) => {
      // console.log(ctx)
      expect(ctx.stdout).to.contain('"status": 0');
    });

  caseSettingsTest
    .stub(Metadata.prototype, 'read', () => {
      return {
        emailToCase: { enableEmailToCase: false },
      };
    })
    .command([
      'leboff:settings:case:enableemailtocase',
      '--targetusername',
      'asdf@org.com',
      '--json',
    ])
    .it('fails if it cannot enable emailtocase', (ctx) => {
      // console.log(ctx)
      expect(ctx.stdout).to.contain('"status": 1');
    });
});
