
import { startCase } from 'lodash';
import { ResourceEntity } from '../context/PermissionProvider/PermissionProvider.interface';
import { EntityType } from '../enums/entity.enum';
import i18n from '../utils/i18next/LocalUtil';

export const SUPPORTED_BULK_IMPORT_EDIT_ENTITY = [
  ResourceEntity.TABLE,
  ResourceEntity.DATABASE_SERVICE,
  ResourceEntity.DATABASE,
  ResourceEntity.DATABASE_SCHEMA,
];

export enum VALIDATION_STEP {
  UPLOAD = 0,
  EDIT_VALIDATE = 1,
  UPDATE = 2,
}

export const ENTITY_IMPORT_STEPS = [
  {
    name: startCase(i18n.t('label.upload-csv-uppercase-file')),
    step: VALIDATION_STEP.UPLOAD,
  },
  {
    name: i18n.t('label.preview-and-edit'),
    step: VALIDATION_STEP.EDIT_VALIDATE,
  },
  {
    name: i18n.t('label.update'),
    step: VALIDATION_STEP.UPDATE,
  },
];

export const ENTITY_TYPE_OPTIONS = [
  {
    label: i18n.t('label.database'),
    value: EntityType.DATABASE,
  },
  {
    label: i18n.t('label.database-schema'),
    value: EntityType.DATABASE_SCHEMA,
  },
  {
    label: i18n.t('label.stored-procedure'),
    value: EntityType.STORED_PROCEDURE,
  },
  {
    label: i18n.t('label.table'),
    value: EntityType.TABLE,
  },
  {
    label: i18n.t('label.column'),
    value: 'column',
  },
];
