import { RawQuery } from '@plugin-ui/index';
import { promqlGrammar } from '@prometheus/index';

interface Props {
  query: string;
}

const PrometheusQueryPreview = ({ query }: Props) => {
  return (
    <pre>
      <RawQuery query={query} language={{ grammar: promqlGrammar, name: 'promql' }} />
    </pre>
  );
};

export default PrometheusQueryPreview;
