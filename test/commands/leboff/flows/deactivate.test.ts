/* eslint-disable prettier/prettier */
import { expect, test } from '@salesforce/command/lib/test';
import { Messages } from '@salesforce/core';
import { ensureJsonMap, ensureString } from '@salesforce/ts-types';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sfdx-leboff', 'flows');

describe('leboff:flows:deactivate', () => {
  const flowTest = test.withOrg({ username: 'test@org.com' }, true).stderr().stdout();

  flowTest
    .withConnectionRequest((request) => {
      const requestMap = ensureJsonMap(request);

      if (/FlowDefinition/.exec(ensureString(requestMap.url))) {
        if (requestMap.method === 'GET') {
          return Promise.resolve({
            records: [
              {
                Id: '123',
                ActiveVersionId: '456',
                DeveloperName: 'Test_Flow',
                LatestVersionId: '7891',
              },
            ],
          });
        }
        return Promise.resolve({
          id: '123',
          success: true,
        });
      }
      return Promise.resolve({ records: [] });
    })
    .command([
      'leboff:flows:deactivate',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Flow',
    ])
    .it('deactivates Test_Flow', (ctx) => {
      expect(ctx.stdout).to.equal('');
    });

  flowTest
    .withConnectionRequest((request) => {
      const requestMap = ensureJsonMap(request);
      if (/FlowDefinition/.exec(ensureString(requestMap.url))) {
        if (requestMap.method === 'GET') {
          return Promise.resolve({
            records: [],
          });
        }
      }
      return Promise.resolve({ records: [] });
    })
    .command([
      'leboff:flows:deactivate',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Flow',
      '--namespaceprefix',
      'test',
    ])
    .it('fails if Test_Flow is not found', (ctx) => {
      expect(ctx.stderr).to.contain(messages.getMessage('errorFlowNotFound', ['Test_Flow']));
    });

  flowTest
    .withConnectionRequest((request) => {
      const requestMap = ensureJsonMap(request);
      if (/FlowDefinition/.exec(ensureString(requestMap.url))) {
        if (requestMap.method === 'GET') {
          return Promise.resolve({
            records: [
              {
                Id: '123',
                ActiveVersionId: null,
                DeveloperName: 'Test_Flow',
                LatestVersionId: '7891',
              },
            ],
          });
        }
      }
      return Promise.resolve({ records: [] });
    })
    .command([
      'leboff:flows:deactivate',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Flow',
    ])
    .it('succeeds if already deactivated', (ctx) => {
      expect(ctx.stdout).to.equal('');
    });

  flowTest
    .withConnectionRequest((request) => {
      const requestMap = ensureJsonMap(request);

      if (/FlowDefinition/.exec(ensureString(requestMap.url))) {
        if (requestMap.method === 'GET') {
          return Promise.resolve({
            records: [
              {
                Id: '123',
                ActiveVersionId: '456',
                DeveloperName: 'Test_Flow',
                LatestVersionId: '7891',
              },
            ],
          });
        }
        return Promise.reject({ code: 1 });
      }
      return Promise.resolve({ records: [] });
    })
    .command([
      'leboff:flows:deactivate',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Flow',
    ])
    .it('errors if update fails', (ctx) => {
      expect(ctx.stderr).to.contain('Error');
    });

  flowTest
    .withConnectionRequest((request) => {
      const requestMap = ensureJsonMap(request);

      if (/FlowDefinition/.exec(ensureString(requestMap.url))) {
        if (requestMap.method === 'GET') {
          return Promise.resolve({
            records: [
              {
                Id: '123',
                ActiveVersionId: '456',
                DeveloperName: 'Test_Flow',
                LatestVersionId: '7891',
              },
            ],
          });
        }
        return Promise.resolve({
          success: false,
        });
      }
      return Promise.resolve({ records: [] });
    })
    .command([
      'leboff:flows:deactivate',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Flow',
    ])
    .it('errors if update fails', (ctx) => {
      expect(ctx.stderr).to.contain('Error');
    });
});
