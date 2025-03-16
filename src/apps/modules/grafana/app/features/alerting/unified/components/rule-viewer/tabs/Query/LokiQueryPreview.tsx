import { RawQuery } from '@plugin-ui/index';
import lokiGrammar from '@grafana-module/app/plugins/datasource/loki/syntax';

interface Props {
  query: string;
}

const LokiQueryPreview = ({ query }: Props) => {
  return (
    <pre>
      <RawQuery query={query} language={{ grammar: lokiGrammar, name: 'promql' }} />
    </pre>
  );
};

export default LokiQueryPreview;
