import type {Colors, PlainObject, ThemeDefinition} from './declares';
const COLORLABELMAP: PlainObject = {
  main: 'main color',
  default: 'Normal',
  active: 'click',
  hover: 'suspend',
  bg: 'background',
  strong: 'Emphasis/Text Title',
  lessStrong: 'Second emphasis/text title',
  info: 'Secondary information',
  disabledInfo: 'Gray information',
  border: 'stroke/dividing line',
  cardBg: 'Card background color',
  none: 'transparent'
};

interface Options {
  show?: boolean;
  label: string;
  value: string;
  realValue?: any;
  children?: Options[];
}

export interface GlobalData {
  colorOptions?: Options[];
  fontFamilyOptions?: Options[];
  fontSizeOptions?: Options[];
  lineHeightOptions?: Options[];
  fontWeightOptions?: Options[];
  borderRadiusOptions?: Options[];
  borderWidthOptions?: Options[];
  borderStyleOptions?: Options[];
  sizesOptions?: Options[];
  shadowOptions?: Options[];
}

export function getGlobalData(data: ThemeDefinition | undefined): GlobalData {
  if (!data || !data.global) {
    return {};
  }
  const {colors, fonts, borders, sizes, shadows} = data.global;

  const colorOptions: Options[] = [];
  const fontFamilyOptions: Options[] = [];
  const fontSizeOptions: Options[] = [];
  const fontWeightOptions: Options[] = [];
  const lineHeightOptions: Options[] = [];
  const borderRadiusOptions: Options[] = [];
  const borderWidthOptions: Options[] = [];
  const borderStyleOptions: Options[] = [];
  const sizesOptions: Options[] = [];
  const shadowOptions: Options[] = [];

  // Parse the color
  function getGlobalColors(item: {label: string; token: string; body: Colors}) {
    const children: Options[] = [];
    item.body.common.forEach((common, i: number) => {
      children.push({
        label: common.label,
        value: `var(${item.token}${common.color + 1})`,
        realValue: item.body.colors[common.color].color
      });
    });
    // if (item.token === '--colors-neutral-fill-') {
    //   children.push({
    //     label: COLORLABELMAP['none'],
    //     value: `var(${item.token}none)`
    //   });
    // }
    return {
      label: item.label,
      value: item.token,
      children: children
    };
  }

  colorOptions.push({
    label: 'Brand color',
    value: 'brand',
    children: [getGlobalColors(colors.brand)]
  });

  const neutralColors: any = {
    label: 'Neutral color',
    value: 'neutral',
    children: []
  };
  colors.neutral.body.forEach((color, i: number) => {
    neutralColors.children.push(getGlobalColors(color));
  });
  colorOptions.push(neutralColors);
  const funcColors: any = {
    label: 'Secondary color',
    value: 'neutral',
    children: []
  };
  colors.func.body.forEach((color, i: number) => {
    funcColors.children.push(getGlobalColors(color));
  });
  colorOptions.push(funcColors);

  // Parse text
  for (let k in fonts) {
    let key = k as 'base' | 'size' | 'lineHeight' | 'weight';
    const options = {
      size: fontSizeOptions,
      lineHeight: lineHeightOptions,
      weight: fontWeightOptions
    };
    const children: {label: string; value: string; realValue: string}[] = [];
    if (key !== 'base') {
      fonts[key].body.forEach((font, i: number) => {
        children.push({
          ...font,
          label: `${font.label}(${font.value})`,
          value: `var(${font.token})`,
          realValue: `${font.value}`
        });
      });
      options[key].push(...children);
    } else {
      fonts['base'].body.forEach((font, i: number) => {
        children.push({
          ...font,
          label: font.label || font.value,
          value: font.value,
          realValue: font.value
        });
      });
      fontFamilyOptions.push(...children);
    }
  }

  // parse the border
  for (let k in borders) {
    let key = k as 'width' | 'style' | 'radius';
    const options = {
      width: borderWidthOptions,
      style: borderStyleOptions,
      radius: borderRadiusOptions
    };
    const children: Options[] = [];
    borders[key].body.forEach((border, i: number) => {
      children.push({
        label:
          key === 'style' ? border.label : `${border.label}(${border.value})`,
        realValue: border.value,
        value: `var(${border.token})`
      });
    });
    options[key].push(...children);
  }

  // Parse common sizes
  sizes.size.body.forEach(size => {
    sizesOptions.push({
      label: `${size.label}(${size.value})`,
      value: `var(${size.token})`,
      realValue: size.value
    });
  });

  // Parse the extended size
  const baseSizeStart = sizes.size.start;
  const baseSizeStartNumber = parseFloat(baseSizeStart);
  const baseSizeStartUnit = baseSizeStart.replace(
    baseSizeStartNumber.toString(),
    ''
  );
  const baseSizeBase = sizes.size.base;

  for (let i = 1; i <= 50; i++) {
    const realValue =
      (i - 1) * baseSizeBase + baseSizeStartNumber + baseSizeStartUnit;
    sizesOptions.push({
      label: `Size ${i}(${realValue})`,
      value: `var(--sizes-base-${i})`,
      realValue
    });
  }

  // Analyze the shadow
  shadows.shadow.body.forEach(shadow => {
    shadowOptions.push({
      label: shadow.label,
      value: `var(${shadow.token})`,
      realValue: shadow.value
    });
  });

  return {
    colorOptions,
    fontFamilyOptions,
    fontSizeOptions,
    lineHeightOptions,
    fontWeightOptions,
    borderRadiusOptions,
    borderWidthOptions,
    borderStyleOptions,
    sizesOptions,
    shadowOptions
  };
}
