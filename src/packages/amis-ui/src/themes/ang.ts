import {theme, ClassNamesFn, makeClassnames} from '@/packages/amis-core/src';
export const classPrefix: string = 'a-';
export const classnames: ClassNamesFn = makeClassnames(classPrefix);

theme('ang', {
  classPrefix,
  classnames
});
