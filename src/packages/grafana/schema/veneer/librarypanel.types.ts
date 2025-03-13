import * as raw from '../raw/librarypanel/librarypanel_types';

import { Panel } from './dashboard.types';

export interface LibraryPanel extends raw.LibraryPanel {
  model: Omit<Panel, 'gridPos' | 'id' | 'libraryPanel'>;
}
