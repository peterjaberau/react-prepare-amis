import { ReactElement, useMemo, useState } from 'react';

import { PluginExtensionLink, PluginExtensionPoints } from '@data/index';
import { usePluginLinks } from '@runtime/index';
import { Dropdown, IconButton } from '@grafana-ui/index';
import { ConfirmNavigationModal } from '~/features/explore/extensions/ConfirmNavigationModal';
import { Alert, CombinedRule } from '~/types/unified-alerting';

import { AlertExtensionPointMenu } from './AlertInstanceExtensionPointMenu';

interface AlertInstanceExtensionPointProps {
  rule?: CombinedRule;
  instance: Alert;
  extensionPointId: PluginExtensionPoints;
}

export const AlertInstanceExtensionPoint = ({
  rule,
  instance,
  extensionPointId,
}: AlertInstanceExtensionPointProps): ReactElement | null => {
  const [selectedExtension, setSelectedExtension] = useState<PluginExtensionLink | undefined>();
  const context = useMemo(() => ({ instance, rule }), [instance, rule]);
  const { links } = usePluginLinks({ context, extensionPointId, limitPerPlugin: 3 });

  if (links.length === 0) {
    return null;
  }

  const menu = <AlertExtensionPointMenu extensions={links} onSelect={setSelectedExtension} />;
  return (
    <>
      <Dropdown placement="bottom-start" overlay={menu}>
        <IconButton name="ellipsis-v" aria-label="Actions" variant="secondary" />
      </Dropdown>
      {!!selectedExtension && !!selectedExtension.path && (
        <ConfirmNavigationModal
          path={selectedExtension.path}
          title={selectedExtension.title}
          onDismiss={() => setSelectedExtension(undefined)}
        />
      )}
    </>
  );
};

export type PluginExtensionAlertInstanceContext = {
  rule?: CombinedRule;
  instance: Alert;
};
