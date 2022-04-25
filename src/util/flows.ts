import { Connection, SfdxError, Messages } from '@salesforce/core';
import { RecordResult } from 'jsforce';
import { SalesforceRecord } from '.';

export interface FlowOptions {
  developername: string;
  namespaceprefix: string;
}

export interface Flow extends SalesforceRecord {
  VersionNumber: number;
  FullName: string;
  MasterLabel: string;
}
export interface FlowDefinition extends SalesforceRecord {
  ActiveVersion: Flow;
  ActiveVersionId: string;
  DeveloperName: string;
  LatestVersion: Flow;
  LatestVersionId: string;
  NamespacePrefix?: string;
}

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-leboff', 'flows');

export async function getFlowDefinition(
  opts: FlowOptions,
  conn: Connection
): Promise<FlowDefinition> {
  const { developername, namespaceprefix } = opts;

  let flowDefinitionQuery = `Select Id, ActiveVersionId, DeveloperName, NamespacePrefix, LatestVersionId, LatestVersion.VersionNumber from FlowDefinition where DeveloperName = '${developername}'`;

  if (namespaceprefix) {
    flowDefinitionQuery += ` AND NamespacePrefix = '${namespaceprefix}'`;
  }
  // Query the org
  const result = await conn.tooling.query<FlowDefinition>(flowDefinitionQuery);

  if (!result.records || result.records.length <= 0) {
    throw new SfdxError(messages.getMessage('errorFlowNotFound', [developername]));
  }

  return result.records[0];
}

export async function getFlowsByDefinition(
  flowdefinition: FlowDefinition,
  conn: Connection
): Promise<Flow[]> {
  let flowQuery = `Select Id, VersionNumber, FullName, MasterLabel from Flow where DefinitionId = '${flowdefinition.Id}'`;
  if (flowdefinition.NamespacePrefix) {
    flowQuery += ` AND Definition.NamespacePrefix = '${flowdefinition.NamespacePrefix}'`;
  }
  // Query the org
  const result = await conn.tooling.query<Flow>(flowQuery);

  if (!result.records || result.records.length <= 0) {
    throw new SfdxError(messages.getMessage('errorFlowNotFound', [flowdefinition.DeveloperName]));
  }
  return result.records;
}
export async function deleteFlows(flows: Flow[], conn: Connection): Promise<RecordResult[]> {
  const flowIds = flows.map((flow) => flow.Id);

  const results = await conn.tooling.sobject('Flow').del(flowIds);

  const errors = results.reduce((errs: string[], res) => {
    if ('errors' in res && res.errors.length > 0) {
      errs.push(res.errors.join('\n'));
    }
    return errs;
  }, []);

  if (errors.length > 0) {
    throw new SfdxError(messages.getMessage('delete.failed', [errors.join('\n')]));
  }
  return results;
}
export async function deactivate(flow: FlowDefinition, conn: Connection): Promise<RecordResult> {
  const flowResult = await conn.tooling.sobject('FlowDefinition').update({
    Id: flow.Id,
    Metadata: {
      activeVersionNumber: '',
    },
  });

  if (!flowResult || !flowResult.success) {
    throw new SfdxError(messages.getMessage('errorFlowUpdate', [flow.DeveloperName]));
  }
  return flowResult;
}

export async function activate(flow: FlowDefinition, conn: Connection): Promise<RecordResult> {
  const flowResult = await conn.tooling.sobject('FlowDefinition').update({
    Id: flow.Id,
    Metadata: {
      activeVersionNumber: flow.LatestVersion.VersionNumber,
    },
  });

  if (!flowResult || !flowResult.success) {
    throw new SfdxError(messages.getMessage('errorFlowUpdate', [flow.DeveloperName]));
  }
  return flowResult;
}
