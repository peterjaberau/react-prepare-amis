import { DropType } from '../types';
import { HumanData } from '.';

type AnnouncementFunction = (draggedElement: HumanData, dropElement: HumanData) => string;

interface CustomAnnouncementsType {
  dropped: Partial<{ [dropType in DropType]: AnnouncementFunction }>;
  selectedTarget: Partial<{ [dropType in DropType]: AnnouncementFunction }>;
}

const replaceAnnouncement = {
  selectedTarget: (
    { label, groupLabel, position, layerNumber }: HumanData,
    {
      label: dropLabel,
      groupLabel: dropGroupLabel,
      position: dropPosition,
      canSwap,
      canDuplicate,
      canCombine,
      layerNumber: dropLayerNumber,
    }: HumanData
  ) => {
    if (canSwap || canDuplicate) {
      return `You're dragging ${label} from ${groupLabel} at position ${position} in layer ${layerNumber} over ${dropLabel} from ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber}. Press space or enter to replace ${dropLabel} with ${label}.${canDuplicate ? ' Hold alt or option to duplicate.' : ''}${canSwap ? ' Hold shift to swap.' : ''}${canCombine ? ' Hold control to combine' : ''}`;

    }
    return `Replace ${dropLabel} in ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber} with ${label}. Press space or enter to replace.`;
  },
  dropped: (
    { label }: HumanData,
    { label: dropLabel, groupLabel, position, layerNumber: dropLayerNumber }: HumanData
  ) => {
    return `Replaced ${dropLabel} with ${label} in ${groupLabel} at position ${position} in layer ${dropLayerNumber}`;
  },
};

const duplicateAnnouncement = {
  selectedTarget: (
    { label, groupLabel, layerNumber }: HumanData,
    { groupLabel: dropGroupLabel, position }: HumanData
  ) => {
    if (groupLabel !== dropGroupLabel) {
      return `Duplicate ${label} to ${dropGroupLabel} group at position ${position} in layer ${layerNumber}. Hold Alt or Option and press space or enter to duplicate`;
    }
    return `Duplicate ${label} to ${dropGroupLabel} group at position ${position} in layer ${layerNumber}. Press space or enter to duplicate`;
  },
  dropped: ({ label }: HumanData, { groupLabel, position, layerNumber }: HumanData) =>
    `Duplicated ${label} in ${groupLabel} group at position ${position} in layer ${layerNumber}`,
};

const reorderAnnouncement = {
  selectedTarget: (
    { label, groupLabel, position: prevPosition }: HumanData,
    { position }: HumanData
  ) => {
    return prevPosition === position
      ? `${label} returned to its initial position ${prevPosition}`
      : `Reorder ${label} in ${groupLabel} group from position ${prevPosition} to position ${position}. Press space or enter to reorder`;
  },
  dropped: ({ label, groupLabel, position: prevPosition }: HumanData, { position }: HumanData) =>
    `Reordered ${label} in ${groupLabel} group from position ${prevPosition} to position ${position}`,
};

const combineAnnouncement = {
  selectedTarget: (
    { label, groupLabel, position, layerNumber }: HumanData,
    {
      label: dropLabel,
      groupLabel: dropGroupLabel,
      position: dropPosition,
      canSwap,
      canDuplicate,
      canCombine,
      layerNumber: dropLayerNumber,
    }: HumanData
  ) => {
    if (canSwap || canDuplicate || canCombine) {
      return `You're dragging ${label} from ${groupLabel} at position ${position} in layer ${layerNumber} over ${dropLabel} from ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber}. Press space or enter to combine ${dropLabel} with ${label}.${canDuplicate ? ' Hold alt or option to duplicate.' : ''}${canSwap ? ' Hold shift to swap.' : ''}${canCombine ? ' Hold control to combine' : ''}`;
    }
    return `Combine ${dropLabel} in ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber} with ${label}. Press space or enter to combine.`;
  },
  dropped: (
    { label }: HumanData,
    { label: dropLabel, groupLabel, position, layerNumber: dropLayerNumber }: HumanData
  ) =>
    `Combine ${dropLabel} with ${label} in ${groupLabel} at position ${position} in layer ${dropLayerNumber}`,
};

