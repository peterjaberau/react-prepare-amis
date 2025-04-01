
import { EntityTags } from 'Models';
import { EntityType } from '../../enums/entity.enum';
import { DRAWER_NAVIGATION_OPTIONS } from '../../utils/EntityUtils';
import { SearchedDataProps } from '../SearchedData/SearchedData.interface';

export type DataAssetSummaryPanelProps = {
  tags?: EntityTags[];
  componentType?: DRAWER_NAVIGATION_OPTIONS;
  isLoading?: boolean;
  highlights?: SearchedDataProps['data'][number]['highlight'];
  dataAsset: SearchedDataProps['data'][number]['_source'];
  entityType: EntityType;
};
