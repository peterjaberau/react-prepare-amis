

import { Rule } from 'antd/lib/form';
import { t } from 'i18next';
import { ENTITY_NAME_REGEX } from './regex.constants';

export const NAME_FIELD_RULES: Rule[] = [
  {
    required: true,
    message: t('label.field-required', {
      field: t('label.name'),
    }),
  },
  {
    min: 1,
    max: 128,
    message: t('message.entity-size-in-between', {
      entity: t('label.name'),
      min: 1,
      max: 128,
    }),
  },
  {
    pattern: ENTITY_NAME_REGEX,
    message: t('message.entity-name-validation'),
  },
];
