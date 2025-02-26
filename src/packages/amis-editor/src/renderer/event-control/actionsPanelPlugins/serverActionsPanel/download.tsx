import {registerActionPanel} from '../../actionsPanelManager';
import {getSchemaTpl} from 'amis-editor-core';

registerActionPanel('download', {
  label: 'Download file',
  tag: 'service',
  description: 'Trigger download file',
  schema: () => [
    {
      type: 'wrapper',
      className: 'p-none',
      body: [
        getSchemaTpl('apiControl', {
          name: 'api',
          label: 'Configuration request',
          mode: 'horizontal',
          inputClassName: 'm-b-none',
          size: 'lg',
          renderLabel: true,
          required: true
        })
      ]
    }
  ]
});
