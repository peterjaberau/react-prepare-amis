import { CloseOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Drawer, Row, Typography } from 'antd';
import { isUndefined } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Node } from 'reactflow';
import { ReactComponent as EditIcon } from '../../../assets/svg/edit-new.svg';
import { DE_ACTIVE_COLOR } from '../../../constants/constants';
import { LINEAGE_SOURCE } from '../../../constants/Lineage.constants';
import { CSMode } from '../../../enums/codemirror.enum';
import { EntityType } from '../../../enums/entity.enum';
import { AddLineage } from '../../../generated/api/lineage/addLineage';
import { Source } from '../../../generated/type/entityLineage';
import { getNameFromFQN } from '../../../utils/CommonUtils';
import {
  getColumnFunctionValue,
  getColumnSourceTargetHandles,
  getLineageDetailsObject,
} from '../../../utils/EntityLineageUtils';
import entityUtilClassBase from '../../../utils/EntityUtilClassBase';
import { getEntityName } from '../../../utils/EntityUtils';
import Loader from '../../common/Loader/Loader';
import SchemaEditor from '../../Database/SchemaEditor/SchemaEditor';
import { ModalWithQueryEditor } from '../../Modals/ModalWithQueryEditor/ModalWithQueryEditor';
import {
  EdgeInfoDrawerInfo,
  EdgeInformationType,
} from './EntityInfoDrawer.interface';

