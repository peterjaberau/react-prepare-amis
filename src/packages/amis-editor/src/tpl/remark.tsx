import {setSchemaTpl} from 'amis-editor-core';
import {remarkTpl} from '../component/BaseControl';

setSchemaTpl('remark', () =>
  remarkTpl({
    name: 'remark',
    label: 'Control prompt',
    labelRemark:
      'Show a prompt next to the input control. Note that the control width needs to be set, otherwise the prompt trigger icon will automatically wrap.'
  })
);

setSchemaTpl('labelRemark', () =>
  remarkTpl({
    name: 'labelRemark',
    label: 'Title Tip',
    labelRemark: 'Show hint next to title'
  })
);
