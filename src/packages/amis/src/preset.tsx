import {
  addRootWrapper,
  extendDefaultEnv,
  LazyComponent,
  render,
  themeable,
  ThemeProps
} from '@/packages/amis-core/src';
import {ImageGallery} from '@/packages/amis-ui/src';
import {setRenderSchemaFn} from '@/packages/amis-ui/src/components/Alert';
import {alert, confirm} from '@/packages/amis-ui/src/components/Alert';
import {toast} from '@/packages/amis-ui/src/components/Toast';
import React from 'react';

extendDefaultEnv({
  alert,
  confirm,
  notify: (type: keyof typeof toast, msg: string, conf: any) =>
    toast[type] ? toast[type](msg, conf) : console.warn('[Notify]', type, msg)
});

setRenderSchemaFn((controls, value, callback, scopeRef, theme) => {
  return render(
    {
      name: 'form',
      type: 'form',
      wrapWithPanel: false,
      mode: 'horizontal',
      controls,
      messages: {
        validateFailed: ''
      }
    },
    {
      data: value,
      onFinished: callback,
      scopeRef,
      theme
    },
    {
      session: 'prompt'
    }
  );
});

addRootWrapper((props: any) => {
  const {env, children} = props;
  return (
    <ImageGallery modalContainer={env.getModalContainer}>
      {children}
    </ImageGallery>
  );
});

const SimpleSpinner = themeable(
  (
    props: {
      className?: string;
      spinnerClassName?: string;
    } & ThemeProps
  ) => {
    const cx = props.classnames;

    return (
      <div
        data-testid="spinner"
        className={cx(`Spinner`, 'in', props.className)}
      >
        <div
          className={cx(
            `Spinner-icon`,
            'Spinner-icon--default',
            'Spinner-icon--sm',
            props.spinnerClassName
          )}
        ></div>
      </div>
    );
  }
);

(LazyComponent as any).defaultProps.placeholder = <SimpleSpinner />;
