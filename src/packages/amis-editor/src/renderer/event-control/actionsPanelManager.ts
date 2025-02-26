import {RendererPluginAction, EditorManager} from 'amis-editor-core';
const builtInActionsPanel: Array<RendererPluginAction> = [];

export interface ActionLeftPanelTree {
  actionType?: string;
  actionLabel?: string;
  children?: RendererPluginAction | Array<RendererPluginAction>;
}

type ActionPanel = Omit<RendererPluginAction, 'actionType' | 'actionLabel'> & {
  label: string;
  tag: string;
};

/**
 * Build actionTypeTree data structure
 *
 * @param actionPanel
 */

const builtInActionPanelData = (
  actionType: string,
  actionPanel: ActionPanel | undefined
) => {
  const {label, description, ...rest} = actionPanel || {};
  return {
    actionType,
    actionLabel: label,
    description,
    ...rest
  };
};

/**
 * Register the action panel plugin
 *
 * @param actionPanel
 */
export const registerActionPanel = (
  actionType: string,
  actionPanel?: ActionPanel
) => {
  const {label, tag} = actionPanel || {};
  if (!actionType) {
    console.warn(`actionType cannot be empty`);
    return;
  }
  if (!label || !tag) {
    console.warn(`label or tag cannot be empty`);
    return;
  }

  if (builtInActionsPanel.length === 0) {
    builtInActionsPanel.push({
      actionType: tag,
      actionLabel: tag,
      children: [builtInActionPanelData(actionType, actionPanel)]
    });
    return;
  }

  const idx = builtInActionsPanel.findIndex(item => item.actionType === tag);
  if (idx === -1) {
    builtInActionsPanel.push({
      actionType: tag,
      actionLabel: tag,
      children: [builtInActionPanelData(actionType, actionPanel)]
    });
  } else {
    const subActionsPanel = builtInActionsPanel[idx]?.children || [];
    const idx2 = subActionsPanel.findIndex(
      item => item.actionType === actionType
    );
    const processData = builtInActionPanelData(actionType, actionPanel);
    if (idx2 === -1) {
      subActionsPanel.push(processData);
    } else {
      console.warn(
        `An action panel with the same actionType: ${actionType} exists, which will overwrite the original action panel`
      );
      subActionsPanel.splice(idx2, 1, processData);
    }
  }
};

/**
 * Unregister the Action Panel plugin
 *
 * @param actionType
 */
export const unRegisterActionsPanel = (actionType: string | string[]) => {
  if (!Array.isArray(actionType)) {
    actionType = [actionType];
  }

  actionType.forEach(type => {
    builtInActionsPanel.forEach((item, index) => {
      item.children?.forEach((subItem, index) => {
        if (subItem.actionType === type) {
          subItem.children?.splice(index, 1);
        }
      });
    });
  });
};

export const ACTION_TYPE_TREE = (
  manager: EditorManager
): RendererPluginAction[] => {
  return builtInActionsPanel;
};
