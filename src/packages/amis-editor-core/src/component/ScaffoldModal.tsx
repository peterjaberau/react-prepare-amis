import React from 'react';
import {EditorManager} from '../manager';
import {EditorStoreType} from '../store/editor';
import {render, Modal, getTheme, Icon, Spinner, Button} from '@/packages/amis-ui/src';
import {observer} from 'mobx-react';
import {autobind, isObject} from '../util';

export interface SubEditorProps {
  store: EditorStoreType;
  manager: EditorManager;
  theme?: string;
}

@observer
export class ScaffoldModal extends React.Component<SubEditorProps> {
  @autobind
  async handleConfirm([values]: any) {
    const store = this.props.store;
    const pipeOutFunc = store.scaffoldForm?.pipeOut;

    values = {
      ...store.scaffoldForm?.value,
      ...values
    };

    if (pipeOutFunc && typeof pipeOutFunc === 'function') {
      const mapped = await pipeOutFunc(values);

      values = {
        ...mapped
      };
    }

    store.scaffoldForm?.callback(values);
    store.closeScaffoldForm();
    store.scaffoldForm?.stepsBody && store.setScaffoldStep(0);
  }

  buildSchema() {
    const {store} = this.props;
    const scaffoldFormContext = store.scaffoldForm!;

    let body = scaffoldFormContext.controls ?? scaffoldFormContext.body;
    if (scaffoldFormContext.stepsBody) {
      body = [
        {
          type: 'steps',
          name: '__step',
          className: 'ae-Steps',
          steps: body.map((step, index) => ({
            title: step.title,
            value: index,
            iconClassName: 'ae-Steps-Icon'
          }))
        },
        ...body.map((step, index) => ({
          type: 'container',
          visibleOn: `__step === ${index}`,
          body: step.body
        }))
      ];
    }

    let layout: object;
    if (isObject(scaffoldFormContext.mode)) {
      layout = scaffoldFormContext.mode as object;
    } else {
      layout = {
        mode: scaffoldFormContext.mode || 'normal'
      };
    }

    return {
      type: 'form',
      wrapWithPanel: false,
      initApi: scaffoldFormContext.initApi,
      api: scaffoldFormContext.api,
      ...layout,
      wrapperComponent: 'div',
      [scaffoldFormContext.controls ? 'controls' : 'body']: body
    };
    // const {store} = this.props;
    // const scaffoldFormContext = store.scaffoldForm;

    // return {
    //   show: !!scaffoldFormContext,
    //   size: scaffoldFormContext?.size || 'md',
    //   title: scaffoldFormContext?.title,
    //   onClose: store.closeScaffoldForm,
    //   onConfirm: this.handleConfirm,
    //   data: createObject(store.ctx, scaffoldFormContext?.value),
    //   body: scaffoldFormContext
    //     ? {
    //         type: 'form',
    //         initApi: scaffoldFormContext.initApi,
    //         api: scaffoldFormContext.api,
    //         mode: scaffoldFormContext.mode || 'normal',
    //         wrapperComponent: 'div',
    //         onValidate: scaffoldFormContext.validate,
    //         [scaffoldFormContext.controls ? 'controls' : 'body']:
    //           scaffoldFormContext.controls ?? scaffoldFormContext.body
    //       }
    //     : {
    //         type: 'tpl',
    //         tpl: 'Loading...'
    //       },
    //   actions: [
    //     [
    //       {
    //         type: 'submit',
    // label: 'Confirm',
    //         level: 'primary'
    //       },
    //       {
    //         type: 'button',
    // label: 'Cancel',
    //         actionType: 'close'
    //       }
    //     ]
    //   ],
    //   closeOnEsc: false,
    //   bodyClassName: 'ae-Dialog'
    //   // lazyRender: true
    // };
  }

  amisScope: any;

  @autobind
  scopeRef(scoped: any) {
    this.amisScope = scoped;
  }

  @autobind
  goToNextStep() {
    const store = this.props.store;
    const form = this.amisScope?.getComponents()[0].props.store;
    const step = store.scaffoldFormStep + 1;
    form.setValueByName('__step', step);
    /** Switching steps causes the schema to be re-rendered, and the data in the Form data field will be lost*/
    store.updateScaffoldData(form?.data, true);

    // Control buttons
    store.setScaffoldStep(step);
    // Mark whether it has been manually operated
    store.setScaffoldStepManipulated(true);
  }

