import { ReactNode } from 'react';

import { ScopesContext } from '@runtime/index';

import { ScopesService } from './ScopesService';

interface ScopesContextProviderProps {
  children: ReactNode;
}

export const ScopesContextProvider = ({ children }: ScopesContextProviderProps) => {
  return <ScopesContext.Provider value={ScopesService.instance}>{children}</ScopesContext.Provider>;
};
