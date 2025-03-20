import { css } from '@emotion/css';

import { TagList, useStyles2 } from '@grafana-ui/index';
import { Matcher } from '~/plugins/datasource/alertmanager/types';

import { matcherToOperator } from '../../utils/alertmanager';

type MatchersProps = { matchers: Matcher[] };

export const Matchers = ({ matchers }: MatchersProps) => {
  const styles = useStyles2(getStyles);
  return (
    <div>
      <TagList
        className={styles.tags}
        tags={matchers.map((matcher) => `${matcher.name}${matcherToOperator(matcher)}${matcher.value}`)}
      />
    </div>
  );
};

const getStyles = () => ({
  tags: css({
    justifyContent: 'flex-start',
  }),
});