  @autobind
  goToPrevStep() {
    // The props data cannot be updated, and the control amis does not re-render, otherwise the data will be reinitialized
    const store = this.props.store;
    const form = this.amisScope?.getComponents()[0].props.store;
    const step = store.scaffoldFormStep - 1;
    form.setValueByName('__step', step);
    store.updateScaffoldData(form?.data, true);

    // Control buttons
    store.setScaffoldStep(step);
  }

  @autobind
  async handleConfirmClick() {
    const form = this.amisScope?.getComponents()[0];

    if (!form) {
      return;
    }
    const {store} = this.props;

    try {
      store.setScaffoldBuzy(true);

      const values = await form.doAction(
        {
          type: 'submit'
        },
        form.props.data,
        true
      );

      await this.handleConfirm([values]);
    } catch (e) {
      console.log(e.stack);
      store.setScaffoldError(e.message);
    }

    store.setScaffoldBuzy(false);
    store.setScaffoldStep(0);
  }

  @autobind
  handleCancelClick() {
    this.props.store.closeScaffoldForm();
    this.props.store.setScaffoldStep(0);
  }

  render() {
    const {store, theme, manager} = this.props;
    const scaffoldFormContext = store.scaffoldForm;
    const cx = getTheme(theme || 'cxd').classnames;
    const isStepBody = !!scaffoldFormContext?.stepsBody;
    const canSkip = !!scaffoldFormContext?.canSkip;
    const isLastStep =
      isStepBody &&
      store.scaffoldFormStep === scaffoldFormContext!.body.length - 1;
    const isFirstStep = isStepBody && store.scaffoldFormStep === 0;

    return (
      <Modal
        theme={theme}
        size={scaffoldFormContext?.size || 'md'}
        contentClassName={scaffoldFormContext?.className}
        show={!!scaffoldFormContext}
        onHide={this.handleCancelClick}
        className="ae-scaffoldForm-Modal :AMISCSSWrapper"
        closeOnEsc={!store.scaffoldFormBuzy}
      >
        <div className={cx('Modal-header')}>
          {!store.scaffoldFormBuzy ? (
            <a
              data-position="left"
              onClick={this.handleCancelClick}
              className={cx('Modal-close')}
            >
              <Icon icon="close" className="icon" />
            </a>
          ) : null}
          <div className={cx('Modal-title')}>{scaffoldFormContext?.title}</div>
        </div>
        <div className={cx('Modal-body')}>
          {scaffoldFormContext ? (
            render(
              this.buildSchema(),
              {
                data: store.scaffoldData,
                onValidate: scaffoldFormContext.validate,
                scopeRef: this.scopeRef,
                manager
              },
              {
                ...manager.env,
                session: 'scaffold-dialog',
                theme: theme
              }
            )
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className={cx('Modal-footer')}>
          {store.scaffoldFormBuzy || store.scaffoldError ? (
            <div className={cx('Dialog-info')} key="info">
              <Spinner size="sm" key="info" show={store.scaffoldFormBuzy} />
              {store.scaffoldError ? (
                <span className={cx('Dialog-error')}>
                  {store.scaffoldError}
                </span>
              ) : null}
            </div>
          ) : null}
          {isStepBody && canSkip && isFirstStep && (
            <Button
              onClick={this.handleConfirmClick}
              disabled={store.scaffoldFormBuzy}
            >
              Skip Wizard
            </Button>
          )}
          {isStepBody && !isFirstStep && (
            <Button
              level="primary"
              onClick={this.goToPrevStep}
              disabled={store.scaffoldFormBuzy}
            >
              Previous
            </Button>
          )}
          {isStepBody && !isLastStep && (
            <Button
              level="primary"
              onClick={this.goToNextStep}
              disabled={store.scaffoldFormBuzy}
            >
              Next step
            </Button>
          )}
          {(!isStepBody || isLastStep) && (
            <Button
              level="primary"
              onClick={this.handleConfirmClick}
              disabled={store.scaffoldFormBuzy}
            >
              confirm
            </Button>
          )}
          <Button onClick={this.handleCancelClick}>取消</Button>
        </div>
      </Modal>
    );
  }

  // _render() {
  //   const {store, theme, manager} = this.props;

  //   return render(
  //     {
  //       type: 'dialog'
  //     },
  //     this.buildSchema(),
  //     {
  //       ...manager.env,
  //       seesion: 'scaffold-dialog',
  //       theme: theme
  //     }
  //   );
  // }
}
