/**
 * Class name input box + custom style source code editor
 */
import React, {useEffect, useRef, useState} from 'react';
import {Editor, Overlay, PopOver} from '@/packages/amis-ui/src';
import {FormControlProps, FormItem} from 'amis-core';
// @ts-ignore
import {parse as cssParse} from 'amis-postcss';
import {PlainObject} from './types';
import isObject from 'lodash/isObject';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import {Icon} from '../../icons/index';

const editorPlaceholder = `Custom styles are only effective for the current component. Example:
// Current level
root {
  color: #000;
}
// Sub-level
.text-color: {
  color: #fff;
}
`;

const editorOptions = {
  autoIndent: true,
  formatOnType: true,
  formatOnPaste: true,
  selectOnLineNumbers: true,
  scrollBeyondLastLine: false,
  folding: true,
  minimap: {
    enabled: false
  },
  scrollbar: {
    alwaysConsumeMouseWheel: false
  },
  bracketPairColorization: {
    enabled: true
  },
  automaticLayout: true,
  lineNumbers: 'off',
  glyphMargin: false,
  wordWrap: 'on',
  lineDecorationsWidth: 0,
  lineNumbersMinChars: 0,
  overviewRulerBorder: false
};

function ThemeCssCode(props: FormControlProps) {
  const {data, onBulkChange} = props;
  const {wrapperCustomStyle} = data;
  const ref = useRef<HTMLDivElement>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [value, setValue] = useState('');

  // Add a space in front
  function getSpaceByDep(dep: number) {
    let spaces = '';
    for (let i = 0; i < dep; i++) {
      spaces += '  ';
    }
    return spaces;
  }

  function getCssAndSetValue(data: any, str: string, dep: number) {
    if (isEmpty(data)) {
      return '';
    }
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        if (isObject(data[key])) {
          str += getSpaceByDep(dep) + `${key} {\n`;
          str += getCssAndSetValue(data[key], '', dep + 1);
          str += getSpaceByDep(dep) + `}\n`;
          if (dep === 0) {
            str += '\n';
          }
        } else {
          str += getSpaceByDep(dep) + `${key}: ${data[key]};\n`;
        }
      }
    }
    return str;
  }

  useEffect(() => {
    setValue(getCssAndSetValue(wrapperCustomStyle, '', 0));
  }, []);

  function handleShowEditor() {
    setShowEditor(true);
  }

  // Recursively get custom styles
  function getStyle(style: any): PlainObject {
    const newStyle: PlainObject = {};
    if (isEmpty(style)) {
      return newStyle;
    }
    style.nodes.forEach((node: any) => {
      const {prop, value, selector} = node;
      if (value) {
        newStyle[prop] = value;
        if (node.important) {
          newStyle[prop] += ' !important';
        }
      }
      if (node.nodes) {
        newStyle[selector] = getStyle(node);
      }
    });
    return newStyle;
  }

  const editorChange = debounce((value: string) => {
    try {
      const style = cssParse(value);
      const newStyle: PlainObject = getStyle(style);
      onBulkChange &&
        onBulkChange({
          wrapperCustomStyle: newStyle
        });
    } catch (error) {}
  });

  function handleChange(value: string) {
    editorChange(value);
    setValue(value);
  }

  return (
    <>
      <div ref={ref} className="ThemeCssCode">
        <a
          onClick={handleShowEditor}
          className="ThemeCssCode-button ThemeCssCode-icon"
        >
          <Icon icon="expand-alt" className="icon" />
        </a>
        <div className="ThemeCssCode-editor-wrap" style={{height: '180px'}}>
          <Editor
            className="ThemeCssCode-custom-editor"
            value={value}
            placeholder={editorPlaceholder}
            language="scss"
            onChange={handleChange}
            options={editorOptions}
          />
        </div>
      </div>
      <Overlay
        container={document.body}
        placement="left"
        target={ref.current as any}
        show={showEditor}
        rootClose={false}
      >
        <PopOver overlay onHide={() => setShowEditor(false)}>
          <div className="ThemeCssCode-editor">
            <div className="ThemeCssCode-editor-title">Editor Style</div>
            <div className="ThemeCssCode-editor-close">
              <a
                onClick={() => setShowEditor(false)}
                className="ThemeCssCode-icon"
              >
                <Icon icon="close" className="icon" />
              </a>
            </div>
            <div className="ThemeCssCode-editor-content">
              <div
                className="ThemeCssCode-editor-wrap"
                style={{height: '460px'}}
              >
                <Editor
                  value={value}
                  placeholder={editorPlaceholder}
                  language="scss"
                  onChange={handleChange}
                  options={editorOptions}
                />
              </div>
            </div>
          </div>
        </PopOver>
      </Overlay>
    </>
  );
}

@FormItem({
  type: 'theme-cssCode',
  strictMode: false
})
export class ThemeCssCodeRenderer extends React.Component<FormControlProps> {
  render() {
    return <ThemeCssCode {...this.props} />;
  }
}
