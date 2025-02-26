import {registerActionPanel} from '../../actionsPanelManager';

registerActionPanel('custom', {
  label: 'Custom JS',
  tag: 'Other',
  description: 'Customize action logic through JavaScript',
  schema: {
    type: 'js-editor',
    allowFullscreen: true,
    required: true,
    name: 'script',
    label: 'Custom JS',
    mode: 'horizontal',
    options: {
      automaticLayout: true,
      lineNumbers: 'off',
      glyphMargin: false,
      tabSize: 2,
      fontSize: '12px',
      wordWrap: 'on',
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 0,
      selectOnLineNumbers: true,
      scrollBeyondLastLine: false,
      folding: true
    },
    className: 'ae-event-control-action-js-editor',
    value: `/* Custom JS usage instructions:
      * 1. Action execution function doAction, which can execute all types of actions
      * 2. The current component instance can be obtained through the context object context, for example, context.props can obtain the relevant properties of the component
      * 3. Event object event, execute event.stopPropagation() after doAction; it can prevent subsequent actions from being executed
      */
      const myMsg = 'I am custom JS';
      doAction({
      actionType: 'toast',
      args: {
      msg: myMsg
      }
      });
      `
  }
});
