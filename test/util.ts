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
