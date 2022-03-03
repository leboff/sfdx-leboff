import { Connection } from '@salesforce/core';
import { AnyJson, JsonCollection, JsonMap } from '@salesforce/ts-types';
import { RequestParams } from 'jsforce';

export interface FolderShare {
  accessType: string;
  shareType: string;
  sharedWithId: string;
  shareId: string;
  sharedWithLabel: string;
  url?: string;
}
export interface ShareFolder {
  accessType: string;
  shareType: string;
  shareWithId: string;
}
export interface FolderShares {
  shares: FolderShare[];
}
export interface ShareFolders {
  shares: ShareFolder[];
}

export default class AnalyticsApi {
  protected conn: Connection;
  public constructor(conn: Connection) {
    this.conn = conn;
  }

  public updateDashboard(id: string, data: AnyJson): Promise<JsonCollection> {
    const params = this.buildParams('PATCH', ['analytics', 'dashboards', id], data);
    return this.conn.request(params);
  }

  public updateReport(id: string, data: JsonMap): Promise<JsonCollection> {
    const params = this.buildParams('PATCH', ['analytics', 'reports', id], data);
    return this.conn.request(params);
  }

  public createFolderShares(id: string, data: ShareFolders): Promise<JsonCollection> {
    const params = this.buildParams(
      'POST',
      ['folders', id, 'shares'],
      JSON.parse(JSON.stringify(data))
    );
    return this.conn.request(params);
  }

  public getFolderShares(id: string): Promise<FolderShares> {
    const params = this.buildParams('GET', ['folders', id, 'shares'], null);

    return this.conn.request(params);
  }

  protected urlFor(path: string[]): string {
    return [this.conn._baseUrl()].concat(path).join('/');
  }

  protected buildParams(method: string, path: string[], body: AnyJson): RequestParams {
    const params: RequestParams = {
      method,
      url: this.urlFor(path),
    };
    if (body) {
      params.body = JSON.stringify(body);
    }
    return params;
  }
}
