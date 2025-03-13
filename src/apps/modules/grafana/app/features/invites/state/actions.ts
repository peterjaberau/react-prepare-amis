import { getBackendSrv } from '@runtime/index';
import { contextSrv } from '@grafana-module/app/core/core';
import { FormModel } from '@grafana-module/app/features/org/UserInviteForm';
import { AccessControlAction, createAsyncThunk, Invitee } from '@grafana-module/app/types';

export const fetchInvitees = createAsyncThunk('users/fetchInvitees', async () => {
  if (!contextSrv.hasPermission(AccessControlAction.OrgUsersAdd)) {
    return [];
  }

  const invitees: Invitee[] = await getBackendSrv().get('/api/org/invites');
  return invitees;
});

export const addInvitee = createAsyncThunk('users/addInvitee', async (addInviteForm: FormModel, { dispatch }) => {
  await getBackendSrv().post(`/api/org/invites`, addInviteForm);
  await dispatch(fetchInvitees());
});

export const revokeInvite = createAsyncThunk('users/revokeInvite', async (code: string) => {
  await getBackendSrv().patch(`/api/org/invites/${code}/revoke`, {});
  return code;
});
