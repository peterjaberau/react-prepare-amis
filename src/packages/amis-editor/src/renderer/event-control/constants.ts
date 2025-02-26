// Pull down to display the range of assignable attributes
export const SELECT_PROPS_CONTAINER = ['form'];

//Whether to pull down to display assignable attributes
export const SHOW_SELECT_PROP = `${JSON.stringify(
  SELECT_PROPS_CONTAINER
)}.includes(this.__rendererName)`;

// Static form item components are not supported (reverse enumeration is because there are too many form item components)
export const NO_SUPPORT_STATIC_FORMITEM_CMPTS = [
  'button-toolbar',
  'condition-builder',
  'diff-editor',
  'editor',
  'formula',
  'hidden',
  'icon-picker',
  'input-excel',
  'input-file',
  'input-formula',
  'input-image',
  'input-repeat',
  'input-rich-text',
  'input-sub-form',
  'input-table',
  'picker',
  'uuid'
];

export const SUPPORT_DISABLED_CMPTS = [
  'button-group',
  'action',
  'button',
  'submit',
  'reset',
  'collapse',
  'container',
  'dropdown-button',
  'flex',
  'flex-item',
  'grid',
  'grid-2d',
  'link',
  'not',
  'wizard'
  // 'card2'
];