const DUPLICATE_SHORT = ' Hold alt or option to duplicate.';

const SWAP_SHORT = ' Hold shift to swap.';

const COMBINE_SHORT = 'Hold control to combine';

export const announcements: CustomAnnouncementsType = {
  selectedTarget: {
    reorder: reorderAnnouncement.selectedTarget,
    duplicate_compatible: duplicateAnnouncement.selectedTarget,
    field_replace: replaceAnnouncement.selectedTarget,
    field_combine: combineAnnouncement.selectedTarget,
    replace_compatible: replaceAnnouncement.selectedTarget,
    replace_incompatible: (
      { label, groupLabel, position, layerNumber }: HumanData,
      {
        label: dropLabel,
        groupLabel: dropGroupLabel,
        position: dropPosition,
        nextLabel,
        canSwap,
        canDuplicate,
        canCombine,
        layerNumber: dropLayerNumber,
      }: HumanData
    ) => {
      if (canSwap || canDuplicate || canCombine) {
        return `You're dragging ${label} from ${groupLabel} at position ${position} in layer ${layerNumber} over ${dropLabel} from ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber}. Press space or enter to convert ${label} to ${nextLabel} and replace ${dropLabel}.${canDuplicate ? DUPLICATE_SHORT : ''}${canSwap ? SWAP_SHORT : ''}${canCombine ? COMBINE_SHORT : ''}`;
      }
      return `Convert ${label} to ${nextLabel} and replace ${dropLabel} in ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber}. Press space or enter to replace`;
    },
    move_incompatible: (
      { label, groupLabel, position, layerNumber }: HumanData,
      {
        groupLabel: dropGroupLabel,
        position: dropPosition,
        nextLabel,
        canSwap,
        canDuplicate,
        layerNumber: dropLayerNumber,
      }: HumanData
    ) => {
      if (canSwap || canDuplicate) {
        return `You're dragging ${label} from ${groupLabel} at position ${position} in layer ${layerNumber} over position ${dropPosition} in ${dropGroupLabel} group in layer ${dropLayerNumber}. Press space or enter to convert ${label} to ${nextLabel} and move.${canDuplicate ? DUPLICATE_SHORT : ''}`;
      }
      return `Convert ${label} to ${nextLabel} and move to ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber}. Press space or enter to move`;
    },

    move_compatible: (
      { label, groupLabel, position }: HumanData,
      {
        groupLabel: dropGroupLabel,
        position: dropPosition,
        canSwap,
        canDuplicate,
        layerNumber: dropLayerNumber,
      }: HumanData
    ) => {
      if (canSwap || canDuplicate) {
        return `You're dragging ${label} from ${groupLabel} at position ${position} over position ${dropPosition} in ${dropGroupLabel} group in layer ${dropLayerNumber}. Press space or enter to move.${canDuplicate ? DUPLICATE_SHORT : ''}`;
      }
      return `Move ${label} to ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber}. Press space or enter to move`;
    },
    duplicate_incompatible: (
      { label }: HumanData,
      { groupLabel, position, nextLabel, layerNumber: dropLayerNumber }: HumanData
    ) =>

      `Convert copy of ${label} to ${nextLabel} and add to ${groupLabel} group at position ${position} in layer ${dropLayerNumber}. Hold Alt or Option and press space or enter to duplicate`,
    replace_duplicate_incompatible: (
      { label }: HumanData,
      { label: dropLabel, groupLabel, position, nextLabel, layerNumber: dropLayerNumber }: HumanData
    ) =>
      `Convert copy of ${label} to ${nextLabel} and replace ${dropLabel} in ${groupLabel} group at position ${position} in layer ${dropLayerNumber}. Hold Alt or Option and press space or enter to duplicate and replace`,
    replace_duplicate_compatible: (
      { label }: HumanData,
      { label: dropLabel, groupLabel, position, layerNumber: dropLayerNumber }: HumanData
    ) =>
      `Duplicate ${label} and replace ${dropLabel} in ${groupLabel} at position ${position} in layer ${dropLayerNumber}. Hold Alt or Option and press space or enter to duplicate and replace`,
    swap_compatible: (
      { label, groupLabel, position, layerNumber }: HumanData,
      {
        label: dropLabel,
        groupLabel: dropGroupLabel,
        position: dropPosition,
        layerNumber: dropLayerNumber,
      }: HumanData
    ) =>
      `Swap ${label} in ${groupLabel} group at position ${position} in layer ${layerNumber} with ${dropLabel} in ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber}. Hold Shift and press space or enter to swap`,
    swap_incompatible: (
      { label, groupLabel, position, layerNumber }: HumanData,
      {
        label: dropLabel,
        groupLabel: dropGroupLabel,
        position: dropPosition,
        nextLabel,
        layerNumber: dropLayerNumber,
      }: HumanData
    ) =>
      `Convert ${label} to ${nextLabel} in ${groupLabel} group at position ${position} in layer ${layerNumber} and swap with ${dropLabel} in ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber}. Hold Shift and press space or enter to swap`,
    combine_compatible: (
      { label, groupLabel, position, layerNumber }: HumanData,
      {
        label: dropLabel,
        groupLabel: dropGroupLabel,
        position: dropPosition,
        layerNumber: dropLayerNumber,
      }: HumanData
    ) =>
      `Combine ${label} in ${groupLabel} group at position ${position} in layer ${layerNumber} with ${dropLabel} in ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber}. Hold Control and press space or enter to combine`,
    combine_incompatible: (
      { label, groupLabel, position, layerNumber }: HumanData,
      {
        label: dropLabel,
        groupLabel: dropGroupLabel,
        position: dropPosition,
        nextLabel,
        layerNumber: dropLayerNumber,
      }: HumanData
    ) =>
      `Convert ${label} to ${nextLabel} in ${groupLabel} group at position ${position} in layer ${layerNumber} and combine with ${dropLabel} in ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber}. Hold Control and press space or enter to combine`,
  },
  dropped: {
    reorder: reorderAnnouncement.dropped,
    duplicate_compatible: duplicateAnnouncement.dropped,
    field_replace: replaceAnnouncement.dropped,
    field_combine: combineAnnouncement.dropped,
    replace_compatible: replaceAnnouncement.dropped,
    replace_incompatible: (
      { label }: HumanData,
      { label: dropLabel, groupLabel, position, nextLabel, layerNumber: dropLayerNumber }: HumanData
    ) =>
      `Converted ${label} to ${nextLabel} and replaced ${dropLabel} in ${groupLabel} group at position ${position} in layer ${dropLayerNumber}`,
    move_incompatible: (
      { label }: HumanData,
      { groupLabel, position, nextLabel, layerNumber: dropLayerNumber }: HumanData
    ) =>
      `Converted ${label} to ${nextLabel} and moved to ${groupLabel} group at position ${position} in layer ${dropLayerNumber}`,

    move_compatible: (
      { label }: HumanData,
      { groupLabel, position, layerNumber: dropLayerNumber }: HumanData
    ) =>
      `Moved ${label} to ${groupLabel} group at position ${position} in layer ${dropLayerNumber}`,

    duplicate_incompatible: (
      { label }: HumanData,
      { groupLabel, position, nextLabel, layerNumber: dropLayerNumber }: HumanData
    ) =>
      `Converted copy of ${label} to ${nextLabel} and added to ${groupLabel} group at position ${position} in layer ${dropLayerNumber}`,


    replace_duplicate_incompatible: (
      { label }: HumanData,
      { label: dropLabel, groupLabel, position, nextLabel, layerNumber: dropLayerNumber }: HumanData
    ) =>
      `Converted copy of ${label} to ${nextLabel} and replaced ${dropLabel} in ${groupLabel} group at position ${position} in layer ${dropLayerNumber}`,

    replace_duplicate_compatible: (
      { label }: HumanData,
      { label: dropLabel, groupLabel, position, layerNumber: dropLayerNumber }: HumanData
    ) =>
      `Replaced ${dropLabel} with a copy of ${label} in ${groupLabel} at position ${position} in layer ${dropLayerNumber}`,
    swap_compatible: (
      { label, groupLabel, position, layerNumber }: HumanData,
      {
        label: dropLabel,
        groupLabel: dropGroupLabel,
        position: dropPosition,
        layerNumber: dropLayerNumber,
      }: HumanData
    ) =>
      `Moved ${label} to ${dropGroupLabel} at position ${dropPosition} in layer ${dropLayerNumber} and ${dropLabel} to ${groupLabel} at position ${position} in layer ${layerNumber}`,

    swap_incompatible: (
      { label, groupLabel, position, layerNumber }: HumanData,
      {
        label: dropLabel,
        groupLabel: dropGroupLabel,
        position: dropPosition,
        nextLabel,
        layerNumber: dropLayerNumber,
      }: HumanData
    ) =>
      `Converted ${label} to ${nextLabel} in ${groupLabel} group at position ${position} in layer ${layerNumber} and swapped with ${dropLabel} in ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber}`,
    combine_compatible: (
      { label, groupLabel }: HumanData,
      {
        label: dropLabel,
        groupLabel: dropGroupLabel,
        position: dropPosition,
        layerNumber: dropLayerNumber,
      }: HumanData
    ) =>
      `Combined ${label} in ${groupLabel} group at position ${dropPosition} with ${dropLabel} in ${dropGroupLabel} group at position in layer ${dropLayerNumber}`, //${position}

    combine_incompatible: (
      { label, groupLabel, position, layerNumber }: HumanData,
      {
        label: dropLabel,
        groupLabel: dropGroupLabel,
        position: dropPosition,
        nextLabel,
        layerNumber: dropLayerNumber,
      }: HumanData
    ) =>
      `Converted ${label} to ${nextLabel} in ${groupLabel} group at position ${position} in layer ${layerNumber} and combined with ${dropLabel} in ${dropGroupLabel} group at position ${dropPosition} in layer ${dropLayerNumber}`,

  },
};

