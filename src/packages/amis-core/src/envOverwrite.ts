/**
 * @file is used to use different configurations on mobile devices or in different language environments
 */

import {JSONValueMap, findObjectsWithKey} from './utils/helper';
import isPlainObject from 'lodash/isPlainObject';
const isMobile = (window as any).matchMedia?.('(max-width: 768px)').matches
  ? true
  : false;

// addSchemaFilter cannot be used here because a deeper replacement is required, such as options in select
export const envOverwrite = (schema: any, locale?: string) => {
  return JSONValueMap(
    schema,
    (value: any) => {
      if (!isPlainObject(value)) {
        return value;
      }

      if (locale && value[locale]) {
        const newValue = Object.assign({}, value, value[locale]);
        delete newValue[locale];
        return newValue;
      } else if (isMobile && value.mobile) {
        const newValue = Object.assign({}, value, value.mobile);
        delete newValue.mobile;
        return newValue;
      }
    },
    true
  );
};
