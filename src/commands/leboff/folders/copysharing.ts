/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';

import { AnyJson } from '@salesforce/ts-types';

import AnalyticsApi, { ShareFolder } from '../../../util/analytics';

interface Folder {
  Id: string;
  DeveloperName: string;
  NamespacePrefix: string;
}

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-leboff', 'folders');

export default class FoldersCopySharing extends SfdxCommand {
  public static description = messages.getMessage('copysharing.commandDescription');

  public static examples = messages.getMessage('copysharing.examples').split(os.EOL);

  public static args = [];

  protected static flagsConfig = {
    sourcefolder: flags.string({
      char: 's',
      description: messages.getMessage('sourcefolderFlagDescription'),
      required: true,
    }),
    sourcenamespace: flags.string({
      char: 'n',
      default: '',
      description: messages.getMessage('sourcenamespaceFlagDescription'),
    }),
    targetfolder: flags.string({
      char: 't',
      description: messages.getMessage('targetfolderFlagDescription'),
      required: true,
    }),
    targetnamespace: flags.string({
      char: 'e',
      default: '',
      description: messages.getMessage('targetnamespaceFlagDescription'),
    }),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {
    const { sourcefolder, targetfolder, sourcenamespace, targetnamespace } = this.flags as {
      sourcefolder: string;
      targetfolder: string;
      sourcenamespace: string;
      targetnamespace: string;
    };
    const conn = this.org.getConnection();
    const api = new AnalyticsApi(conn);

    this.ux.startSpinner(
      messages.getMessage('copysharing.inprogress', [
        `${sourcenamespace}${sourcenamespace && '__'}${sourcefolder}`,
        `${targetnamespace}${targetnamespace && '__'}${targetfolder}`,
      ])
    );
    // Get Folder Ids
    const folderQuery = `SELECT Id, DeveloperName, NamespacePrefix FROM Folder WHERE (DeveloperName = '${sourcefolder}' AND NamespacePrefix = '${sourcenamespace}') OR (DeveloperName = '${targetfolder}' AND NamespacePrefix = '${targetnamespace}')`;

    const folderResults = await conn.query<Folder>(folderQuery);

    if (!folderResults.records || folderResults.records.length <= 1) {
      throw new SfdxError(
        messages.getMessage('errorDashboardNotFound', [
          `${sourcenamespace}${sourcenamespace && '__'}${sourcefolder}`,
          `${targetnamespace}${targetnamespace && '__'}${targetfolder}`,
        ])
      );
    }

    const sourceFolderMetadata = folderResults.records.find(
      (folder) =>
        folder.DeveloperName === sourcefolder &&
        folder.NamespacePrefix === (sourcenamespace || null)
    );
    const targetFolderMetadata = folderResults.records.find(
      (folder) =>
        folder.DeveloperName === targetfolder &&
        folder.NamespacePrefix === (targetnamespace || null)
    );

    const sourceShares = await api.getFolderShares(sourceFolderMetadata.Id);
    const targetShares = await api.getFolderShares(targetFolderMetadata.Id);

    const targetShareFolders: ShareFolder[] = sourceShares.shares.reduce<ShareFolder[]>(
      (acc, share) => {
        const targetShare = targetShares.shares.find(
          (target) => target.sharedWithId === share.sharedWithId
        );

        if (targetShare) {
          return acc;
        } else {
          acc.push({
            accessType: share.accessType,
            shareWithId: share.sharedWithId,
            shareType: share.shareType,
          });
        }
        return acc;
      },
      []
    );

    const shareResults = await api.createFolderShares(targetFolderMetadata.Id, {
      shares: targetShareFolders,
    });

    this.ux.stopSpinner();
    return shareResults;
  }
}
