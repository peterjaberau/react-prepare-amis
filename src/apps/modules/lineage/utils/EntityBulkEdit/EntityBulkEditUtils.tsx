
import Icon from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { ReactComponent as IconEdit } from '../../assets/svg/edit-new.svg';
import { ROUTES } from '../../constants/constants';
import { EntityType } from '../../enums/entity.enum';
import {
  exportDatabaseDetailsInCSV,
  exportDatabaseSchemaDetailsInCSV,
} from '../../rest/databaseAPI';
import { exportDatabaseServiceDetailsInCSV } from '../../rest/serviceAPI';
import { exportTableDetailsInCSV } from '../../rest/tableAPI';
import entityUtilClassBase from '../EntityUtilClassBase';
import Fqn from '../Fqn';
import i18n from '../i18next/LocalUtil';

export const isBulkEditRoute = (pathname: string) => {
  return pathname.includes(ROUTES.BULK_EDIT_ENTITY);
};

export const getBulkEntityEditBreadcrumbList = (
  entityType: EntityType,
  fqn: string
): TitleBreadcrumbProps['titleLinks'] => [
  {
    name: Fqn.split(fqn).pop(),
    url: entityUtilClassBase.getEntityLink(entityType, fqn),
  },
  {
    name: i18n.t('label.bulk-edit'),
    url: '',
    activeTitle: true,
  },
];

export const getBulkEditCSVExportEntityApi = (entityType: EntityType) => {
  switch (entityType) {
    case EntityType.DATABASE_SERVICE:
      return exportDatabaseServiceDetailsInCSV;

    case EntityType.DATABASE:
      return exportDatabaseDetailsInCSV;

    case EntityType.DATABASE_SCHEMA:
      return exportDatabaseSchemaDetailsInCSV;

    case EntityType.TABLE:
      return exportTableDetailsInCSV;

    default:
      return exportTableDetailsInCSV;
  }
};

export const getBulkEditButton = (
  hasPermission: boolean,
  onClickHandler: () => void
) => {
  return hasPermission ? (
    <Button
      className="text-primary p-0"
      data-testid="bulk-edit-table"
      icon={<Icon component={IconEdit} />}
      type="text"
      onClick={onClickHandler}>
      {i18n.t('label.edit')}
    </Button>
  ) : null;
};
