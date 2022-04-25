/* eslint-disable prettier/prettier */
import { expect, test } from '@salesforce/command/lib/test';
import { Messages } from '@salesforce/core';
import { ensureJsonMap } from '@salesforce/ts-types';
import {
  PatchFlowDefinition,
  PatchFlowDefinitionFail,
  QueryFlowDefinition,
  QueryFlowDefinitionNotFound,
  requestHelper,
  QueryFlowDefinitionInactive,
} from '../../../util';

Messages.importMessagesDirectory(__dirname);
const messages = Messages.loadMessages('sfdx-leboff', 'flows');

describe('leboff:flows:activate', () => {
  const flowTest = test.withOrg({ username: 'test@org.com' }, true).stderr().stdout();

  flowTest
    .withConnectionRequest((request) => {
      const requestMap = ensureJsonMap(request);
      const result = requestHelper(
        [new QueryFlowDefinition(), new PatchFlowDefinition()],
        requestMap
      );
      if (result) return result;

      return Promise.reject();
    })
    .command([
      'leboff:flows:activate',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Flow',
    ])
    .it('activates Test_Flow', (ctx) => {
      expect(ctx.stdout).to.equal('');
    });

  flowTest
    .withConnectionRequest((request) => {
      const requestMap = ensureJsonMap(request);
      const result = requestHelper(
        [new QueryFlowDefinitionNotFound(), new PatchFlowDefinition()],
        requestMap
      );
      if (result) return result;

      return Promise.reject();
    })
    .command([
      'leboff:flows:activate',
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
      const result = requestHelper([new QueryFlowDefinitionInactive()], requestMap);
      if (result) return result;

      return Promise.reject();
    })
    .command([
      'leboff:flows:activate',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Flow',
    ])
    .it('succeeds if already activated', (ctx) => {
      expect(ctx.stdout).to.equal('');
    });

  flowTest
    .withConnectionRequest((request) => {
      const requestMap = ensureJsonMap(request);
      const result = requestHelper([new QueryFlowDefinition()], requestMap);
      if (result) return result;

      return Promise.reject();
    })
    .command([
      'leboff:flows:activate',
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
      const result = requestHelper(
        [new QueryFlowDefinition(), new PatchFlowDefinitionFail()],
        requestMap
      );
      if (result) return result;

      return Promise.reject();
    })
    .command([
      'leboff:flows:activate',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Flow',
    ])
    .it('errors if update fails', (ctx) => {
      expect(ctx.stderr).to.contain('Error');
    });
});
