import classNames from 'classnames';
import React, { ReactNode } from 'react';
import { EntityType } from '../../../enums/entity.enum';
import { getEntityLinkFromType } from '../../../utils/EntityUtils';
import EntityHeaderTitle from '../EntityHeaderTitle/EntityHeaderTitle.component';

interface Props {
  breadcrumb: any;
  entityData: {
    displayName?: string;
    name: string;
    fullyQualifiedName?: string;
    deleted?: boolean;
  };
  entityType?: EntityType;
  icon: ReactNode;
  titleIsLink?: boolean;
  openEntityInNewPage?: boolean;
  gutter?: 'default' | 'large';
  serviceName: string;
  titleColor?: string;
  badge?: React.ReactNode;
  showName?: boolean;
}

export const EntityHeader = ({
  breadcrumb,
  entityData,
  icon,
  titleIsLink = false,
  entityType,
  openEntityInNewPage,
  gutter = 'default',
  serviceName,
  badge,
  titleColor,
  showName = true,
}: Props) => {

  return (
    <div
      className="w-full"
      onContextMenu={(e) =>
        // @ts-ignore
        window.updatePopupContent(
          {
            data: { component: 'EntityHeader' },
            logs: {},
          },
          e.target
        )
      }
      style={{ border: '2px solid black' }}>
      <div
        className={classNames(
          'entity-breadcrumb',
          gutter === 'large' ? 'm-b-sm' : 'm-b-xss'
        )}
        data-testid="category-name">
      </div>

      <EntityHeaderTitle
        badge={badge}
        color={titleColor}
        deleted={entityData.deleted}
        displayName={entityData.displayName}
        icon={icon}
        link={
          titleIsLink && entityData.fullyQualifiedName && entityType
            ? getEntityLinkFromType(entityData.fullyQualifiedName, entityType)
            : undefined
        }
        name={entityData.name}
        openEntityInNewPage={openEntityInNewPage}
        serviceName={serviceName}
        showName={showName}
      />
    </div>
  );
};
