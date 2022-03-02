import { AnyJson, JsonMap, ensureString } from '@salesforce/ts-types';
export interface RequestHandler {
  handle(requestMap: JsonMap): Promise<AnyJson> | void;
}
export function requestHelper(
  funcs: RequestHandler[],
  requestMap: JsonMap
): Promise<AnyJson> | void {
  let idx = 0;
  let ret: Promise<AnyJson> | void;
  do {
    const func = funcs[idx];
    ret = func.handle(requestMap);
    idx++;
  } while (ret === undefined);

  return ret;
}

export class QueryReport implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/FROM%20Report/.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'GET') {
        return Promise.resolve({
          records: [
            {
              Id: '123',
              DeveloperName: 'Test_Report',
              FolderName: 'Test_Folder_Src',
              NamespacePrefix: null,
            },
          ],
        });
      }
    }
  }
}

export class QueryFolder implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/FROM%20Folder/.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'GET') {
        return Promise.resolve({
          records: [
            {
              Id: '456',
              DeveloperName: 'Test_Folder_Tgt',
              NamespacePrefix: null,
            },
          ],
        });
      }
    }
  }
}

export class QueryReportNotFound implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/asdfasdf/.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'GET') {
        return Promise.resolve({
          records: [],
        });
      }
    }
  }
}

export class DescribeReport implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/describe/.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'GET') {
        return Promise.resolve({
          reportMetadata: {
            id: '123',
            folderId: '789',
          },
        });
      }
    }
  }
}

export class DescribeReportWithBuckets implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/describe/.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'GET') {
        return Promise.resolve({
          reportMetadata: {
            id: '123',
            folderId: '789',
            buckets: [
              {
                name: 'test',
              },
            ],
          },
        });
      }
    }
  }
}
export class PatchReport implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/analytics\/reports/.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'PATCH') {
        return Promise.resolve({
          reportMetadata: {},
        });
      }
    }
  }
}

export class QueryFlowDefinition implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/from%20FlowDefinition/.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'GET') {
        return Promise.resolve({
          records: [
            {
              Id: '123',
              ActiveVersionId: '456',
              DeveloperName: 'Test_Flow',
              LatestVersionId: '7891',
              NamespacePrefix: 'test',
            },
          ],
        });
      }
    }
  }
}

export class QueryFlowDefinitionNotFound implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/from%20FlowDefinition/.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'GET') {
        return Promise.resolve({
          records: [],
        });
      }
    }
  }
}

export class QueryFlowDefinitionInactive implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/from%20FlowDefinition/.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'GET') {
        return Promise.resolve({
          records: [
            {
              Id: '123',
              ActiveVersionId: null,
              DeveloperName: 'Test_Flow',
              LatestVersionId: '7891',
              NamespacePrefix: 'test',
            },
          ],
        });
      }
    }
  }
}

export class PatchFlowDefinition implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/FlowDefinition\/123/.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'PATCH') {
        return Promise.resolve({
          id: '123',
          success: true,
        });
      }
    }
  }
}

export class PatchFlowDefinitionFail implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/FlowDefinition\/123/.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'PATCH') {
        return Promise.resolve({
          success: false,
        });
      }
    }
  }
}

export class QueryFlow implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/Flow%20/.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'GET') {
        return Promise.resolve({
          records: [
            {
              Id: '123',
            },
            {
              Id: '456',
            },
          ],
        });
      }
    }
  }
}

export class QueryFlowEmpty implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/Flow%20/.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'GET') {
        return Promise.resolve({
          records: [],
        });
      }
    }
  }
}

export class DeleteFlow implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/Flow\//.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'DELETE') {
        return Promise.resolve({});
      }
    }
  }
}

export class DeleteFlowError implements RequestHandler {
  public handle(requestMap: JsonMap): Promise<AnyJson> | void {
    if (/Flow\//.exec(ensureString(requestMap.url))) {
      if (requestMap.method === 'DELETE') {
        return Promise.resolve({
          success: false,
          errors: ['failure!!'],
        });
      }
    }
  }
}
