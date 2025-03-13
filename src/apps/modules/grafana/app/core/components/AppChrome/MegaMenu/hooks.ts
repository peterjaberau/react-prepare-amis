import { useMemo } from 'react';

import { config } from '@runtime/index';
import { useGetUserPreferencesQuery } from 'app/features/preferences/api';

export const usePinnedItems = () => {
  const preferences = useGetUserPreferencesQuery(undefined, { skip: !config.bootData.user.isSignedIn });
  const pinnedItems = useMemo(() => preferences.data?.navbar?.bookmarkUrls || [], [preferences]);

  if (config.featureToggles.pinNavItems) {
    return pinnedItems;
  }
  return [];
};
