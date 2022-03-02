import { expect, test } from '@salesforce/command/lib/test';
import { ensureJsonMap } from '@salesforce/ts-types';
import {
  requestHelper,
  QueryReport,
  QueryFolder,
  DescribeReport,
  PatchReport,
} from '../../../util';

describe('leboff:reports:move', () => {
  const reportsTest = test.withOrg({ username: 'test@org.com' }, true).stderr().stdout();

  reportsTest
    .withConnectionRequest((request) => {
      if (typeof request === 'string' || request instanceof String) {
        request = {
          url: request,
          method: 'GET',
        };
      }
      const requestMap = ensureJsonMap(request);
      const result = requestHelper(
        [new QueryReport(), new QueryFolder(), new DescribeReport(), new PatchReport()],
        requestMap
      );

      return result || Promise.reject();
    })
    .command([
      'leboff:reports:move',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Report',
      '--foldername',
      'Test_Folder_Tgt',
      '--json',
    ])
    .it('Moves report to folder', (ctx) => {
      expect(ctx.stdout).to.contain('"status": 0');
    });

  reportsTest
    .withConnectionRequest((request) => {
      if (typeof request === 'string' || request instanceof String) {
        request = {
          url: request,
          method: 'GET',
        };
      }
      const requestMap = ensureJsonMap(request);
      const result = requestHelper(
        [new QueryReport(), new QueryFolder(), new DescribeReport(), new PatchReport()],
        requestMap
      );

      return result || Promise.reject();
    })
    .command([
      'leboff:reports:move',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Report',
      '--whereclause',
      "DeveloperName LIKE 'Sample%'",
      '--foldername',
      'Test_Folder_Tgt',
      '--json',
    ])
    .it('Fails on too many options', (ctx) => {
      expect(ctx.stdout).to.contain('"status": 1');
    });
});
