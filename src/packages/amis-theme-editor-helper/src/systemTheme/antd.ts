import type {ThemeDefinition} from '../helper/declares';
import component from './component';

const antdData: ThemeDefinition = {
  config: {
    key: 'antd',
    name: 'Antd-like',
    description: 'Platform preset theme'
  },
  global: {
    fonts: {
      base: {
        body: [
          {value: '-apple-system'},
          {value: 'BlinkMacSystemFont'},
          {value: 'SF Pro SC'},
          {value: 'SF Pro Text'},
          {value: 'Helvetica Neue'},
          {value: 'Helvetica'},
          {value: 'PingFang SC'},
          {value: 'Segoe UI'},
          {value: 'Robot'},
          {value: 'Hiragino Sans GB'},
          {value: 'Arial'},
          {value: 'microsoft yahei ui'},
          {value: 'Microsoft YaHei'},
          {value: 'SimSun'},
          {value: 'sans-serif'}
        ],
        label: 'Basic font',
        token: '--fonts-base-family'
      },
      size: {
        body: [
          {
            label: 'Operation Title-Large',
            token: '--fonts-size-1',
            value: '48px'
          },
          {
            label: 'Operation Title-Medium',
            token: '--fonts-size-2',
            value: '40px'
          },
          {
            label: 'Operation Title-Small',
            token: '--fonts-size-3',
            value: '32px'
          },
          {label: 'Title-Large', token: '--fonts-size-4', value: '24px'},
          {label: 'Title-Medium', token: '--fonts-size-5', value: '18px'},
          {label: 'Title-Small', token: '--fonts-size-6', value: '16px'},
          {
            label: 'Main text-Normal-Large',
            token: '--fonts-size-7',
            value: '14px'
          },
          {label: 'Body-Normal-Small', token: '--fonts-size-8', value: '12px'},
          {label: 'Watermark text', token: '--fonts-size-9', value: '12px'}
        ],
        label: 'font size',
        token: '--fonts-size-'
      },
      weight: {
        body: [
          {label: 'Ultra bold(heavy)', token: '--fonts-weight-1', value: 900},
          {label: 'Extra bold', token: '--fonts-weight-2', value: 800},
          {label: 'Blod', token: '--fonts-weight-3', value: 700},
          {label: 'Semi bold', token: '--fonts-weight-4', value: 600},
          {label: 'Medium', token: '--fonts-weight-5', value: 500},
          {label: 'Regular', token: '--fonts-weight-6', value: 400},
          {label: 'Light', token: '--fonts-weight-7', value: 300},
          {label: 'Extra light(thin)', token: '--fonts-weight-8', value: 200},
          {label: 'Uitra light', token: '--fonts-weight-9', value: 100}
        ],
        label: 'font weight',
        token: '--fonts-weight-'
      },
      lineHeight: {
        body: [
          {label: 'Line-height-1', token: '--fonts-lineHeight-1', value: 1.3},
          {label: 'Line-height-2', token: '--fonts-lineHeight-2', value: 1.5},
          {label: 'Line-height-3', token: '--fonts-lineHeight-3', value: 1.7}
        ],
        label: 'row height',
        token: '--fonts-lineHeight-'
      }
    },
    sizes: {
      size: {
        base: 0.125,
        body: [
          {label: '无', token: '--sizes-size-0', value: '0rem', disabled: true},
          {
            label: 'car',
            token: '--sizes-size-1',
            value: 'auto',
            disabled: true
          },
          {
            label: 'Extra Small',
            token: '--sizes-size-2',
            value: '0.125rem'
          },
          {
            label: 'extremely small',
            token: '--sizes-size-3',
            value: '0.25rem'
          },
          {
            label: 'small',
            token: '--sizes-size-4',
            value: '0.375rem'
          },
          {
            label: 'Normal',
            token: '--sizes-size-5',
            value: '0.5rem'
          },
          {
            label: 'Medium',
            token: '--sizes-size-6',
            value: '0.625rem'
          },
          {
            label: 'big',
            token: '--sizes-size-7',
            value: '0.75rem'
          },
          {
            label: 'extremely large',
            token: '--sizes-size-8',
            value: '0.875rem'
          },
          {
            label: 'Extra Large',
            token: '--sizes-size-9',
            value: '1rem'
          }
        ],
        label: 'Size',
        start: '0.125rem',
        token: '--sizes-size-'
      }
    },
    colors: {
      func: {
        body: [
          {
            body: {
              main: '#ff4d4f',
              colors: [
                {
                  color: '#660a18',
                  index: 0,
                  label: '1-#660a18',
                  token: '--colors-error-1'
                },
                {
                  color: '#8c1523',
                  index: 1,
                  label: '2-#8c1523',
                  token: '--colors-error-2'
                },
                {
                  color: '#b32430',
                  index: 2,
                  label: '3-#b32430',
                  token: '--colors-error-3'
                },
                {
                  color: '#d9363e',
                  index: 3,
                  label: '4-#d9363e',
                  token: '--colors-error-4'
                },
                {
                  color: '#ff4d4f',
                  index: 4,
                  label: '5-#ff4d4f',
                  token: '--colors-error-5'
                },
                {
                  color: '#ff7070',
                  index: 5,
                  label: '6-#ff7070',
                  token: '--colors-error-6'
                },
                {
                  color: '#ff9694',
                  index: 6,
                  label: '7-#ff9694',
                  token: '--colors-error-7'
                },
                {
                  color: '#ffbab8',
                  index: 7,
                  label: '8-#ffbab8',
                  token: '--colors-error-8'
                },
                {
                  color: '#ffdddb',
                  index: 8,
                  label: '9-#ffdddb',
                  token: '--colors-error-9'
                },
                {
                  color: '#ffe7e6',
                  index: 9,
                  label: '10-#ffe7e6',
                  token: '--colors-error-10'
                }
              ],
              common: [
                {id: 'default', color: 4, label: 'Normal'},
                {id: 'active', color: 3, label: 'click'},
                {id: 'hover', color: 5, label: 'suspended'},
                {id: 'bg', color: 9, label: 'background'}
              ]
            },
            label: 'failure color',
            token: '--colors-error-'
          },
          {
            body: {
              main: '#faad14',
              colors: [
                {
                  color: '#613400',
                  index: 0,
                  label: '1-#613400',
                  token: '--colors-warning-1'
                },
                {
                  color: '#874d00',
                  index: 1,
                  label: '2-#874d00',
                  token: '--colors-warning-2'
                },
                {
                  color: '#ad6800',
                  index: 2,
                  label: '3-#ad6800',
                  token: '--colors-warning-3'
                },
                {
                  color: '#d48806',
                  index: 3,
                  label: '4-#d48806',
                  token: '--colors-warning-4'
                },
                {
                  color: '#faad14',
                  index: 4,
                  label: '5-#faad14',
                  token: '--colors-warning-5'
                },
                {
                  color: '#ffc443',
                  index: 5,
                  label: '6-#ffc443',
                  token: '--colors-warning-6'
                },
                {
                  color: '#ffd572',
                  index: 6,
                  label: '7-#ffd572',
                  token: '--colors-warning-7'
                },
                {
                  color: '#ffe4a1',
                  index: 7,
                  label: '8-#ffe4a1',
                  token: '--colors-warning-8'
                },
                {
                  color: '#fff2d0',
                  index: 8,
                  label: '9-#fff2d0',
                  token: '--colors-warning-9'
                },
                {
                  color: '#fff9e6',
                  index: 9,
                  label: '10-#fff9e6',
                  token: '--colors-warning-10'
                }
              ],
              common: [
                {id: 'default', color: 4, label: 'Normal'},
                {id: 'active', color: 3, label: 'click'},
                {id: 'hover', color: 5, label: 'suspended'},
                {id: 'bg', color: 9, label: 'background'}
              ]
            },
            label: 'Warning color',
            token: '--colors-warning-'
          },
          {
            body: {
              main: '#389e0d',
              colors: [
                {
                  color: '#010500',
                  index: 0,
                  label: '1-#010500',
                  token: '--colors-success-1'
                },
                {
                  color: '#092b00',
                  index: 1,
                  label: '2-#092b00',
                  token: '--colors-success-2'
                },
                {
                  color: '#135200',
                  index: 2,
                  label: '3-#135200',
                  token: '--colors-success-3'
                },
                {
                  color: '#237804',
                  index: 3,
                  label: '4-#237804',
                  token: '--colors-success-4'
                },
                {
                  color: '#389e0d',
                  index: 4,
                  label: '5-#389e0d',
                  token: '--colors-success-5'
                },
                {
                  color: '#55ab2d',
                  index: 5,
                  label: '6-#55ab2d',
                  token: '--colors-success-6'
                },
                {
                  color: '#74b852',
                  index: 6,
                  label: '7-#74b852',
                  token: '--colors-success-7'
                },
                {
                  color: '#95c47c',
                  index: 7,
                  label: '8-#95c47c',
                  token: '--colors-success-8'
                },
                {
                  color: '#b9d1ab',
                  index: 8,
                  label: '9-#b9d1ab',
                  token: '--colors-success-9'
                },
                {
                  color: '#d0dec8',
                  index: 9,
                  label: '10-#d0dec8',
                  token: '--colors-success-10'
                }
              ],
              common: [
                {id: 'default', color: 4, label: 'Normal'},
                {id: 'active', color: 3, label: 'click'},
                {id: 'hover', color: 5, label: 'suspended'},
                {id: 'bg', color: 9, label: 'background'}
              ]
            },
            label: 'success color',
            token: '--colors-success-'
          },
          {
            body: {
              colors: [
                {
                  color: '#002766',
                  index: 0,
                  label: '1-#002766',
                  token: '--colors-link-1'
                },
                {
                  color: '#003a8c',
                  index: 1,
                  label: '2-#003a8c',
                  token: '--colors-link-2'
                },
                {
                  color: '#0050b3',
                  index: 2,
                  label: '3-#0050b3',
                  token: '--colors-link-3'
                },
                {
                  color: '#096dd9',
                  index: 3,
                  label: '4-#096dd9',
                  token: '--colors-link-4'
                },
                {
                  color: '#1890ff',
                  index: 4,
                  label: '5-#1890ff',
                  token: '--colors-link-5'
                },
                {
                  color: '#45a8ff',
                  index: 5,
                  label: '6-#45a8ff',
                  token: '--colors-link-6'
                },
                {
                  color: '#74c0ff',
                  index: 6,
                  label: '7-#74c0ff',
                  token: '--colors-link-7'
                },
                {
                  color: '#a2d7ff',
                  index: 7,
                  label: '8-#a2d7ff',
                  token: '--colors-link-8'
                },
                {
                  color: '#d1ecff',
                  index: 8,
                  label: '9-#d1ecff',
                  token: '--colors-link-9'
                },
                {
                  color: '#e6f5ff',
                  index: 9,
                  label: '10-#e6f5ff',
                  token: '--colors-link-10'
                }
              ],
              common: [
                {id: 'default', color: 4, label: 'Normal'},
                {id: 'active', color: 3, label: 'click'},
                {id: 'hover', color: 5, label: 'suspended'},
                {id: 'bg', color: 9, label: 'background'}
              ]
            },
            label: 'Link color',
            token: '--colors-link-'
          },
          {
            body: {
              colors: [
                {
                  color: '#002766',
                  index: 0,
                  label: '1-#002766',
                  token: '--colors-info-1'
                },
                {
                  color: '#003a8c',
                  index: 1,
                  label: '2-#003a8c',
                  token: '--colors-info-2'
                },
                {
                  color: '#0050b3',
                  index: 2,
                  label: '3-#0050b3',
                  token: '--colors-info-3'
                },
                {
                  color: '#096dd9',
                  index: 3,
                  label: '4-#096dd9',
                  token: '--colors-info-4'
                },
                {
                  color: '#1890ff',
                  index: 4,
                  label: '5-#1890ff',
                  token: '--colors-info-5'
                },
                {
                  color: '#45a8ff',
                  index: 5,
                  label: '6-#45a8ff',
                  token: '--colors-info-6'
                },
                {
                  color: '#74c0ff',
                  index: 6,
                  label: '7-#74c0ff',
                  token: '--colors-info-7'
                },
                {
                  color: '#a2d7ff',
                  index: 7,
                  label: '8-#a2d7ff',
                  token: '--colors-info-8'
                },
                {
                  color: '#d1ecff',
                  index: 8,
                  label: '9-#d1ecff',
                  token: '--colors-info-9'
                },
                {
                  color: '#e6f5ff',
                  index: 9,
                  label: '10-#e6f5ff',
                  token: '--colors-info-10'
                }
              ],
              common: [
                {id: 'default', color: 4, label: 'Normal'},
                {id: 'active', color: 3, label: 'click'},
                {id: 'hover', color: 5, label: 'suspended'},
                {id: 'bg', color: 9, label: 'background'}
              ]
            },
            label: 'prompt color',
            token: '--colors-info-'
          },
          {
            body: {
              main: '#2468f2',
              colors: [
                {
                  color: '#001259',
                  index: 0,
                  label: '1-#001259',
                  token: '--colors-other-1'
                },
                {
                  color: '#001e80',
                  index: 1,
                  label: '2-#001e80',
                  token: '--colors-other-2'
                },
                {
                  color: '#0832a6',
                  index: 2,
                  label: '3-#0832a6',
                  token: '--colors-other-3'
                },
                {
                  color: '#144bcc',
                  index: 3,
                  label: '4-#144bcc',
                  token: '--colors-other-4'
                },
                {
                  color: '#2468f2',
                  index: 4,
                  label: '5-#2468f2',
                  token: '--colors-other-5'
                },
                {
                  color: '#528eff',
                  index: 5,
                  label: '6-#528eff',
                  token: '--colors-other-6'
                },
                {
                  color: '#7dadff',
                  index: 6,
                  label: '7-#7dadff',
                  token: '--colors-other-7'
                },
                {
                  color: '#a8caff',
                  index: 7,
                  label: '8-#a8caff',
                  token: '--colors-other-8'
                },
                {
                  color: '#d4e5ff',
                  index: 8,
                  label: '9-#d4e5ff',
                  token: '--colors-other-9'
                },
                {
                  color: '#e6f0ff',
                  index: 9,
                  label: '10-#e6f0ff',
                  token: '--colors-other-10'
                }
              ],
              common: [
                {id: 'default', color: 4, label: 'Normal'},
                {id: 'active', color: 3, label: 'click'},
                {id: 'hover', color: 5, label: 'suspended'},
                {id: 'bg', color: 9, label: 'background'}
              ]
            },
            label: 'Other colors',
            token: '--colors-other-'
          }
        ],
        label: 'Secondary color',
        token: 'func'
      },
      brand: {
        body: {
          colors: [
            {
              color: '#002766',
              index: 0,
              label: '1-#002766',
              token: '--colors-brand-1'
            },
            {
              color: '#003a8c',
              index: 1,
              label: '2-#003a8c',
              token: '--colors-brand-2'
            },
            {
              color: '#0050b3',
              index: 2,
              label: '3-#0050b3',
              token: '--colors-brand-3'
            },
            {
              color: '#096dd9',
              index: 3,
              label: '4-#096dd9',
              token: '--colors-brand-4'
            },
            {
              color: '#1890ff',
              index: 4,
              label: '5-#1890ff',
              token: '--colors-brand-5'
            },
            {
              color: '#45a8ff',
              index: 5,
              label: '6-#45a8ff',
              token: '--colors-brand-6'
            },
            {
              color: '#74c0ff',
              index: 6,
              label: '7-#74c0ff',
              token: '--colors-brand-7'
            },
            {
              color: '#a2d7ff',
              index: 7,
              label: '8-#a2d7ff',
              token: '--colors-brand-8'
            },
            {
              color: '#d1ecff',
              index: 8,
              label: '9-#d1ecff',
              token: '--colors-brand-9'
            },
            {
              color: '#e6f5ff',
              index: 9,
              label: '10-#e6f5ff',
              token: '--colors-brand-10'
            }
          ],
          common: [
            {id: 'default', color: 4, label: 'Normal'},
            {id: 'active', color: 3, label: 'click'},
            {id: 'hover', color: 5, label: 'suspended'},
            {id: 'bg', color: 9, label: 'background'}
          ]
        },
        label: 'Brand color',
        token: '--colors-brand-'
      },
      neutral: {
        body: [
          {
            body: {
              common: [
                {id: 'strong', color: 1, label: 'Emphasis/Text Title'},
                {
                  id: 'lessStrong',
                  color: 3,
                  label: 'Secondary emphasis/text title'
                },
                {id: 'info', color: 4, label: 'Assistive instructions'},
                {id: 'disabledInfo', color: 5, label: 'Disabled'},
                {id: 'white', color: 10, label: 'Pure white text'}
              ],
              colors: [
                {
                  color: '#070e14',
                  index: 0,
                  label: '0-#070e14',
                  token: '--colors-neutral-text-1'
                },
                {
                  color: '#151e26',
                  index: 1,
                  label: '1-#151e26',
                  token: '--colors-neutral-text-2'
                },
                {
                  color: '#303840',
                  index: 2,
                  label: '2-#303840',
                  token: '--colors-neutral-text-3'
                },
                {
                  color: '#5c6166',
                  index: 3,
                  label: '3-#5c6166',
                  token: '--colors-neutral-text-4'
                },
                {
                  color: '#84888c',
                  index: 4,
                  label: '4-#84888c',
                  token: '--colors-neutral-text-5'
                },
                {
                  color: '#b8bcbf',
                  index: 5,
                  label: '5-#b8bcbf',
                  token: '--colors-neutral-text-6'
                },
                {
                  color: '#d4d7d9',
                  index: 6,
                  label: '6-#d4d7d9',
                  token: '--colors-neutral-text-7'
                },
                {
                  color: '#e8e9eb',
                  index: 7,
                  label: '7-#e8e9eb',
                  token: '--colors-neutral-text-8'
                },
                {
                  color: '#f2f4f5',
                  index: 8,
                  label: '8-#f2f4f5',
                  token: '--colors-neutral-text-9'
                },
                {
                  color: '#f7f9fa',
                  index: 9,
                  label: '9-#f7f9fa',
                  token: '--colors-neutral-text-10'
                },
                {
                  color: '#ffffff',
                  index: 10,
                  label: '10-#ffffff',
                  token: '--colors-neutral-text-11'
                }
              ]
            },
            label: 'character',
            token: '--colors-neutral-text-'
          },
          {
            body: {
              none: 'transparent',
              common: [
                {id: 'fill-white', color: 10, label: 'Pure white fill'},
                {id: 'fill-1', color: 9, label: 'Light/disabled background'},
                {id: 'fill-2', color: 7, label: 'dividing line'},
                {id: 'fill-3', color: 6, label: 'Dark/gray background floating'}
              ],
              colors: [
                {
                  color: '#070e14',
                  index: 0,
                  label: '0-#070e14',
                  token: '--colors-neutral-fill-1'
                },
                {
                  color: '#151e26',
                  index: 1,
                  label: '1-#151e26',
                  token: '--colors-neutral-fill-2'
                },
                {
                  color: '#303840',
                  index: 2,
                  label: '2-#303840',
                  token: '--colors-neutral-fill-3'
                },
                {
                  color: '#5c6166',
                  index: 3,
                  label: '3-#5c6166',
                  token: '--colors-neutral-fill-4'
                },
                {
                  color: '#84888c',
                  index: 4,
                  label: '4-#84888c',
                  token: '--colors-neutral-fill-5'
                },
                {
                  color: '#b8bcbf',
                  index: 5,
                  label: '5-#b8bcbf',
                  token: '--colors-neutral-fill-6'
                },
                {
                  color: '#d4d7d9',
                  index: 6,
                  label: '6-#d4d7d9',
                  token: '--colors-neutral-fill-7'
                },
                {
                  color: '#e8e9eb',
                  index: 7,
                  label: '7-#e8e9eb',
                  token: '--colors-neutral-fill-8'
                },
                {
                  color: '#f2f4f5',
                  index: 8,
                  label: '8-#f2f4f5',
                  token: '--colors-neutral-fill-9'
                },
                {
                  color: '#f7f9fa',
                  index: 9,
                  label: '9-#f7f9fa',
                  token: '--colors-neutral-fill-10'
                },
                {
                  color: '#ffffff',
                  index: 10,
                  label: '10-#ffffff',
                  token: '--colors-neutral-fill-11'
                }
              ]
            },
            label: 'Fill',
            token: '--colors-neutral-fill-'
          },
          {
            body: {
              common: [
                {id: 'line-1', color: 9, label: '浅'},
                {id: 'line-2', color: 7, label: 'Normal'},
                {id: 'line-3', color: 5, label: '深'},
                {id: 'line-4', color: 3, label: '重'}
              ],
              colors: [
                {
                  color: '#070e14',
                  index: 0,
                  label: '0-#070e14',
                  token: '--colors-neutral-line-1'
                },
                {
                  color: '#151e26',
                  index: 1,
                  label: '1-#151e26',
                  token: '--colors-neutral-line-2'
                },
                {
                  color: '#303840',
                  index: 2,
                  label: '2-#303840',
                  token: '--colors-neutral-line-3'
                },
                {
                  color: '#5c6166',
                  index: 3,
                  label: '3-#5c6166',
                  token: '--colors-neutral-line-4'
                },
                {
                  color: '#84888c',
                  index: 4,
                  label: '4-#84888c',
                  token: '--colors-neutral-line-5'
                },
                {
                  color: '#b8bcbf',
                  index: 5,
                  label: '5-#b8bcbf',
                  token: '--colors-neutral-line-6'
                },
                {
                  color: '#d4d7d9',
                  index: 6,
                  label: '6-#d4d7d9',
                  token: '--colors-neutral-line-7'
                },
                {
                  color: '#e8e9eb',
                  index: 7,
                  label: '7-#e8e9eb',
                  token: '--colors-neutral-line-8'
                },
                {
                  color: '#f2f4f5',
                  index: 8,
                  label: '8-#f2f4f5',
                  token: '--colors-neutral-line-9'
                },
                {
                  color: '#f7f9fa',
                  index: 9,
                  label: '9-#f7f9fa',
                  token: '--colors-neutral-line-10'
                },
                {
                  color: '#ffffff',
                  index: 10,
                  label: '10-#ffffff',
                  token: '--colors-neutral-line-11'
                }
              ]
            },
            label: 'Line',
            token: '--colors-neutral-line-'
          }
        ],
        label: 'Neutral color',
        token: '--colors-neutral-'
      },
      data: {
        label: 'data color',
        body: [
          {
            label: 'Default',
            token: 'dataColor1',
            colors: [
              {
                value: '#1890ff'
              },
              {
                value: '#a04bfa'
              },
              {
                value: '#fc2d98'
              },
              {
                value: '#c26711'
              },
              {
                value: '#579c0e'
              },
              {
                value: '#10b35f'
              },
              {
                value: '#129dc7'
              }
            ]
          },
          {
            label: 'classic',
            token: 'dataColor2',
            colors: [
              {
                value: '#1890ff'
              },
              {
                value: '#c735fc'
              },
              {
                value: '#fc3f42'
              },
              {
                value: '#72910d'
              },
              {
                value: '#11ba38'
              },
              {
                value: '#129dc7'
              },
              {
                value: '#815bfc'
              }
            ]
          },
          {
            label: 'Transition',
            token: 'dataColor3',
            colors: [
              {
                value: '#1890ff'
              },
              {
                value: '#4878fa'
              },
              {
                value: '#6568fc'
              },
              {
                value: '#815bfc'
              },
              {
                value: '#a04bfa'
              },
              {
                value: '#c735fc'
              },
              {
                value: '#f61efa'
              }
            ]
          }
        ]
      }
    },
    borders: {
      style: {
        body: [
          {
            label: 'None',
            token: '--borders-style-1',
            value: 'none',
            disabled: true
          },
          {label: '实线', token: '--borders-style-2', value: 'solid'},
          {label: '虚线', token: '--borders-style-3', value: 'dashed'},
          {label: '点线', token: '--borders-style-4', value: 'dotted'}
        ],
        label: 'Style',
        token: '--borders-style-'
      },
      width: {
        body: [
          {
            label: 'None',
            token: '--borders-width-1',
            value: '0px',
            disabled: true
          },
          {label: 'Normal', token: '--borders-width-2', value: '1px'},
          {label: '中粗', token: '--borders-width-3', value: '2px'},
          {label: '特粗', token: '--borders-width-4', value: '4px'}
        ],
        label: 'thickness',
        token: '--borders-width-'
      },
      radius: {
        body: [
          {
            label: 'None',
            token: '--borders-radius-1',
            value: '0px',
            disabled: true
          },
          {
            label: 'Rounded corners 1',
            token: '--borders-radius-2',
            value: '1px'
          },
          {
            label: 'Rounded corners 2',
            token: '--borders-radius-3',
            value: '2px'
          },
          {
            label: 'Rounded corners 3',
            token: '--borders-radius-4',
            value: '6px'
          },
          {
            label: 'Rounded corners 4',
            token: '--borders-radius-5',
            value: '8px'
          },
          {
            label: 'Rounded corners 5',
            token: '--borders-radius-6',
            value: '10px'
          },
          {
            label: 'Rounded corners 6',
            token: '--borders-radius-7',
            value: '50%'
          }
        ],
        label: 'Rounded corners',
        token: '--borders-radius-'
      }
    },
    shadows: {
      shadow: {
        body: [
          {
            label: 'No shadow',
            token: '--shadows-shadow-none',
            value: [
              {
                x: '0px',
                y: '0px',
                blur: '0px',
                color: 'transparent',
                inset: false,
                spread: '0px'
              }
            ],
            disabled: true
          },
          {
            label: 'Shadow sm',
            token: '--shadows-shadow-sm',
            value: [
              {
                x: '0px',
                y: '1px',
                blur: '2px',
                color: 'rgba(0, 0, 0, 0.05)',
                inset: false,
                spread: '0px'
              }
            ]
          },
          {
            label: 'Shadow',
            token: '--shadows-shadow-normal',
            value: [
              {
                x: '0px',
                y: '1px',
                blur: '3px',
                color: 'rgba(0, 0, 0, 0.1)',
                inset: false,
                spread: '0px'
              },
              {
                x: '0px',
                y: '1px',
                blur: '2px',
                color: 'rgba(0, 0, 0, 0.06)',
                inset: false,
                spread: '0px'
              }
            ]
          },
          {
            label: 'shadow md',
            token: '--shadows-shadow-md',
            value: [
              {
                x: '0px',
                y: '4px',
                blur: '-1px',
                color: 'rgba(0, 0, 0, 0.1)',
                inset: false,
                spread: '0px'
              },
              {
                x: '0px',
                y: '2px',
                blur: '4px',
                color: 'rgba(0, 0, 0, 0.06)',
                inset: false,
                spread: '-1px'
              }
            ]
          },
          {
            label: 'shadow lg',
            token: '--shadows-shadow-lg',
            value: [
              {
                x: '0px',
                y: '10px',
                blur: '15px',
                color: 'rgba(0, 0, 0, 0.1)',
                inset: false,
                spread: '-3px'
              },
              {
                x: '0px',
                y: '4px',
                blur: '6px',
                color: 'rgba(0, 0, 0, 0.05)',
                inset: false,
                spread: '-2px'
              }
            ]
          },
          {
            label: 'Shadow xl',
            token: '--shadows-shadow-xl',
            value: [
              {
                x: '0px',
                y: '20px',
                blur: '25px',
                color: 'rgba(0, 0, 0, 0.1)',
                inset: false,
                spread: '-5px'
              },
              {
                x: '0px',
                y: '10px',
                blur: '10px',
                color: 'rgba(0, 0, 0, 0.04)',
                inset: false,
                spread: '-5px'
              }
            ]
          },
          {
            label: 'Shadow 2xl',
            token: '--shadows-shadow-2xl',
            value: [
              {
                x: '0px',
                y: '25px',
                blur: '50px',
                color: 'rgba(0, 0, 0, 0.25)',
                inset: false,
                spread: '-12px'
              }
            ]
          }
        ],
        label: 'Shadow',
        token: '--shadows-shadow-'
      }
    }
  },
  component
};

export default antdData;
