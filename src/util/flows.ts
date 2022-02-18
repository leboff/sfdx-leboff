import { Connection, SfdxError, Messages } from '@salesforce/core';
import { RecordResult } from 'jsforce';

export interface FlowOptions {
  developername: string;
  namespaceprefix: string;
}

export interface FlowDefinition {
  Id: string;
  ActiveVersionId: string;
  DeveloperName: string;
  LatestVersionId: string;
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

  let flowDefinitionQuery = `Select Id, ActiveVersionId, DeveloperName, LatestVersionId from FlowDefinition where DeveloperName = '${developername}'`;

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
