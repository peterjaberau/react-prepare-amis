import { useParams } from 'react-router';

import { PluginDetailsPage } from '../components/PluginDetailsPage';

export default function PluginDetails(): JSX.Element {
  const { pluginId = '' } = useParams<{ pluginId: string }>();

  return <PluginDetailsPage pluginId={pluginId} />;
}
