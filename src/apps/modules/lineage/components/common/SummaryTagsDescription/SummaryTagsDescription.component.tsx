
import { Col, Row, Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import TagsViewer from '../../../components/Tag/TagsViewer/TagsViewer';
import { BasicEntityInfo } from '../../Explore/EntitySummaryPanel/SummaryList/SummaryList.interface';
import { DisplayType } from '../../Tag/TagsViewer/TagsViewer.interface';
import RichTextEditorPreviewerV1 from '../RichTextEditor/RichTextEditorPreviewerV1';

export interface EntityWithDescription {
  description?: string;
}

const SummaryTagsDescription = ({
  tags = [],
  entityDetail,
}: {
  tags: BasicEntityInfo['tags'];
  entityDetail: EntityWithDescription;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Row
        className="p-md border-radius-card summary-panel-card"
        gutter={[0, 8]}>
        <Col span={24}>
          <Typography.Text
            className="summary-panel-section-title"
            data-testid="tags-header">
            {t('label.tag-plural')}
          </Typography.Text>
        </Col>
        <Col className="d-flex flex-wrap gap-2" span={24}>
          {tags.length > 0 ? (
            <TagsViewer
              displayType={DisplayType.READ_MORE}
              sizeCap={6}
              tags={tags}
            />
          ) : (
            <Typography.Text className="text-sm no-data-chip-placeholder">
              {t('label.no-tags-added')}
            </Typography.Text>
          )}
        </Col>
      </Row>

      <Row
        className="p-md border-radius-card summary-panel-card"
        gutter={[0, 8]}>
        <Col span={24}>
          <Typography.Text
            className="summary-panel-section-title"
            data-testid="description-header">
            {t('label.description')}
          </Typography.Text>
        </Col>
        <Col span={24}>
          <div>
            {entityDetail.description?.trim() ? (
              <RichTextEditorPreviewerV1
                markdown={entityDetail.description}
                maxLength={200}
              />
            ) : (
              <Typography className="no-data-chip-placeholder">
                {t('label.no-data-found')}
              </Typography>
            )}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default SummaryTagsDescription;
