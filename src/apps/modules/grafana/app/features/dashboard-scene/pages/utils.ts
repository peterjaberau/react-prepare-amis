import { updateNavIndex } from '@grafana-module/app/core/actions';
import { backendSrv } from '@grafana-module/app/core/services/backend_srv';
import { buildNavModel } from '@grafana-module/app/features/folders/state/navModel';
import { store } from '@grafana-module/app/store/store';

export async function updateNavModel(folderUid: string) {
  try {
    const folder = await backendSrv.getFolderByUid(folderUid);
    store.dispatch(updateNavIndex(buildNavModel(folder)));
  } catch (err) {
    console.warn('Error fetching parent folder', folderUid, 'for dashboard', err);
  }
}
