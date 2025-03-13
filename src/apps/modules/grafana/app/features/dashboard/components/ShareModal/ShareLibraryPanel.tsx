import { useEffect } from 'react';

import { reportInteraction } from '@runtime/index';
import { Trans } from '@grafana-module/app/core/internationalization';
import { AddLibraryPanelContents } from '@grafana-module/app/features/library-panels/components/AddLibraryPanelModal/AddLibraryPanelModal';

import { ShareModalTabProps } from './types';
import { getTrackingSource } from './utils';

interface Props extends ShareModalTabProps {
  initialFolderUid?: string;
}

export const ShareLibraryPanel = ({ panel, initialFolderUid, onCreateLibraryPanel, onDismiss }: Props) => {
  useEffect(() => {
    reportInteraction('grafana_dashboards_library_panel_share_viewed', { shareResource: getTrackingSource(panel) });
  }, [panel]);

  if (!panel) {
    return null;
  }

  return (
    <>
      <p>
        <Trans i18nKey="share-modal.library.info">Create library panel.</Trans>
      </p>
      <AddLibraryPanelContents
        panel={panel}
        initialFolderUid={initialFolderUid}
        onCreateLibraryPanel={onCreateLibraryPanel}
        onDismiss={onDismiss}
      />
    </>
  );
};
