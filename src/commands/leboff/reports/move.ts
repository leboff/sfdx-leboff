/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson, JsonMap, JsonCollection } from '@salesforce/ts-types';
import * as pLimit from 'p-limit';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-leboff', 'reports');

interface Folder {
  Id: string;
  DeveloperName: string;
  NamespacePrefix: string;
}
interface ReportSObject {
  Id: string;
  DeveloperName: string;
  FolderName: string;
  NamespacePrefix: string;
}
type ReportMetadata = {
  [name: string]: AnyJson;
};

export default class ReportsMove extends SfdxCommand {
  public static description = messages.getMessage('move.commandDescription');

  public static examples = messages.getMessage('move.examples').split(os.EOL);

  public static args = [];

  protected static flagsConfig = {
    developername: flags.string({
      char: 'n',
      description: messages.getMessage('developernameFlagDescription'),
    }),
    whereclause: flags.string({
      char: 'c',
      description: messages.getMessage('whereclauseFlagDescription'),
    }),
    foldername: flags.string({
      char: 'f',
      description: messages.getMessage('foldernameFlagDescription'),
      required: true,
    }),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const { developername, whereclause, foldername } = this.flags as {
      developername: string;
      whereclause: string;
      foldername: string;
    };

    const updateReport = function (id: string, data: JsonMap): Promise<JsonCollection> {
      const url = [conn._baseUrl(), 'analytics', 'reports', id].join('/');
      const params = {
        method: 'PATCH',
        url,
        body: JSON.stringify(data),
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return conn.request(params);
    };

    /**
     * Validate Options
     */

    if (!developername && !whereclause) {
      throw new SfdxError(messages.getMessage('errorMissingOption'));
    }
    if (developername && whereclause) {
      throw new SfdxError(messages.getMessage('errorTooManyOption'));
    }

    const conn = this.org.getConnection();

    /**
     * Get Folder
     */
    this.ux.startSpinner(`Retrieving folder info`);
    const folderQuery = `Select Id, DeveloperName FROM Folder WHERE Type = 'Report' AND DeveloperName = '${foldername}' LIMIT 1`;

    const folderResults = await conn.query<Folder>(folderQuery);
    if (!folderResults.records || folderResults.records.length <= 0) {
      throw new SfdxError(messages.getMessage('errorFolderNotFound', [developername]));
    }

    const folder = folderResults.records[0];
    this.ux.stopSpinner();
    /**
     * Get Reports
     */

    this.ux.startSpinner(`Retrieving report info`);
    let reportQuery = `Select Id, DeveloperName, FolderName FROM Report`;
    if (developername) {
      reportQuery += ` WHERE DeveloperName = '${developername}'`;
    }
    if (whereclause) {
      reportQuery += ` WHERE ${whereclause}`;
    }

    const reportResults = await conn.query<ReportSObject>(reportQuery);
    if (!reportResults.records || reportResults.records.length <= 0) {
      throw new SfdxError(
        messages.getMessage('errorReportNotFound', [developername || whereclause])
      );
    }
    const reports = reportResults.records;
    this.ux.stopSpinner();
    /**
     * Move Reports
     * For each report describe the report, then patch the report metadata with new folder and buckets if needed
     */

    this.ux.startSpinner(
      messages.getMessage('move.moving', [reports.length, folder.DeveloperName])
    );

    const promises = reports.map(async (report) => {
      return pLimit(1)(async () => {
        const reportDescribe = (await (
          await conn.analytics.report(report.Id)
        ).describe()) as ReportMetadata;

        const reportMetadata: ReportMetadata = {
          folderId: folder.Id,
        };

        if (reportDescribe.buckets) {
          reportMetadata.buckets = reportDescribe.buckets;
        }
        return updateReport(report.Id, {
          reportMetadata,
        });
      });
    });
    const result = await Promise.all(promises);
    this.ux.stopSpinner();
    return result;
  }
}
