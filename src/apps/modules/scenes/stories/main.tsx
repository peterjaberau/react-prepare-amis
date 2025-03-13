import { AppPlugin } from '@data/index'
import { App } from './App'
import { AppConfig } from './AppConfig'

export const plugin = () => {
  const rootPageSetter =   new AppPlugin<{}>().setRootPage(App);

  console.log('---rootPageSetter---', rootPageSetter);

  const configPageSetter = rootPageSetter.addConfigPage({
    title: 'Configuration',
    icon: 'cog',
    body: AppConfig,
    id: 'configuration',
  });


  console.log('---configPageSetter---', configPageSetter);
}
