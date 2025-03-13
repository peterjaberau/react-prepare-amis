import { css } from '@emotion/css';
import { useState } from 'react';

import { GrafanaTheme2 } from '@data/index';
import { ResourceDimensionMode } from '@schema/index';
import { Portal, useTheme2 } from '@grafana-ui/index';
import { Scene } from '@grafana-module/app/features/canvas/runtime/scene';
import { MediaType, ResourceFolderName } from '@grafana-module/app/features/dimensions';
import { ResourcePickerPopover } from '@grafana-module/app/features/dimensions/editors/ResourcePickerPopover';

import { AnchorPoint } from '../types';

type Props = {
  onClose: () => void;
  scene: Scene;
  anchorPoint: AnchorPoint;
};

export function SetBackground({ onClose, scene, anchorPoint }: Props) {
  const defaultValue = scene.root.options.background?.image?.fixed ?? '';

  const [bgImage, setBgImage] = useState(defaultValue);
  const theme = useTheme2();
  const styles = getStyles(theme, anchorPoint);

  const onChange = (value: string | undefined) => {
    if (value) {
      setBgImage(value);
      if (scene.root) {
        scene.root.options.background = {
          ...scene.root.options.background,
          image: { mode: ResourceDimensionMode.Fixed, fixed: value },
        };
        scene.revId++;
        scene.save();

        scene.root.reinitializeMoveable();
      }

      // Force a re-render (update scene data after config update)
      if (scene) {
        scene.updateData(scene.data!);
      }
    }

    onClose();
  };

  return (
    <Portal className={styles.portalWrapper}>
      <ResourcePickerPopover
        onChange={onChange}
        value={bgImage}
        mediaType={MediaType.Image}
        folderName={ResourceFolderName.IOT}
      />
    </Portal>
  );
}

const getStyles = (theme: GrafanaTheme2, anchorPoint: AnchorPoint) => ({
  portalWrapper: css({
    width: '315px',
    height: '445px',
    transform: `translate(${anchorPoint.x}px, ${anchorPoint.y - 200}px)`,
  }),
});
