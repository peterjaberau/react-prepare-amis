import { DataQueryError } from '@data/index';
import { Alert } from '@grafana-ui/index';
import { FadeIn } from '@grafana-module/app/core/components/Animations/FadeIn';

export interface ErrorContainerProps {
  queryError?: DataQueryError;
}

export const ErrorContainer = (props: ErrorContainerProps) => {
  const { queryError } = props;
  const showError = queryError ? true : false;
  const duration = showError ? 100 : 10;
  const title = queryError ? 'Query error' : 'Unknown error';
  const message = queryError?.message || queryError?.data?.message || null;

  return (
    <FadeIn in={showError} duration={duration}>
      <Alert severity="error" title={title} topSpacing={2}>
        {message}
      </Alert>
    </FadeIn>
  );
};
