// Core Grafana history https://github.com/grafana/grafana/blob/v11.0.0-preview/public/app/plugins/datasource/prometheus/configuration/ExemplarsSettings.tsx
import { css } from '@emotion/css';

import { ConfigSubSection } from '@plugin-ui/index';
import { Button, useTheme2 } from '@grafana-ui/index';

import { ExemplarTraceIdDestination } from '../types';

import { overhaulStyles } from './ConfigEditor';
import { ExemplarSetting } from './ExemplarSetting';

type Props = {
  options?: ExemplarTraceIdDestination[];
  onChange: (value: ExemplarTraceIdDestination[]) => void;
  disabled?: boolean;
};

export function ExemplarsSettings({ options, onChange, disabled }: Props) {
  const theme: any = useTheme2();
  const styles = overhaulStyles(theme);
  return (
    <div className={styles.sectionBottomPadding}>
      <ConfigSubSection title="Exemplars" className={styles.container}>
        {options &&
          options.map((option, index) => {
            return (
              <ExemplarSetting
                key={index}
                value={option}
                onChange={(newField) => {
                  const newOptions = [...options];
                  newOptions.splice(index, 1, newField);
                  onChange(newOptions);
                }}
                onDelete={() => {
                  const newOptions = [...options];
                  newOptions.splice(index, 1);
                  onChange(newOptions);
                }}
                disabled={disabled}
              />
            );
          })}

        {!disabled && (
          <Button
            variant="secondary"
            className={css({
              marginBottom: '10px',
            })}
            icon="plus"
            onClick={(event) => {
              event.preventDefault();
              const newOptions = [...(options || []), { name: 'traceID' }];
              onChange(newOptions);
            }}
          >
            Add
          </Button>
        )}
        {disabled && !options && <i>No exemplars configurations</i>}
      </ConfigSubSection>
    </div>
  );
}
