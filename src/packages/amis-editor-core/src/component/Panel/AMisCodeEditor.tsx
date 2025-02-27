import React from 'react';
import {Editor} from '@/packages/amis-ui/src';
import {
  isObjectShallowModified,
  guid,
  diff,
  filterSchemaForConfig
} from '../../util';
import cx from 'classnames';
import {prompt, toast} from '@/packages/amis-ui/src';
import debounce from 'lodash/debounce';
import isArray from 'lodash/isArray';
import findIndex from 'lodash/findIndex';
import {parse, stringify} from 'json-ast-comments';
import isPlainObject from 'lodash/isPlainObject';

const internalSchema = /^\/schemas\/(.*).json$/;

async function buildSchema(
  schemaUrl: string,
  definition: string,
  fileUri: string,
  origin: any
) {
  const schemas: Array<{
    uri: string;
    fileMatch?: Array<any>;
    schema: any;
  }> = Array.isArray(origin) ? origin.concat() : [];

  // The development environment directly reads the local schema.json file.
  if (process.env.NODE_ENV !== 'production') {
    schemas.some(item => item.uri === schemaUrl) ||
      schemas.push({
        uri: schemaUrl,
        // @ts-ignore
        schema: await import('amis/schema.json').then(item => item.default)
      });
  }

  if (internalSchema.test(definition)) {
    const rawName = RegExp.$1;
    const uri = `${schemaUrl.replace(
      /^(\w+\:\/\/[^\/]+)\/.*$/,
      '$1'
    )}/schemas/${rawName}.json`;

    // If it exists, delete it first
    const idx = findIndex(schemas, item => item.fileMatch?.[0] === fileUri);
    if (~idx) {
      schemas.splice(idx, 1);
    }

    schemas.push({
      uri,
      fileMatch: [fileUri],
      schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $ref: `${schemaUrl}#/definitions/${rawName}`
      }
    });
  }

  return schemas;
}

const codeErrorWarning = debounce(e => {
  toast.warning(
    `The code is wrong. The error is\n ${e.toString().split('\n')[1]}`
  );
}, 3000);

export interface AMisCodeEditorProps {
  value: any;
  onChange: (value: any, diff: any) => void;
  onPaste?: (e: any) => void;
  disabled?: boolean;
  $schemaUrl?: string;
  $schema?: string;
  className?: string;
  theme?: string;
}

export default class AMisCodeEditor extends React.Component<AMisCodeEditorProps> {
  state = {
    wrongSchema: '',
    value: this.props.value,
    contents: this.obj2str(this.props.value, this.props)
  };
  lastResult: any;
  toDispose: Array<() => void> = [];
  editor: any;
  monaco: any;
  model: any;
  decorations: any;
  uri = `isda://schema/${guid()}.json`;

  componentDidUpdate(prevProps: AMisCodeEditorProps) {
    const props = this.props;

    if (prevProps.$schema !== props.$schema && this.monaco) {
      this.changeJsonOptions(props);
    }

    if (
      isObjectShallowModified(props.value, prevProps.value) &&
      isObjectShallowModified(props.value, this.lastResult)
    ) {
      this.lastResult = null;

      this.setState({
        value: props.value,
        contents: this.obj2str(props.value, props)
      });
    }
  }

  obj2str(value: any, props: AMisCodeEditorProps) {
    // Hide public configuration
    value = filterSchemaForConfig(value);

    if (!isArray(value)) {
      value = {
        type: value?.type,
        ...value
      };
    }

    if (isArray(value)) {
      return stringify(value);
    } else if (!value.type && props.$schema?.match(/PageSchema/i)) {
      value.type = 'page';
    } else if (!value.type) {
      delete value.type;
    }

    delete value.$schema;

    return stringify(value);
  }

  str2obj(str: string) {
    try {
      if (str === '') {
        return {};
      }
      const curObj = parse(str);
      if (codeErrorWarning) {
        // After the code conversion is successful, cancel the previous error prompt immediately (to avoid displaying the previous error prompt)
        codeErrorWarning.cancel();
      }
      return curObj;
    } catch (e) {
      codeErrorWarning(e);
      return null;
    }
  }

