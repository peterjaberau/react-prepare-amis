import { Col, Row } from 'antd';
import { uniqueId } from 'lodash';
import React from 'react';
import { getSkeletonMockData } from '../../../../utils/Skeleton.utils';
import ButtonSkeleton from '../CommonSkeletons/ControlElements/ControlElements.component';
import LabelCountSkeleton from '../CommonSkeletons/LabelCountSkeleton/LabelCountSkeleton.component';
import { SkeletonInterface } from '../Skeleton.interfaces';

const SummaryPanelSkeleton = ({ loading, children }: SkeletonInterface) => {
  return loading ? (
    <div className="m-b-md p-md">
      <Row gutter={32} justify="space-between">
        <Col className="m-t-md" span={24}>
          {getSkeletonMockData(5).map(() => (
            <LabelCountSkeleton
              isCount
              isLabel
              firstColSize={8}
              key={uniqueId()}
              secondColSize={16}
              title={{
                width: 100,
              }}
            />
          ))}
        </Col>

        <Col className="m-l-xss" span={24}>
          {getSkeletonMockData(10).map(() => (
            <ButtonSkeleton key={uniqueId()} size="large" />
          ))}
        </Col>
      </Row>
    </div>
  ) : (
    children
  );
};

export default SummaryPanelSkeleton;
