/**
 * @file Background.ts
 * @description Background settings
 */

import axios from 'axios';
import cx from 'classnames';
import pick from 'lodash/pick';
import omit from 'lodash/omit';
import React, {useState, useEffect} from 'react';

import {FormItem} from '@/packages/amis-ui/src';

import type {FormControlProps} from '@/packages/amis-core/src';
import type {PlainObject} from './types';
import {getSchemaTpl} from '@/packages/amis-editor-core/src';
interface BackgroundProps extends FormControlProps {
  receiver?: string;
  value?: PlainObject;
  onChange: (value: PlainObject) => void;
}

const Background: React.FC<BackgroundProps> = props => {
  const [tabIndex, setTabIndex] = useState<number>(0);

  const {noImage, render} = props;

  const tabList = noImage
    ? ['pure', 'gradient', 'noset']
    : ['pure', 'gradient', 'image', 'noset'];

  function onChange(key: string) {
    return (e: any) => {
      const eventValue =
        e !== null && typeof e === 'object'
          ? typeof e.target === 'object'
            ? e.target.value
            : e.value
          : e;
      const {value, onChange} = props;
      let result = {
        ...value,
        [key]: eventValue
      };
      // Transparency
      if (key === 'alpha') {
        result.backgroundColor = result.backgroundColor?.replace(
          /,\s(1|0){1}.?[0-9]*\)$/g,
          `, ${e / 100})`
        );
      }
      // Location
      if (key === 'backgroundPosition') {
        result.backgroundPosition = e.target.getAttribute('data-pos');
      }
      // Background size tiling mode
      if (key === 'backgroundSize') {
        let bsValue = eventValue ?? '';
        let bsArr = bsValue.split(' ');
        // 0 bit size 1 bit tiling mode
        if (bsArr.length > 1) {
          result.backgroundSize = bsArr[0];
          result.backgroundRepeat = bsArr[1];
        } else {
          result.backgroundSize = bsValue;
          result.backgroundRepeat = 'no-repeat';
        }
      }
      // Gradient color angle
      if (key === 'angle') {
        let backgroundImage = result.backgroundImage ?? '';
        let lineraGradient =
          backgroundImage.indexOf('linear-gradient') !== -1
            ? backgroundImage
            : 'linear-gradient(180deg, transparent, transparent)';
        result.backgroundImage = lineraGradient.replace(
          /linear-gradient\(\d{1,3}/g,
          `linear-gradient(${eventValue}`
        );
      }
      // Gradient color
      if (key === 'gradientPrev' || key === 'gradientNext') {
        let backgroundImage = result.backgroundImage ?? '';
        let lineraGradient =
          backgroundImage.indexOf('linear-gradient') !== -1
            ? backgroundImage
            : 'linear-gradient(180deg, transparent, transparent)';
        let tempArr = lineraGradient.split(', ');
        let len = tempArr.length;
        // Foreground color
        if (key === 'gradientPrev') {
          if (len === 3) {
            tempArr[1] = eventValue;
          } else if (len === 5 || len === 6) {
            let startPos = 0;
            let endPos = 0;
            for (let i = 0; i < len; i++) {
              if (tempArr[i].indexOf('rgb') !== -1) {
                startPos = i;
              }
              if (tempArr[i].indexOf(')') !== -1 && endPos === 0) {
                endPos = i;
              }
            }
            // The background color is rgb or rgba
            if (endPos === len - 1) {
              tempArr.splice(1, 1, eventValue);
            } else {
              tempArr.splice(startPos, endPos + 1, eventValue);
            }
          } else if (len >= 7) {
            // Both foreground and background colors are RGB
            for (let i = 0; i < len; i++) {
              let pos = tempArr[i].indexOf(')');
              if (pos !== -1) {
                tempArr.splice(1, i, eventValue);
                break;
              }
            }
          }
        }
        //Background color
        if (key === 'gradientNext') {
          if (len === 3) {
            tempArr[2] = eventValue + ')';
          } else if (len === 5 || len === 6) {
            let startPos = 0;
            let endPos = 0;
            for (let i = 0; i < len; i++) {
              if (tempArr[i].indexOf('rgb') !== -1) {
                startPos = i;
              }
              if (tempArr[i].indexOf(')') !== -1 && endPos === 0) {
                endPos = i;
              }
            }
            // The background color is rgb or rgba
            if (endPos === len - 1) {
              tempArr.splice(startPos, endPos + 1, eventValue + ')');
            } else {
              tempArr.splice(-1, 1, eventValue + ')');
            }
          } else if (len >= 7) {
            // Both foreground and background colors are RGB
            let flag = 0;
            for (let i = 0; i < len; i++) {
              let pos = tempArr[i].indexOf('rgb');
              if (pos !== -1) {
                flag++;
                if (flag === 2) {
                  tempArr.splice(i, len - i + 1, eventValue);
                  break;
                }
              }
            }
          }
        }
        result.backgroundImage = tempArr.join(', ');
        result = pick(result, 'backgroundImage');
      }
      // Delete useless attributes
      if (key === 'alpha' || key === 'backgroundColor') {
        result = pick(result, 'backgroundColor');
      }
      if (
        key === 'backgroundImage' ||
        key === 'backgroundPosition' ||
        key === 'backgroundSize'
      ) {
        if (/linear-gradient/g.test(result?.backgroundImage)) {
          result = pick(
            result,
            'backgroundPosition',
            'backgroundSize',
            'backgroundRepeat'
          );
        } else {
          result = pick(
            result,
            'backgroundImage',
            'backgroundPosition',
            'backgroundSize',
            'backgroundRepeat'
          );
        }
      }
      onChange({
        ...omit(value, [
          'backgroundColor',
          'backgroundImage',
          'backgroundPosition',
          'backgroundSize',
          'backgroundRepeat',
          'angle',
          'gradientNext',
          'gradientPrev'
        ]),
        ...result
      });
    };
  }
  // Get the gradient color
  function getGradient(type: string) {
    const linearGradient = props.value?.backgroundImage;
    let prevColor = '';
    let nextColor = '';
    if (/linear-gradient/g.test(linearGradient)) {
      let tempArr = linearGradient.split(', ');
      let len = tempArr.length;
      if (len === 3) {
        // Non-RGB color
        prevColor = tempArr[1];
        nextColor = tempArr[2].slice(0, -1);
      } else if (len === 5 || len === 6) {
        // rgb or rgba color
        let startPos = 0;
        let endPos = 0;
        for (let i = 0; i < len; i++) {
          if (tempArr[i].indexOf('rgb') !== -1) {
            startPos = i;
          }
          if (tempArr[i].indexOf(')') !== -1 && endPos === 0) {
            endPos = i;
            if (i !== len - 1) {
              prevColor = tempArr.slice(startPos, i + 1).join(', ');
              nextColor = tempArr
                .slice(i + 1)
                .join('')
                .slice(0, -1);
            } else {
              prevColor = tempArr.slice(1, startPos).join('');
              nextColor = tempArr.slice(startPos, len - 1).join(', ');
            }
          }
        }
      } else if (len >= 7) {
        // Both foreground and background colors are rgb or rgba
        let prevStartPos = 0;
        let prevEndPos = 0;
        let nextStartPos = 0;
        let nextEndPos = 0;
        for (let i = 0; i < len; i++) {
          if (tempArr[i].indexOf('rgb') !== -1) {
            if (prevStartPos === 0) {
              prevStartPos = i;
            } else if (nextStartPos === 0) {
              nextStartPos = i;
            }
          }
          if (tempArr[i].indexOf(')') !== -1) {
            if (prevEndPos === 0) {
              prevEndPos = i;
            } else if (nextEndPos === 0) {
              nextEndPos = i;
            }
          }
        }
        prevColor = tempArr.slice(prevStartPos, prevEndPos + 1).join(', ');
        nextColor = tempArr.slice(nextStartPos, nextEndPos).join(', ');
      }
      linearGradient.split('');
    }
    const returnColor = type === 'prev' ? prevColor : nextColor;
    if (returnColor === 'transparent') {
      return '';
    }
    return returnColor;
  }
  // Get the gradient angle
  function getGradientAngle() {
    const linearGradient = props.value?.backgroundImage;
    let angle = 180;
    let match = /linear-gradient\((\d{1,3})/.exec(String(linearGradient || ''));
    if (match) {
      angle = +match[1];
    }
    return +angle;
  }
  // Background color transparency
  function getAlpha(rgba: any) {
    const val = rgba.match(/(\d(\.\d+)?)+/g);
    return val ? val[3] * 100 : '';
  }
  // Get the activated tab
  function setActiveTab() {
    const {value} = props;
    if (value?.backgroundColor || value?.alpha) {
      // Background color
      setTabIndex(0);
    } else if (value?.backgroundImage) {
      if (/linear-gradient/g.test(value.backgroundImage)) {
        // Gradient color
        setTabIndex(1);
      } else {
        // picture
        setTabIndex(2);
      }
    } else if (value?.backgroundPosition || value?.backgroundSize) {
      // picture
      setTabIndex(2);
    } else {
      // No background
      setTabIndex(tabList.length - 1);
    }
  }
  // Upload the image
  async function uploadImg(e: any) {
    const url = props?.receiver;
    if (!url) {
      console.warn('Image upload address not configured');
      return;
    }
    const forms = new FormData();
    const configs = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    };
    const file = e.target.files[0];
    forms.append('file', file);
    const result = await axios.post(url, forms, configs);
    if (result.status === 200) {
      const imgUrl = result.data.data.url;
      onChange('backgroundImage')(imgUrl);
    } else {
      alert(result?.data?.message || 'Upload failed');
    }
  }
  // Background image size setting
  function getbsValue() {
    let backgroundSize = props.value?.backgroundSize || 'auto';
    let backgroundRepeat = props.value?.backgroundRepeat;
    let returnVal = backgroundSize || '';
    if (backgroundSize === 'auto' && backgroundRepeat) {
      returnVal = backgroundSize + ' ' + backgroundRepeat;
    }
    return returnVal;
  }
  // Background image path setting
  function getbgValue() {
    let backgroundImage = props.data?.style?.backgroundImage;
    return /linear-gradient/g.test(backgroundImage) ? '' : backgroundImage;
  }
  // Clear background color, gradient color, background image
  function clearValues() {
    const {value, onChange} = props;
    const result = {
      ...value,
      backgroundSize: '',
      backgroundPosition: '',
      backgroundColor: '',
      backgroundImage: ''
    };
    onChange(result);
  }

  function tabChange(index: number, item: string) {
    if (item === 'noset') {
      clearValues();
    }
    setTabIndex(index);
  }

  function handleChange(key: string, keyValue: string | number) {
    const {value, onChange} = props;

    let result = {};
    if (key === 'backgroundColor') {
      result = {
        ...omit(value, [
          'backgroundImage',
          'backgroundPosition',
          'backgroundSize',
          'backgroundRepeat',
          'angle'
        ]),
        [key]: keyValue
      };
    } else if (key === 'angle') {
      keyValue = keyValue || 0;
      const linearGradient = value?.backgroundImage;
      let backgroundImage = linearGradient?.replace(
        /(\d{1,})?you/,
        `${keyValue}you`
      );
      result = {
        ...value,
        backgroundImage
      };
    } else {
      result = {
        ...value,
        [key]: keyValue
      };
    }

    onChange(result);
  }

  const currentItem = tabList[tabIndex];
  useEffect(() => {
    setActiveTab();
  }, []);

  return (
    <div className="ae-Background">
      <div className="ae-Background_tabs">
        <ul className="ae-Background_tabs-nav">
          {tabList.map((item: string, index: number) => {
            return (
              <li
                key={index}
                className={cx(item, {
                  active: tabIndex === index
                })}
                onClick={() => tabChange(index, item)}
              ></li>
            );
          })}
        </ul>
        <div className="ae-Background_tabs-content">
          {/* solid color*/}
          {currentItem === 'pure' && (
            <div className="ae-Background_setting">
              {render(
                'backgroundColor',
                {
                  type: 'input-color',
                  label: 'background color',
                  format: 'rgba',
                  mode: 'normal',
                  value: props.value?.backgroundColor
                },
                {
                  onChange: (value: string) =>
                    handleChange('backgroundColor', value)
                }
              )}
            </div>
          )}
          {/* TODO: Gradient colors require a separate gradient color slider */}
          {/* Gradient color */}
          {currentItem === 'gradient' && (
            <div className="ae-Background_setting">
              <div className="ae-Background_setting-item">
                <div className="ae-Background_setting-item_color">
                  {render(
                    'prev',
                    {
                      type: 'input-color',
                      label: 'Start color',
                      clearable: false,
                      placeholder: 'Starting color',
                      inputClassName: 'ae-Background-colorpicker',
                      value: getGradient('prev')
                    },
                    {
                      onChange: onChange('gradientPrev')
                    }
                  )}
                </div>
                <div className="ae-Background_setting-item_pic"></div>
                <div className="ae-Background_setting-item_color">
                  {render(
                    'next',
                    {
                      type: 'input-color',
                      label: 'end color',
                      clearable: false,
                      placeholder: 'end color',
                      inputClassName: 'ae-Background-colorpicker',
                      value: getGradient('next')
                    },
                    {
                      onChange: onChange('gradientNext')
                    }
                  )}
                </div>
              </div>
              <div className="ae-Background_setting-item">
                {render(
                  'gradient',
                  {
                    type: 'input-number',
                    label: 'gradient angle',
                    mode: 'row',
                    step: 10,
                    min: 0,
                    max: 360,
                    value: getGradientAngle(),
                    description:
                      '* Angle range 0-360 degrees, 0 degrees means gradient from bottom to top'
                  },
                  {
                    onChange: (value: string) => handleChange('angle', value)
                  }
                )}
              </div>
            </div>
          )}
          {/* picture*/}
          {currentItem === 'image' && (
            <div className="ae-Background_setting">
              {render('image', {
                type: 'group',
                mode: 'horizontal',
                body: [
                  getSchemaTpl('backgroundImageUrl', {
                    name: 'backgroundImage',
                    placeholder: 'Click or drag the image to upload',
                    fixedSize: true,
                    value: getbgValue(),
                    onChange: onChange('backgroundImage'),
                    fixedSizeClassName: 'ae-Background-upload',
                    accept: '.jpg,.png,.svg,.gif',
                    crop: true,
                    columnRatio: 6,
                    horizontal: {
                      left: 4,
                      right: 8
                    }
                  }),
                  {
                    type: '',
                    label: 'image location',
                    name: 'backgroundPosition',
                    asFormItem: true,
                    columnRatio: 6,
                    horizontal: {
                      left: 4,
                      right: 8
                    },
                    children: () => (
                      <ul className="ae-Background_setting—pos">
                        {[
                          '0 0',
                          '50% 0',
                          '100% 0',
                          '0 50%',
                          '50% 50%',
                          '100% 50%',
                          '0 100%',
                          '50% 100%',
                          '100% 100%'
                        ].map((item: string) => {
                          return (
                            <li
                              key={item}
                              data-pos={item}
                              className={cx('ae-Background_setting—pos_item', {
                                active: item === props.value?.backgroundPosition
                              })}
                              onClick={onChange('backgroundPosition')}
                            />
                          );
                        })}
                      </ul>
                    )
                  }
                ]
              })}

              {render(
                'size',
                {
                  type: 'select',
                  label: 'Image size',
                  name: 'backgroundSize',
                  mode: 'horizontal',
                  placeholder: 'Image size',
                  value: getbsValue(),
                  options: [
                    {
                      label: 'Default',
                      value: 'auto'
                    },
                    {
                      label: 'full',
                      value: 'cover'
                    },
                    {
                      label: 'suitable',
                      value: 'contain'
                    },
                    {
                      label: 'Stretch',
                      value: '100%'
                    },
                    {
                      label: 'tiling',
                      value: 'auto repeat'
                    },
                    {
                      label: 'Horizontal tiling',
                      value: 'auto repeat-x'
                    },
                    {
                      label: 'vertical tiling',
                      value: 'auto repeat-y'
                    },
                    {
                      label: 'Original size',
                      value: 'auto no-repeat'
                    }
                  ]
                },
                {
                  onChange: (value: string) =>
                    handleChange('backgroundSize', value)
                }
              )}
            </div>
          )}
          {/* Do not set background */}
          {currentItem === 'noset' && (
            <div className="ae-Background_setting noset"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Background;

@FormItem({type: 'style-background'})
export class BackgroundRenderer extends React.Component<FormControlProps> {
  render() {
    return <Background {...this.props} />;
  }
}
