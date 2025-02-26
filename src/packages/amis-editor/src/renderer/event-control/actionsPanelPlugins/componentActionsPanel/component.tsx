import {registerActionPanel} from '../../actionsPanelManager';
import {renderCmptActionSelect} from './helper';

registerActionPanel('component', {
  label: 'Component feature action',
  tag: 'component',
  description: 'Trigger the characteristic action of the selected component',
  supportComponents: '*',
  schema: () => renderCmptActionSelect('target component', true)
});
