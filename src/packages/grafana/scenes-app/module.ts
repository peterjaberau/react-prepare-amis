import { AppPlugin } from '@data/index';
import { App } from './components/App';

export const plugin = new AppPlugin<{}>().setRootPage(App);
