import { EuiFlexGroup, EuiPanel } from "@elastic/eui";
import {
  ArrowsAltOutlined,
  ExpandOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  NodeIndexOutlined,
  SettingOutlined,
  ShrinkOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from '@ant-design/icons';
import React from "react";
import LineageConfigModalRenderer
  from "@/apps/modules/lineage/components/Entity/EntityLineage/LineageConfigModalRenderer.tsx";

export const LineageControlButtonsRenderer = (props: any) => {
  const [dialogVisible, setDialogVisible] = React.useState(false);

  return (
    <EuiPanel>
      <EuiFlexGroup direction={'row'} justifyContent={'flexStart'}>
        <ArrowsAltOutlined />
        <ExpandOutlined />
        <FullscreenExitOutlined />
        <NodeIndexOutlined />
        <SettingOutlined onClick={() => setDialogVisible(true)} />
        <ShrinkOutlined />
        <ZoomInOutlined />
        <ZoomOutOutlined />
        <LineageConfigModalRenderer
          visible={dialogVisible}
          onCancel={() => setDialogVisible(false)}
        />
      </EuiFlexGroup>
    </EuiPanel>

  )
}
