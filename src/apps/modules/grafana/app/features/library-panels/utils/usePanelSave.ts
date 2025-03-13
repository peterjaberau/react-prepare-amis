import useAsyncFn from 'react-use/lib/useAsyncFn';

import { isFetchError } from '@runtime/index';
import { useAppNotification } from '@grafana-module/app/core/copy/appNotification';
import { t } from '@grafana-module/app/core/internationalization';
import { PanelModel } from '@grafana-module/app/features/dashboard/state/PanelModel';

import { saveAndRefreshLibraryPanel } from '../utils';

export const usePanelSave = () => {
  const notifyApp = useAppNotification();
  const [state, saveLibraryPanel] = useAsyncFn(async (panel: PanelModel, folderUid: string) => {
    try {
      const libEl = await saveAndRefreshLibraryPanel(panel, folderUid);
      notifyApp.success(t('library-panels.save.success', 'Library panel saved'));
      return libEl;
    } catch (err) {
      if (isFetchError(err)) {
        err.isHandled = true;
        notifyApp.error(
          t('library-panels.save.error', 'Error saving library panel: "{{errorMsg}}"', {
            errorMsg: err.message ?? err.data.message,
          })
        );
      }
      throw err;
    }
  }, []);

  return { state, saveLibraryPanel };
};
