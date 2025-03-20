import { useState } from 'react';

import { PluginType } from '@data/index';
import { Page } from '~/core/components/Page/Page';
import UpdateAllButton from '~/features/plugins/admin/components/UpdateAllButton';
import UpdateAllModal from '~/features/plugins/admin/components/UpdateAllModal';
import { useGetUpdatable } from '~/features/plugins/admin/state/hooks';

import { AddNewConnection } from '../tabs/ConnectData';

export function AddNewConnectionPage() {
  const { isLoading: areUpdatesLoading, updatablePlugins } = useGetUpdatable();
  const updatableDSPlugins = updatablePlugins.filter((plugin) => plugin.type === PluginType.datasource);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const disableUpdateAllButton = updatableDSPlugins.length <= 0 || areUpdatesLoading;

  const onUpdateAll = () => {
    setShowUpdateModal(true);
  };

  const updateAllButton = (
    <UpdateAllButton
      disabled={disableUpdateAllButton}
      onUpdateAll={onUpdateAll}
      updatablePluginsLength={updatableDSPlugins.length}
    />
  );

  return (
    <Page navId={'connections-add-new-connection'} actions={updateAllButton}>
      <Page.Contents>
        <AddNewConnection />
        <UpdateAllModal
          isOpen={showUpdateModal}
          isLoading={areUpdatesLoading}
          onDismiss={() => setShowUpdateModal(false)}
          plugins={updatableDSPlugins}
        />
      </Page.Contents>
    </Page>
  );
}
