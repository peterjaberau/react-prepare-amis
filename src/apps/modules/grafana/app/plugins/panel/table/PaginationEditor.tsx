import * as React from 'react';

import { StandardEditorProps } from '@data/index';
import { Switch } from '@grafana-ui/index';

export function PaginationEditor({ onChange, value, context }: StandardEditorProps<boolean>) {
  const changeValue = (event: React.FormEvent<HTMLInputElement> | undefined) => {
    if (event?.currentTarget.checked) {
      context.options.footer.show = false;
    }
    onChange(event?.currentTarget.checked);
  };

  return <Switch value={Boolean(value)} onChange={changeValue} />;
}
