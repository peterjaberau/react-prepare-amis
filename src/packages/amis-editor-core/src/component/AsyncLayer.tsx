/**
 * @file AsyncLayer.tsx
 * @desc Asynchronous loading layer
 */
import React from 'react';
import {Spinner} from '@/packages/amis-ui/src';

export interface AsyncLayerOptions {
  fallback?: React.ReactNode;
}

export const makeAsyncLayer = (
  schemaBuilderFn: () => Promise<any>,
  options?: AsyncLayerOptions
) => {
  const {fallback} = options || {};
  const LazyComponent = React.lazy(async () => {
    const schemaFormRender = await schemaBuilderFn();

    return {
      default: (...props: any[]) => <>{schemaFormRender(...props)}</>
    };
  });

  return (props: any) => (
    <React.Suspense
      fallback={
        fallback && React.isValidElement(fallback) ? (
          fallback
        ) : (
          <Spinner
            show
            overlay
            size="sm"
            tip="Configuration panel loading"
            tipPlacement="bottom"
            className="flex"
          />
        )
      }
    >
      <LazyComponent {...props} />
    </React.Suspense>
  );
};
