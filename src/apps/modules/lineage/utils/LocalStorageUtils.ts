import { OM_SESSION_KEY } from '../hooks/useApplicationStore';

export const getOidcToken = (): string => {
  return (
    JSON.parse(localStorage.getItem(OM_SESSION_KEY) ?? '{}')?.oidcIdToken ?? ''
  );
};

export const setOidcToken = (token: string) => {
  const session = JSON.parse(localStorage.getItem(OM_SESSION_KEY) ?? '{}');

  session.oidcIdToken = token;
  localStorage.setItem(OM_SESSION_KEY, JSON.stringify(session));
};

export const getRefreshToken = (): string => {
  return (
    JSON.parse(localStorage.getItem(OM_SESSION_KEY) ?? '{}')?.refreshTokenKey ??
    ''
  );
};

export const setRefreshToken = (token: string) => {
  const session = JSON.parse(localStorage.getItem(OM_SESSION_KEY) ?? '{}');

  session.refreshTokenKey = token;
  localStorage.setItem(OM_SESSION_KEY, JSON.stringify(session));
};
