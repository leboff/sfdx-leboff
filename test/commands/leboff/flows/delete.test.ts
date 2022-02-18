/* eslint-disable prettier/prettier */
import { expect, test } from '@salesforce/command/lib/test';
import { ensureJsonMap } from '@salesforce/ts-types';
import {
  requestHelper,
  QueryFlowDefinition,
  QueryFlow,
  QueryFlowEmpty,
  PatchFlowDefinition,
  DeleteFlow,
  QueryFlowDefinitionInactive,
  DeleteFlowError,
} from '../../../util';

describe('leboff:flows:delete', () => {
  const flowTest = test.withOrg({ username: 'test@org.com' }, true).stderr().stdout();

  flowTest
    .withConnectionRequest((request) => {
      const requestMap = ensureJsonMap(request);
      const result = requestHelper(
        [new QueryFlowDefinition(), new QueryFlow(), new PatchFlowDefinition(), new DeleteFlow()],
        requestMap
      );

      if (result) return result;

      return Promise.reject();
    })
    .command([
      'leboff:flows:delete',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Flow',
      '--namespaceprefix',
      'test',
      '--json',
    ])
    .it('deletes an active Test_Flow', (ctx) => {
      expect(ctx.stdout).to.contain('"Id": "123"');
      expect(ctx.stdout).to.contain('"Id": "456"');
    });

  flowTest
    .withConnectionRequest((request) => {
      const requestMap = ensureJsonMap(request);
      const result = requestHelper(
        [
          new QueryFlowDefinition(),
          new QueryFlowEmpty(),
          new PatchFlowDefinition(),
          new DeleteFlow(),
        ],
        requestMap
      );

      if (result) return result;

      return Promise.reject();
    })
    .command([
      'leboff:flows:delete',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Flow',
      '--namespaceprefix',
      'test',
      '--json',
    ])
    .it('fails if flow not found', (ctx) => {
      expect(ctx.stdout).to.contain('Error');
    });

  flowTest
    .withConnectionRequest((request) => {
      const requestMap = ensureJsonMap(request);
      const result = requestHelper(
        [
          new QueryFlowDefinitionInactive(),
          new QueryFlow(),
          new PatchFlowDefinition(),
          new DeleteFlow(),
        ],
        requestMap
      );

      if (result) return result;

      return Promise.reject();
    })
    .command([
      'leboff:flows:delete',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Flow',
      '--json',
    ])
    .it('deletes an inactive Test_Flow', (ctx) => {
      expect(ctx.stdout).to.contain('"Id": "123"');
      expect(ctx.stdout).to.contain('"Id": "456"');
    });

  flowTest
    .withConnectionRequest((request) => {
      const requestMap = ensureJsonMap(request);
      const result = requestHelper(
        [
          new QueryFlowDefinition(),
          new QueryFlow(),
          new PatchFlowDefinition(),
          new DeleteFlowError(),
        ],
        requestMap
      );

      if (result) return result;

      return Promise.reject();
    })
    .command([
      'leboff:flows:delete',
      '--targetusername',
      'test@org.com',
      '--developername',
      'Test_Flow',
      '--json',
    ])
    .it('Handles errors on delete', (ctx) => {
      expect(ctx.stdout).to.contain('Error');
    });
});