  emitChange = debounce(
    () => {
      const {onChange, value} = this.props;
      let ret: any = this.str2obj(this.state.contents);

      if (!ret || (!isPlainObject(ret) && !isArray(ret))) {
        this.setState({
          wrongSchema: this.state.contents
        });
        return;
      }

      this.setState({
        wrongSchema: ''
      });

      delete ret.$schema;

      // Complete the public configuration items
      ret = filterSchemaForConfig(ret, this.props.value);
      const diffResult = diff(this.lastResult || value, ret);
      this.lastResult = ret;

      onChange(ret, diffResult);
    },
    250,
    {
      trailing: true,
      leading: false
    }
  );

  async changeJsonOptions(props: AMisCodeEditorProps = this.props) {
    const monaco = this.monaco;
    let schemaUrl =
      props.$schemaUrl ||
      `${window.location.protocol}//${window.location.host}/schema.json`;

    if (schemaUrl.indexOf('/') === 0) {
      schemaUrl = `${window.location.protocol}//${window.location.host}${schemaUrl}`;
    }

    const schemas = await buildSchema(
      schemaUrl,
      props.$schema!,
      monaco.Uri.parse(this.uri).toString(),
      monaco.languages.json?.jsonDefaults.diagnosticsOptions.schemas
    );

    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      schemas: schemas,
      validate: true,
      enableSchemaRequest: true,
      allowComments: true
    });
  }

  editorFactory = (
    containerElement: HTMLElement,
    monaco: any,
    options: any
  ) => {
    const modelUri = monaco.Uri.parse(this.uri);
    this.model = monaco.editor.createModel(
      this.state.contents,
      'json',
      modelUri
    );
    return monaco.editor.create(containerElement, {
      autoIndent: true,
      formatOnType: true,
      formatOnPaste: true,
      selectOnLineNumbers: true,
      scrollBeyondLastLine: false,
      folding: true,
      scrollbar: {alwaysConsumeMouseWheel: false}, // The editor in the pop-up window editing sometimes cannot scroll
      minimap: {
        enabled: false
      },
      ...options,
      model: this.model
    });
  };

  editorDidMount = (editor: any, monaco: any) => {
    this.editor = editor;
    this.monaco = monaco;

    this.changeJsonOptions(this.props);
    this.props.onPaste &&
      this.toDispose.push(this.editor.onDidPaste(this.props.onPaste).dispose);
  };

  editorWillUnmount = (editor: any, monaco: any) => {
    this.toDispose.forEach(fn => fn());
    this.toDispose = [];
  };

  handleChange = (value: string) => {
    this.setState(
      {
        contents: value
      },
      this.emitChange
    );
  };

  handleBlur = async () => {
    const {wrongSchema, value} = this.state;
    if (!wrongSchema) {
      return;
    }
    const result = await prompt(
      [
        {
          className: 'w-full',
          type: 'tpl',
          label: false,
          tpl: 'Some of the changed data has not been saved because of incorrect format. Are you sure you want to discard these changes? '
        },
        {
          type: 'switch',
          label: false,
          option: 'View changes',
          name: 'diff',
          value: false
        },
        {
          visibleOn: 'this.diff',
          label: false,
          type: 'diff-editor',
          allowFullscreen: true,
          disabled: true,
          name: 'newValue',
          size: 'xxl',
          language: 'json',
          diffValue: '${oldValue}'
        }
      ],
      {
        oldValue: value,
        newValue: wrongSchema
      },
      'Please confirm'
    );
    if (result) {
      this.setState({wrongSchema: '', contents: stringify(value)});
    } else {
      this.editor.focus();
    }
  };

  render() {
    let {disabled, className, theme} = this.props;

    return (
      // @ts-ignore
      <Editor
        className={cx('amis-code-editor', className)}
        value={this.state.contents}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        language="json"
        theme={theme}
        editorFactory={this.editorFactory}
        editorDidMount={this.editorDidMount}
        editorWillUnmount={this.editorWillUnmount}
        options={{
          automaticLayout: true,
          lineNumbers: 'off',
          glyphMargin: false,
          tabSize: 2,
          wordWrap: 'on',
          lineDecorationsWidth: 0,
          lineNumbersMinChars: 0,
          selectOnLineNumbers: true,
          scrollBeyondLastLine: false,
          folding: true,
          minimap: {
            enabled: false
          },
          readOnly: disabled
        }}
      />
    );
  }
}
