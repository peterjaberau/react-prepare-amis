import { t } from '@grafana-module/app/core/internationalization';
import { OptionsPaneCategoryDescriptor } from '@grafana-module/app/features/dashboard/components/PanelEditor/OptionsPaneCategoryDescriptor';
import { OptionsPaneItemDescriptor } from '@grafana-module/app/features/dashboard/components/PanelEditor/OptionsPaneItemDescriptor';

import { ConditionalRendering } from './ConditionalRendering';

export function useConditionalRenderingEditor(
  conditionalRendering?: ConditionalRendering
): OptionsPaneCategoryDescriptor | null {
  if (!conditionalRendering) {
    return null;
  }

  return new OptionsPaneCategoryDescriptor({
    title: t('dashboard.conditional-rendering.title', 'Conditional rendering options'),
    id: 'conditional-rendering-options',
    isOpenDefault: true,
  }).addItem(
    new OptionsPaneItemDescriptor({
      title: t('dashboard.conditional-rendering.title', 'Conditional rendering options'),
      render: () => <conditionalRendering.Component model={conditionalRendering} />,
    })
  );
}
