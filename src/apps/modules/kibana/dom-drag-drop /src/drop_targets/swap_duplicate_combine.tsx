import React from 'react';
import classNames from 'classnames';
import { EuiIcon, EuiFlexItem, EuiFlexGroup, EuiText } from '@elastic/eui';
import { DropType } from '../types';
import { DEFAULT_DATA_TEST_SUBJ } from '../constants';

function getPropsForDropType(type: 'swap' | 'duplicate' | 'combine') {
  switch (type) {
    case 'duplicate':
      return {
        icon: 'copy',
        label: 'Duplicate',
        controlKey: 'Alt/Option',
      };

    case 'swap':
      return {
        icon: 'merge',
        label: 'Swap',
        controlKey: 'Shift',
      };
    case 'combine':
      return {
        icon: 'aggregate',
        label: 'Combine',
        controlKey: 'Control',
      };
    default:
      throw Error('Drop type not supported');
  }
}

const getExtraTarget = ({
  type,
  isIncompatible,
}: {
  type: 'swap' | 'duplicate' | 'combine';
  isIncompatible?: boolean;
}) => {
  const { icon, label, controlKey } = getPropsForDropType(type);
  return (
    <EuiFlexGroup
      gutterSize="s"
      justifyContent="spaceBetween"
      alignItems="center"
      className={classNames('domDroppable__extraTarget', {
        'domDroppable--incompatibleExtraTarget': isIncompatible,
      })}
    >
      <EuiFlexItem grow={false}>
        <EuiFlexGroup gutterSize="s" alignItems="center">
          <EuiFlexItem grow={false}>
            <EuiIcon size="m" type={icon} />
          </EuiFlexItem>
          <EuiFlexItem grow={false} data-test-subj={`${DEFAULT_DATA_TEST_SUBJ}-dropTarget-${type}`}>
            <EuiText size="s">{label}</EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
        <EuiText size="xs">
          <code> {controlKey}</code>
        </EuiText>
      </EuiFlexItem>
    </EuiFlexGroup>
  );
};

const customDropTargetsMap: Partial<{ [dropType in DropType]: React.ReactElement }> = {
  replace_duplicate_incompatible: getExtraTarget({ type: 'duplicate', isIncompatible: true }),
  duplicate_incompatible: getExtraTarget({ type: 'duplicate', isIncompatible: true }),
  swap_incompatible: getExtraTarget({ type: 'swap', isIncompatible: true }),
  replace_duplicate_compatible: getExtraTarget({ type: 'duplicate' }),
  duplicate_compatible: getExtraTarget({ type: 'duplicate' }),
  swap_compatible: getExtraTarget({ type: 'swap' }),
  field_combine: getExtraTarget({ type: 'combine' }),
  combine_compatible: getExtraTarget({ type: 'combine' }),
  combine_incompatible: getExtraTarget({ type: 'combine', isIncompatible: true }),
};

export const getCustomDropTarget = (dropType: DropType) => customDropTargetsMap?.[dropType] || null;

export const getAdditionalClassesOnEnter = (dropType?: string) => {
  if (
    dropType &&
    [
      'field_replace',
      'replace_compatible',
      'replace_incompatible',
      'replace_duplicate_compatible',
      'replace_duplicate_incompatible',
    ].includes(dropType)
  ) {
    return 'domDroppable--replacing';
  }
};

export const getAdditionalClassesOnDroppable = (dropType?: string) => {
  if (
    dropType &&
    [
      'move_incompatible',
      'replace_incompatible',
      'swap_incompatible',
      'duplicate_incompatible',
      'replace_duplicate_incompatible',
      'combine_incompatible',
    ].includes(dropType)
  ) {
    return 'domDroppable--incompatible';
  }
};
