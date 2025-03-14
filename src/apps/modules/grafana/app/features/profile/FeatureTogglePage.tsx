import { Page } from '@grafana-module/app/core/components/Page/Page';
import { useNavModel } from '@grafana-module/app/core/hooks/useNavModel';

export default function FeatureTogglePage() {
  const navModel = useNavModel('profile-settings');

  return (
    <Page navModel={navModel}>
      <Page.Contents>
        <h1>Profile is not enabled.</h1>
        Enable profile in the Grafana config file.
        <div>
          <pre>
            {`[profile]
enable = true
`}
          </pre>
        </div>
      </Page.Contents>
    </Page>
  );
}