const EdgeInfoDrawer = ({
  edge,
  visible,
  onClose,
  nodes,
  hasEditAccess,
  onEdgeDetailsUpdate,
}: EdgeInfoDrawerInfo) => {
  const [edgeData, setEdgeData] = useState<EdgeInformationType>();
  const [mysqlQuery, setMysqlQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSqlQueryModal, setShowSqlQueryModal] = useState(false);

  const { t } = useTranslation();

  const edgeEntity = useMemo(() => {
    return edge.data.edge;
  }, [edge]);

  const getEdgeInfo = () => {
    const { source, target, data } = edge;
    const { sourceHandle, targetHandle } = getColumnSourceTargetHandles(edge);
    const { pipeline, pipelineEntityType } = data?.edge ?? {};
    const isColumnLineage = sourceHandle && targetHandle;

    let sourceData: Node | undefined, targetData: Node | undefined;
    nodes.forEach((node) => {
      if (source === node.id) {
        sourceData = node;
      } else if (target === node.id) {
        targetData = node;
      }
    });

    const {
      entityType: sourceEntityType = '',
      fullyQualifiedName: sourceFqn = '',
    } = sourceData?.data?.node ?? {};

    const {
      entityType: targetEntityType = '',
      fullyQualifiedName: targetFqn = '',
    } = targetData?.data?.node ?? {};

    setEdgeData({
      sourceData: {
        key: t('label.source'),
        value: sourceData && getEntityName(sourceData?.data?.node),
        link:
          sourceData &&
          entityUtilClassBase.getEntityLink(sourceEntityType, sourceFqn),
      },
      sourceColumn: {
        key: t('label.source-column'),
        value: sourceHandle ? getNameFromFQN(sourceHandle) : undefined,
      },
      targetData: {
        key: t('label.target'),
        value: targetData ? getEntityName(targetData?.data?.node) : undefined,
        link:
          targetData &&
          entityUtilClassBase.getEntityLink(targetEntityType, targetFqn),
      },
      targetColumn: {
        key: t('label.target-column'),
        value: targetHandle ? getNameFromFQN(targetHandle) : undefined,
      },
      pipeline: {
        key: t('label.edge'),
        value: pipeline ? getEntityName(pipeline) : undefined,
        link:
          pipeline &&
          entityUtilClassBase.getEntityLink(
            pipelineEntityType,
            pipeline.fullyQualifiedName
          ),
      },
      functionInfo: {
        key: t('label.function'),
        value: isColumnLineage
          ? getColumnFunctionValue(
              data?.edge?.columns ?? [],
              sourceHandle ?? '',
              targetHandle ?? ''
            )
          : undefined,
      },
    });
    setIsLoading(false);
  };

  const edgeDescription = useMemo(() => {
    return edgeEntity?.description ?? '';
  }, [edgeEntity]);

  const onDescriptionUpdate = useCallback(
    async (updatedHTML: string) => {
      if (edgeDescription !== updatedHTML && edge) {
        const lineageDetails = {
          ...getLineageDetailsObject(edge),
          description: updatedHTML,
        };

        const updatedEdgeDetails = {
          edge: {
            fromEntity: {
              id: edgeEntity.fromEntity.id,
              type: edgeEntity.fromEntity.type,
            },
            toEntity: {
              id: edgeEntity.toEntity.id,
              type: edgeEntity.toEntity.type,
            },
            lineageDetails,
          },
        } as AddLineage;
        await onEdgeDetailsUpdate?.(updatedEdgeDetails);
      }
    },
    [edgeDescription, edgeEntity, edge]
  );

  const onSqlQueryUpdate = useCallback(
    async (updatedQuery: string) => {
      if (mysqlQuery !== updatedQuery && edge) {
        const lineageDetails = {
          ...getLineageDetailsObject(edge),
          sqlQuery: updatedQuery,
        };

        const updatedEdgeDetails = {
          edge: {
            fromEntity: {
              id: edgeEntity.fromEntity.id,
              type: edgeEntity.fromEntity.type,
            },
            toEntity: {
              id: edgeEntity.toEntity.id,
              type: edgeEntity.toEntity.type,
            },
            lineageDetails,
          },
        } as AddLineage;
        await onEdgeDetailsUpdate?.(updatedEdgeDetails);
        setMysqlQuery(updatedQuery);
      }
      setShowSqlQueryModal(false);
    },
    [edgeEntity, edge, mysqlQuery]
  );

  useEffect(() => {
    setIsLoading(true);
    getEdgeInfo();
    setMysqlQuery(edge.data.edge?.sqlQuery);
  }, [edge, visible]);

  return (
    <>
      <Drawer
        destroyOnClose
        bodyStyle={{ padding: 16 }}
        className="entity-panel-container edge-info-drawer"
        closable={false}
        extra={<CloseOutlined onClick={onClose} />}
        getContainer={false}
        headerStyle={{ padding: 16 }}
        mask={false}
        open={visible}
        style={{ position: 'absolute', border: '2px solid black' }}
        title={t('label.edge-information')}
        //@ts-ignore
        onContextMenu={(e) =>
            //@ts-ignore
            window.updatePopupContent(
                {
                  data: { component: 'EdgeInfoDrawer'},
                  logs: {},
                },
                e.target
            )
        }

      >
        {isLoading ? (
          <Loader />
        ) : (
          <Row gutter={[8, 8]}>
            {edgeData &&
              Object.values(edgeData).map(
                (data) =>
                  data.value && (
                    <Col data-testid={data.key} key={data.key} span={24}>
                      <Typography.Text className="m-r-sm summary-panel-section-title">
                        {`${data.key}:`}
                      </Typography.Text>

                      {isUndefined(data.link) ? (
                        <Typography.Text>{data.value}</Typography.Text>
                      ) : (
                        <>
                          {/*<Link to={data.link}>{data.value}</Link>*/}
                        </>
                      )}
                    </Col>
                  )
              )}
            <Col span={24}>
              <Divider />
              {/*
              <DescriptionV1
                description={edgeDescription}
                entityName="Edge"
                entityType={EntityType.LINEAGE_EDGE}
                hasEditAccess={hasEditAccess}
                showCommentsIcon={false}
                onDescriptionUpdate={onDescriptionUpdate}
              />
              */}
            </Col>
            <Col span={24}>
              <Divider />
              <div className="d-flex items-center gap-4 m-b-sm">
                <Typography.Paragraph className="right-panel-label m-b-0">
                  {`${t('label.sql-uppercase-query')}`}
                </Typography.Paragraph>
                {hasEditAccess && (
                  <Button
                    className="p-0 flex-center"
                    data-testid="edit-sql"
                    icon={<EditIcon color={DE_ACTIVE_COLOR} width="14px" />}
                    size="small"
                    type="text"
                    onClick={() => setShowSqlQueryModal(true)}
                  />
                )}
              </div>
              {mysqlQuery ? (
                <SchemaEditor
                  className="edge-drawer-sql-editor"
                  mode={{ name: CSMode.SQL }}
                  options={{
                    styleActiveLine: false,
                    readOnly: 'nocursor',
                  }}
                  value={mysqlQuery}
                />
              ) : (
                <Typography.Paragraph className="m-b-0">
                  {t('server.no-query-available')}
                </Typography.Paragraph>
              )}
            </Col>
            <Col>
              <Divider />
              <Typography.Paragraph className="right-panel-label m-b-sm">
                {`${t('label.lineage-source')}`}
              </Typography.Paragraph>
              <Typography.Text className="m-b-0">
                {LINEAGE_SOURCE[edgeEntity.source as keyof typeof Source]}
              </Typography.Text>
            </Col>
          </Row>
        )}
      </Drawer>
      {showSqlQueryModal && (
        <ModalWithQueryEditor
          header={t('label.edit-entity', {
            entity: t('label.sql-uppercase-query'),
          })}
          value={mysqlQuery ?? ''}
          visible={showSqlQueryModal}
          onCancel={() => setShowSqlQueryModal(false)}
          onSave={onSqlQueryUpdate}
        />
      )}
    </>
  );
};

export default EdgeInfoDrawer;
