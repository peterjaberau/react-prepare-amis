/**
 * @file font.ts
 * @description A list of font options and font names
 * @link http://icode.baidu.com/repos/baidu/legend/frontend/tree/master:frontend/client/widgets/attributeEditor/stringAttributeEditor/fontFamilyAttributeEditor
 */

export const fontFamilyList = [
  {
    label: 'Default font',
    value: ''
  },
  {
    label: 'Times New Roman',
    value: 'Times New Roman'
  }
  /** I don't know if the following fonts are free for commercial use, so I've hidden them*/
  // {
  // label: 'Founder bold simplified',
  //   value: 'FZHei-B01S'
  // },
  // {
  // label: 'Simplified regular script',
  //   value: 'FZKai-Z03S'
  // },
  // {
  // label: 'Fangzhengshu Song Simplified',
  //   value: 'FZShuSong-Z01S'
  // },
  // {
  // label: 'Founder Fangsong Simplified',
  //   value: 'FZFangSong-Z02S'
  // },
  // {
  // label: 'Siyuan Ultra Fine',
  //   value: 'NotoSansSC-Thin'
  // },
  // {
  // label: 'Source Art Hyphen',
  //   value: 'NotoSansSC-Light'
  // },
  // {
  // label: 'Siyuan is normal',
  //   value: 'NotoSansSC-DemiLight'
  // },
  // {
  // label: 'Siyuan General',
  //   value: 'NotoSansSC-Regular'
  // },
  // {
  // label: 'Siyuan Medium Bold',
  //   value: 'NotoSansSC-Medium'
  // },
  // {
  // label: 'Source Art Bold',
  //   value: 'NotoSansSC-Bold'
  // },
  // {
  // label: 'Siyuan is very thick',
  //   value: 'NotoSansSC-Black'
  // },
  // {
  // label: 'Zhaoku high-end black',
  //   value: 'zcool-gdh'
  // },
  // {
  // label: 'Zhaocool happy style',
  //   value: 'HappyZcool'
  // }
  // {
  //   label: 'Arial',
  //   value: 'Arial'
  // },
  // {
  // label: 'Avant Garde',
  // value: 'Avant Garde'
  // },
  // {
  // label: 'Bodoni MT',
  //     value: 'Bodoni MT'
  // },
  // {
  //     label: 'Brush Script MT',
  //     value: 'Brush Script MT'
  // },
  // {
  // label: 'Consoles',
  // value: 'Consoles'
  // },
  // {
  //     label: 'Courier New',
  //     value: 'Courier New'
  // },
  // {
  //   label: 'Didot',
  // value: 'Didot'
  // },
  // {
  //   label: 'Georgia',
  //   value: 'Georgia'
  // },
  // {
  //   label: 'Garamond',
  //   value: 'Garamond'
  // },
  // {
  //   label: 'Helvetica',
  //   value: 'Helvetica'
  // },
  // {
  // label: 'Palatine',
  // value: 'Palatine'
  // },
  // {
  //   label: 'Rockwell',
  //   value: 'Rockwell'
  // },
  // {
  // label: 'Tahoma',
  // value: 'Tahoma'
  // },
  // {
  //   label: 'Times',
  //   value: 'Times'
  // },
  // {
  // label: 'Verdana',
  // value: 'Verdana'
  // }
];

export const fontFamilyMap = fontFamilyList.reduce((memo, current) => {
  return {
    ...memo,
    [current.label]: current.value
  };
}, {});

export const fontFamilyMirror = fontFamilyList.reduce((memo, current) => {
  return {
    ...memo,
    [current.value]: current.label
  };
}, {});
