
import { Col, Row } from 'antd';
import { get, isEmpty } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Table } from '../../generated/entity/data/table';
import { getCurrentMillis } from '../../utils/date-time/DateTimeUtils';
import {
  getEntityChildDetails,
  getSortedTagsWithHighlight,
} from '../../utils/EntitySummaryPanelUtils';
import {
  DRAWER_NAVIGATION_OPTIONS,
  getEntityOverview,
} from '../../utils/EntityUtils';

import { PROFILER_FILTER_RANGE } from '../../constants/profiler.constant';
import { EntityType } from '../../enums/entity.enum';
import { Chart } from '../../generated/entity/data/chart';
import { Dashboard } from '../../generated/entity/data/dashboard';
import { getListTestCaseIncidentStatus } from '../../rest/incidentManagerAPI';
import { fetchCharts } from '../../utils/DashboardDetailsUtils';
import { getEpochMillisForPastDays } from '../../utils/date-time/DateTimeUtils';
import SummaryPanelSkeleton from '../common/Skeleton/SummaryPanelSkeleton/SummaryPanelSkeleton.component';
import SummaryTagsDescription from '../common/SummaryTagsDescription/SummaryTagsDescription.component';
import CommonEntitySummaryInfo from '../Explore/EntitySummaryPanel/CommonEntitySummaryInfo/CommonEntitySummaryInfo';
import TableSummary from '../Explore/EntitySummaryPanel/TableSummary/TableSummary.component';
import { DataAssetSummaryPanelProps } from './DataAssetSummaryPanel.interface';

export const DataAssetSummaryPanel = ({
  dataAsset,
  entityType,
  isLoading = false,
  tags,
  componentType = DRAWER_NAVIGATION_OPTIONS.explore,
  highlights,
}: DataAssetSummaryPanelProps) => {
  const [additionalInfo, setAdditionalInfo] = useState<
    Record<string, number | string>
  >({});
  const [charts, setCharts] = useState<Chart[]>([]);


  const entityInfo = useMemo(
    () => getEntityOverview(entityType, dataAsset, additionalInfo),
    [dataAsset, additionalInfo]
  );

  const entityDetails = useMemo(() => {
    return getEntityChildDetails(
      entityType,
      entityType === EntityType.DASHBOARD
        ? ({ ...dataAsset, charts } as any)
        : dataAsset,
      highlights
    );
  }, [dataAsset, entityType, highlights]);

  const isEntityDeleted = useMemo(() => dataAsset.deleted, [dataAsset]);

  const fetchIncidentCount = useCallback(async () => {
    if (dataAsset?.fullyQualifiedName) {
      try {
        const { paging } = await getListTestCaseIncidentStatus({
          limit: 0,
          latest: true,
          originEntityFQN: dataAsset?.fullyQualifiedName,
          startTs: getEpochMillisForPastDays(
            PROFILER_FILTER_RANGE.last30days.days
          ),
          endTs: getCurrentMillis(),
        });

        setAdditionalInfo({
          incidentCount: paging.total,
        });
      } catch (error) {
        setAdditionalInfo({
          incidentCount: 0,
        });
      }
    }
  }, [dataAsset?.fullyQualifiedName]);

  const fetchChartsDetails = useCallback(async () => {
    try {
      const chartDetails = await fetchCharts((dataAsset as Dashboard).charts);

      setCharts(chartDetails);
    } catch (err) {
      // Error
    }
  }, [dataAsset]);

  const fetchEntityBasedDetails = () => {
    switch (entityType) {
      case EntityType.TABLE:
        fetchIncidentCount();

        break;
      case EntityType.DASHBOARD:
        fetchChartsDetails();

        break;
      default:
        break;
    }
  };

  const init = useCallback(async () => {
    if (dataAsset.id) {
      fetchEntityBasedDetails();
    }
  }, [dataAsset, isEntityDeleted]);


  const commonEntitySummaryInfo = useMemo(() => {
    switch (entityType) {
      case EntityType.API_COLLECTION:
      case EntityType.API_ENDPOINT:
      case EntityType.API_SERVICE:
      case EntityType.CHART:
      case EntityType.CONTAINER:
      case EntityType.DASHBOARD:
      case EntityType.DASHBOARD_DATA_MODEL:
      case EntityType.DASHBOARD_SERVICE:
      case EntityType.DATABASE:
      case EntityType.DATABASE_SCHEMA:
      case EntityType.DATABASE_SERVICE:
      case EntityType.MESSAGING_SERVICE:
      case EntityType.METRIC:
      case EntityType.MLMODEL:
      case EntityType.MLMODEL_SERVICE:
      case EntityType.PIPELINE:
      case EntityType.PIPELINE_SERVICE:
      case EntityType.SEARCH_INDEX:
      case EntityType.SEARCH_SERVICE:
      case EntityType.STORAGE_SERVICE:
      case EntityType.STORED_PROCEDURE:
      case EntityType.TABLE:
      case EntityType.TOPIC:
        return (
          <>
            {entityInfo.some((info) =>
              info.visible?.includes(componentType)
            ) && (
              <Row
                className="p-md border-radius-card summary-panel-card"
                gutter={[0, 4]}>
                <Col span={24}>
                  <CommonEntitySummaryInfo
                    componentType={componentType}
                    entityInfo={entityInfo}
                  />
                </Col>
              </Row>
            )}
            {entityType === EntityType.TABLE && (
              <TableSummary entityDetails={dataAsset as Table} />
            )}

            <SummaryTagsDescription
              entityDetail={dataAsset}
              tags={
                tags ??
                getSortedTagsWithHighlight(
                  dataAsset.tags,
                  get(highlights, 'tag.name')
                )
              }
            />
          </>
        );
      case EntityType.GLOSSARY_TERM:
      case EntityType.TAG:
      case EntityType.DATA_PRODUCT:
      default:
        return null;
    }
  }, [entityType, dataAsset, entityInfo, componentType]);

  useEffect(() => {
    init();
  }, [dataAsset.id]);

  return (
    <SummaryPanelSkeleton loading={isLoading || isEmpty(dataAsset)}>
      <div className="d-flex flex-col gap-5">
        {commonEntitySummaryInfo}

        {entityDetails}
      </div>
    </SummaryPanelSkeleton>
  );
};
