import { useMemo } from 'react';

import { Input } from '@grafana-ui/index';
import { t } from '@grafana-module/app/core/internationalization';
import { OptionsPaneCategoryDescriptor } from '@grafana-module/app/features/dashboard/components/PanelEditor/OptionsPaneCategoryDescriptor';
import { OptionsPaneItemDescriptor } from '@grafana-module/app/features/dashboard/components/PanelEditor/OptionsPaneItemDescriptor';

import { useLayoutCategory } from '../layouts-shared/DashboardLayoutSelector';
import { useEditPaneInputAutoFocus } from '../layouts-shared/utils';

import { TabItem } from './TabItem';

export function getEditOptions(model: TabItem): OptionsPaneCategoryDescriptor[] {
  const tabOptions = useMemo(() => {
    return new OptionsPaneCategoryDescriptor({ title: '', id: 'tab-item-options' }).addItem(
      new OptionsPaneItemDescriptor({
        title: t('dashboard.tabs-layout.tab-options.title-option', 'Title'),
        render: () => <TabTitleInput tab={model} />,
      })
    );
  }, [model]);

  const { layout } = model.useState();
  const layoutOptions = useLayoutCategory(layout);

  return [tabOptions, layoutOptions];
}

function TabTitleInput({ tab }: { tab: TabItem }) {
  const { title } = tab.useState();
  const ref = useEditPaneInputAutoFocus();

  return <Input ref={ref} value={title} onChange={(e) => tab.onChangeTitle(e.currentTarget.value)} />;
}
