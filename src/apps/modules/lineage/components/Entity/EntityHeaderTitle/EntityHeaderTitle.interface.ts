
import { EntityType } from '../../../enums/entity.enum';

export interface EntityHeaderTitleProps {
  className?: string;
  icon: React.ReactNode;
  showOnlyDisplayName?: boolean;
  name: string;
  displayName?: string;
  link?: string;
  color?: string;
  openEntityInNewPage?: boolean;
  deleted?: boolean;
  serviceName: string;
  badge?: React.ReactNode;
  isDisabled?: boolean;
  showName?: boolean;
  excludeEntityService?: boolean;
  isFollowing?: boolean;
  isFollowingLoading?: boolean;
  handleFollowingClick?: () => void;
  followers?: number;
  entityType?: EntityType;
  nameClassName?: string;
  displayNameClassName?: string;
  isCustomizedView?: boolean;
}