const defaultAnnouncements = {
  lifted: ({ label }: HumanData) =>
    `Lifted ${label}`,

  cancelled: ({ label, groupLabel, position }: HumanData) => {
    if (!groupLabel || !position) {
      `Movement cancelled. ${label} returned to its initial position`;
    }
    return `Movement cancelled. ${label} returned to ${groupLabel} group at position ${position}`;
  },

  noTarget: () => {
    return `No target selected. Use arrow keys to select a target`;
  },

  dropped: (
    { label }: HumanData,
    {
      groupLabel: dropGroupLabel,
      position,
      label: dropLabel,
      layerNumber: dropLayerNumber,
    }: HumanData
  ) =>
    dropGroupLabel && position
      ?
      `Added ${label} in ${dropGroupLabel} group at position ${position} in layer ${dropLayerNumber}`
      :
      `Added ${label} to ${dropLabel}`,
  selectedTarget: (
    { label }: HumanData,
    {
      label: dropLabel,
      groupLabel: dropGroupLabel,
      position,
      layerNumber: dropLayerNumber,
    }: HumanData
  ) => {
    return dropGroupLabel && position
      ?
      `Add ${label} to ${dropGroupLabel} group at position ${position} in layer ${dropLayerNumber}. Press space or enter to add`
      :
      `Add ${label} to ${dropLabel}. Press space or enter to add`;
  },
};

export const announce = {
  ...defaultAnnouncements,
  dropped: (draggedElement: HumanData, dropElement: HumanData, type?: DropType) =>
    (type && announcements.dropped?.[type]?.(draggedElement, dropElement)) ||
    defaultAnnouncements.dropped(draggedElement, dropElement),
  selectedTarget: (draggedElement: HumanData, dropElement: HumanData, type?: DropType) => {
    return (
      (type && announcements.selectedTarget?.[type]?.(draggedElement, dropElement)) ||
      defaultAnnouncements.selectedTarget(draggedElement, dropElement)
    );
  },
};
