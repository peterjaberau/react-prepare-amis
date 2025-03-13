import { useCallback } from 'react';

import { FrameMatcherID, MatcherConfig, StandardEditorProps } from '@data/index';
import {
  RefIDMultiPicker,
  RefIDPicker,
  stringsToRegexp,
} from '@grafana-ui/components/MatchersUI/FieldsByFrameRefIdMatcher';

type Props = StandardEditorProps<MatcherConfig>;

export const FrameSelectionEditor = ({ value, context, onChange }: Props) => {
  const onFilterChange = useCallback(
    (v: string) => {
      onChange(
        v?.length
          ? {
              id: FrameMatcherID.byRefId,
              options: v,
            }
          : undefined
      );
    },
    [onChange]
  );

  return (
    <RefIDPicker value={value?.options} onChange={onFilterChange} data={context.data} placeholder="Change filter" />
  );
};

type FrameMultiSelectionEditorProps = Omit<StandardEditorProps<MatcherConfig>, 'item'>;

export const FrameMultiSelectionEditor = ({ value, context, onChange }: FrameMultiSelectionEditorProps) => {
  const onFilterChange = useCallback(
    (v: string[]) => {
      onChange(
        v?.length
          ? {
              id: FrameMatcherID.byRefId,
              options: stringsToRegexp(v),
            }
          : undefined
      );
    },
    [onChange]
  );

  return (
    <RefIDMultiPicker
      value={value?.options}
      onChange={onFilterChange}
      data={context.data}
      placeholder="Change filter"
    />
  );
};
