import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@data/index';
import { useStyles2 } from '@grafana-ui/index';

import { SetupStep } from '../types';

import { DocsCard } from './DocsCard';
import { TutorialCard } from './TutorialCard';

interface Props {
  step: SetupStep;
}

export const Step = ({ step }: Props) => {
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.setup}>
      <div className={styles.info}>
        <h2 className={styles.title}>{step.title}</h2>
        <p>{step.info}</p>
      </div>
      <div className={styles.cards}>
        {step.cards.map((card, index) => {
          const key = `${card.title}-${index}`;
          if (card.type === 'tutorial') {
            return <TutorialCard key={key} card={card} />;
          }
          return <DocsCard key={key} card={card} />;
        })}
      </div>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    setup: css({
      display: 'flex',
      width: '95%',
    }),
    info: css({
      width: '172px',
      marginRight: '5%',

      [theme.breakpoints.down('xxl')]: {
        marginRight: theme.spacing(4),
      },
      [theme.breakpoints.down('sm')]: {
        display: 'none',
      },
    }),
    title: css({
      color: theme.v1.palette.blue95,
    }),
    cards: css({
      overflowX: 'auto',
      overflowY: 'hidden',
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
    }),
  };
};
