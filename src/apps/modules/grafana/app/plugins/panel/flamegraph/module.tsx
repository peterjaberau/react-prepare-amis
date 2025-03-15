import { PanelPlugin } from '@data/index';

import { FlameGraphPanel } from './FlameGraphPanel';
import { FlameGraphSuggestionsSupplier } from './suggestions';

export const plugin = new PanelPlugin(FlameGraphPanel).setSuggestionsSupplier(new FlameGraphSuggestionsSupplier());
