import { createSelector } from '@reduxjs/toolkit';

import { RootState } from '~/store/configureStore';

import { Repository, provisioningAPI } from '../../../api/clients/provisioning/index';

const emptyRepos: Repository[] = [];

const baseSelector = provisioningAPI.endpoints.listRepository.select({});

export const selectAllRepos = createSelector(baseSelector, (result) => result.data?.items || emptyRepos);

export const selectFolderRepository = createSelector(
  selectAllRepos,
  (_, folderUid?: string) => folderUid,
  (repositories: Repository[], folderUid) => {
    if (!folderUid) {
      return undefined;
    }
    return repositories.find((repo: Repository) => repo.metadata?.name === folderUid);
  }
);

export const selectRepoByName = createSelector(
  selectAllRepos,
  (state: RootState, id: string) => id,
  (repositories: Repository[], name) => repositories.find((repo: Repository) => repo.metadata?.name === name)
);
