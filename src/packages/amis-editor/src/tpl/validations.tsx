import {
  setSchemaTpl,
  isObject,
  defaultValue,
  getSchemaTpl,
  getI18nEnabled
} from 'amis-editor-core';
import {ValidationOptions} from '../component/BaseControl';
import {Schema, str2rules} from 'amis';
import {ValidatorTag} from '../validator';

import find from 'lodash/find';
import reduce from 'lodash/reduce';
import forEach from 'lodash/forEach';

setSchemaTpl('validations', function () {
  const options = [
    // {
    // label: 'Required',
    //     value: 'isRequired'
    // },
    {
      label: 'Email format',
      value: 'isEmail'
    },
    {
      label: 'Url format',
      value: 'isUrl'
    },
    {
      label: 'number',
      value: 'isNumeric'
    },
    {
      label: 'Letters',
      value: 'isAlpha'
    },
    {
      label: 'Letters and numbers',
      value: 'isAlphanumeric'
    },
    {
      label: 'Integer',
      value: 'isInt'
    },
    {
      label: 'Floating point number',
      value: 'isFloat'
    },
    {
      label: 'fixed length',
      value: 'isLength'
    },
    {
      label: 'maximum length',
      value: 'maxLength'
    },
    {
      label: 'Minimum length',
      value: 'minLength'
    },
    {
      label: 'maximum value',
      value: 'maximum'
    },
    {
      label: 'minimum value',
      value: 'minimum'
    },
    {
      label: 'Mobile phone number',
      value: 'isPhoneNumber'
    },
    {
      label: 'phone number',
      value: 'isTelNumber'
    },
    {
      label: 'Postal code',
      value: 'isZipcode'
    },
    {
      label: 'ID number (18/15 digits)',
      value: 'isId'
    },
    {
      label: 'ID number (18 digits)',
      value: 'isId18'
    },
    {
      label: 'JSON format',
      value: 'isJson'
    },
    {
      label: 'Same as specified value',
      value: 'equals'
    },
    {
      label: 'The same as the specified field value',
      value: 'equalsField'
    },
    {
      label: 'Custom regular expression',
      value: 'matchRegexp'
    },
    {
      label: 'Custom regular expression 2',
      value: 'matchRegexp1'
    },
    {
      label: 'Custom regular expression 3',
      value: 'matchRegexp2'
    },
    {
      label: 'Custom regular expression 4',
      value: 'matchRegexp3'
    },
    {
      label: 'Custom regular expression 5',
      value: 'matchRegexp4'
    }
  ];

  const trueProps = [
    'isEmail',
    'isUrl',
    'isNumeric',
    'isAlpha',
    'isAlphanumeric',
    'isInt',
    'isFloat',
    'isJson',
    'isPhoneNumber',
    'isTelNumber',
    'isZipcode',
    'isId'
  ];

  function firstValue(arr: Array<any>, iterator: (item: any) => any) {
    let theone = find(arr, iterator);
    return theone ? theone.value : '';
  }

  return {
    type: 'combo',
    syncDefaultValue: false,
    name: 'validations',
    label: 'Validation rules',
    addButtonText: 'Add new rules',
    multiple: true,
    pipeIn: (value: any) => {
      if (typeof value === 'string' && value) {
        value = str2rules(value);
      }
      if (!isObject(value)) {
        return value;
      }

      let arr: Array<any> = [];

      Object.keys(value).forEach(key => {
        if (/^\$\$/.test(key)) {
          return;
        }

        arr.push({
          type: key,
          [key]: Array.isArray(value[key]) ? value[key][0] : value[key]
        });
      });

      return arr;
    },
    pipeOut: (value: any) => {
      if (!Array.isArray(value)) {
        return value;
      }
      let obj: any = {};

      value.forEach((item: any) => {
        let key: string =
          item.type ||
          firstValue(options, (item: any) => !obj[item.value]) ||
          options[0].value;
        obj[key] = item[key] || (~trueProps.indexOf(key) ? true : '');
      });

      return obj;
    },
    items: [
      {
        type: 'select',
        unique: true,
        name: 'type',
        options: options,
        columnClassName: 'w-sm'
      },
      {
        type: 'input-number',
        name: 'isLength',
        visibleOn: 'this.type == "isLength"',
        placeholder: 'Set length',
        value: '1'
      },
      {
        type: 'input-number',
        name: 'maximum',
        visibleOn: 'this.type == "maximum"',
        placeholder: 'Set maximum value'
      },
      {
        type: 'input-number',
        name: 'minimum',
        visibleOn: 'this.type == "minimum"',
        placeholder: 'Set minimum value'
      },
      {
        type: 'input-number',
        name: 'maxLength',
        visibleOn: 'this.type == "maxLength"',
        placeholder: 'Set the maximum length value'
      },
      {
        type: 'input-number',
        name: 'minLength',
        visibleOn: 'this.type == "minLength"',
        placeholder: 'Set minimum length value'
      },
      {
        type: 'input-text',
        name: 'equals',
        visibleOn: 'this.type == "equals"',
        placeholder: 'Set value',
        value: ''
      },
      {
        type: 'input-text',
        name: 'equalsField',
        visibleOn: 'this.type == "equalsField"',
        placeholder: 'Set field name',
        value: ''
      },
      {
        type: 'input-text',
        name: 'matchRegexp',
        visibleOn: 'this.type == "matchRegexp"',
        placeholder: 'Set regular rules'
      },
      {
        type: 'input-text',
        name: 'matchRegexp1',
        visibleOn: 'this.type == "matchRegexp1"',
        placeholder: 'Set regular rules'
      },
      {
        type: 'input-text',
        name: 'matchRegexp2',
        visibleOn: 'this.type == "matchRegexp2"',
        placeholder: 'Set regular rules'
      },
      {
        type: 'input-text',
        name: 'matchRegexp3',
        visibleOn: 'this.type == "matchRegexp3"',
        placeholder: 'Set regular rules'
      },
      {
        type: 'input-text',
        name: 'matchRegexp4',
        visibleOn: 'this.type == "matchRegexp4"',
        placeholder: 'Set regular rules'
      }
    ]
  };
});

setSchemaTpl('validationErrors', function () {
  const i18nEnabled = getI18nEnabled();
  const options = [
    // {
    // label: 'Required',
    //     value: 'isRequired'
    // },
    {
      label: 'Email format',
      value: 'isEmail'
    },
    {
      label: 'Url format',
      value: 'isUrl'
    },
    {
      label: 'number',
      value: 'isNumeric'
    },
    {
      label: 'Letters',
      value: 'isAlpha'
    },
    {
      label: 'Letters and numbers',
      value: 'isAlphanumeric'
    },
    {
      label: 'Integer',
      value: 'isInt'
    },
    {
      label: 'Floating point number',
      value: 'isFloat'
    },
    {
      label: 'fixed length',
      value: 'isLength'
    },
    {
      label: 'maximum length',
      value: 'maxLength'
    },
    {
      label: 'Minimum length',
      value: 'minLength'
    },
    {
      label: 'maximum value',
      value: 'maximum'
    },
    {
      label: 'minimum value',
      value: 'minimum'
    },
    {
      label: 'JSON format',
      value: 'isJson'
    },
    {
      label: 'Mobile phone number',
      value: 'isPhoneNumber'
    },
    {
      label: 'phone number',
      value: 'isTelNumber'
    },
    {
      label: 'Postal code',
      value: 'isZipcode'
    },
    {
      label: 'ID number',
      value: 'isId'
    },
    {
      label: 'Same as specified value',
      value: 'equals'
    },
    {
      label: 'The same as the specified field value',
      value: 'equalsField'
    },
    {
      label: 'Custom regular expression',
      value: 'matchRegexp'
    },
    {
      label: 'Custom regular expression 2',
      value: 'matchRegexp1'
    },
    {
      label: 'Custom regular expression 3',
      value: 'matchRegexp2'
    },
    {
      label: 'Custom regular expression 4',
      value: 'matchRegexp3'
    },
    {
      label: 'Custom regular expression 5',
      value: 'matchRegexp4'
    }
  ];

  const defaultMessages = {
    isEmail: 'Email format is incorrect',
    isRequired: 'This is a required field',
    isUrl: 'Incorrect Url format',
    isInt: 'Please enter an integer',
    isAlpha: 'Please enter letters',
    isNumeric: 'Please enter a number',
    isAlphanumeric: 'Please enter letters or numbers',
    isFloat: 'Please enter a floating point value',
    isWords: 'Please enter letters',
    isUrlPath: 'Only letters, numbers, `-` and `_` can be entered.',
    matchRegexp:
      'The format is incorrect, please enter the content that matches the rule `$1`.',
    minLength: 'Please enter more content, at least $1 characters.',
    maxLength:
      'Please control the content length, please do not enter more than $1 characters',
    maximum:
      'The current input value exceeds the maximum value of $1, please check',
    minimum:
      'The current input value is lower than the minimum value $1, please check',
    isJson: 'Please check the Json format.',
    isPhoneNumber: 'Please enter a valid mobile phone number',
    isTelNumber: 'Please enter a valid phone number',
    isZipcode: 'Please enter a valid zip code address',
    isId: 'Please enter a valid ID number',
    isLength: 'Please enter content with a length of $1',
    notEmptyString: 'Please do not enter all blank characters',
    equalsField: 'The input data is inconsistent with the value of $1',
    equals: 'The input data is inconsistent with $1'
  };

  function firstValue(arr: Array<any>, iterator: (item: any) => any) {
    let theone = find(arr, iterator);
    return theone ? theone.value : '';
  }

  return {
    type: 'combo',
    syncDefaultValue: false,
    name: 'validationErrors',
    label: 'Custom verification prompt',
    description:
      'If the built-in prompts are not sufficient, you can customize them.',
    addButtonText: 'Add a new prompt',
    multiple: true,
    pipeIn: (value: any) => {
      if (!isObject(value)) {
        return value;
      }

      let arr: Array<any> = [];

      Object.keys(value).forEach(key => {
        if (/^\$\$/.test(key)) {
          return;
        }

        arr.push({
          type: key,
          msg: value[key]
        });
      });

      return arr;
    },
    pipeOut: (value: any) => {
      if (!Array.isArray(value)) {
        return value;
      }
      let obj: any = {};

      value.forEach((item: any) => {
        let key: string =
          item.type ||
          firstValue(options, (item: any) => !obj[item.value]) ||
          options[0].value;
        obj[key] = item.msg || (defaultMessages as any)[key] || '';
      });

      return obj;
    },
    items: [
      {
        type: 'select',
        unique: true,
        name: 'type',
        options: options,
        columnClassName: 'w-sm'
      },

      {
        type: i18nEnabled ? 'input-text-i18n' : 'input-text',
        name: 'msg',
        placeholder: 'prompt information'
      },

      {
        type: 'formula',
        name: 'msg',
        initSet: false,
        formula: `({
          isEmail: 'Email format is incorrect',
          isRequired: 'This is a required field',
          isUrl: 'Incorrect Url format',
          isInt: 'Please enter an integer',
          isAlpha: 'Please enter letters',
          isNumeric: 'Please enter a number',
          isAlphanumeric: 'Please enter letters or numbers',
          isFloat: 'Please enter a floating point value',
          isWords: 'Please enter letters',
          isUrlPath: 'Only letters, numbers, \`-\` and \`_\` can be entered.',
          matchRegexp: 'The format is incorrect, please enter the content that matches the rule \`$1\`. ',
          minLength: 'Please enter more content, at least $1 characters.',
          maxLength: 'Please control the content length, please do not enter more than $1 characters',
          maximum: 'The current input value exceeds the maximum value of $1, please check',
          minimum: 'The current input value is lower than the minimum value $1, please check',
          isJson: 'Please check the Json format.',
          isLength: 'Please enter content with a length of $1',
          notEmptyString: 'Please do not enter all blank characters',
          equalsField: 'The input data is inconsistent with the value of $1',
          equals: 'The input data is inconsistent with $1',
          isPhoneNumber: 'Please enter a valid mobile phone number',
          isTelNumber: 'Please enter a valid phone number',
          isZipcode: 'Please enter a valid zip code address',
          isId: 'Please enter a valid ID number',
      })[data.type] || ''`
      }
    ]
  };
});

setSchemaTpl('submitOnChange', {
  type: 'switch',
  label: 'Submit after modification',
  name: 'submitOnChange',
  mode: 'horizontal',
  horizontal: {
    justify: true,
    left: 8
  },
  inputClassName: 'is-inline ',
  labelRemark: {
    trigger: 'click',
    className: 'm-l-xs',
    rootClose: true,
    content:
      'After setting, every modification in the form will trigger submission',
    placement: 'left'
  }
});

setSchemaTpl('validateOnChange', {
  type: 'select',
  name: 'validateOnChange',
  overlayPlacement: 'top',
  label: 'Verification trigger',
  options: [
    {
      label: 'Triggered every time a modification is made after submission',
      value: ''
    },

    {
      label: 'Modify and trigger',
      value: true
    },

    {
      label: 'Submit trigger',
      value: false
    }
  ],
  pipeIn: defaultValue(''),
  pipeOut: (value: any) => (value === '' ? undefined : !!value)
});

setSchemaTpl(
  'validation',
  (config: {
    tag: ValidatorTag | ((ctx: any) => ValidatorTag);
    rendererSchema?: (schema: Schema) => void | Schema | Schema[];
  }) => {
    let a = {
      title: 'Check',
      body: [
        {
          type: 'ae-validationControl',
          mode: 'normal',
          style: {
            marginBottom: '6px'
          },
          ...config
          // pipeIn: (value: any, data: any) => {
          //   // return reduce(value, (arr: any, item) => {
          //   //   if (typeof item === 'string') {
          //   //     arr.push(item);
          //   //   }
          //   //   else {
          //   //     let isAdd = false;
          // // // First determine whether the conditions for display are met
          //   //     forEach(item?.isShow, (val, key) => {
          //   //       if ([...val].includes(data?.data[key])) {
          //   //         isAdd = true;
          //   //         return false;
          //   //       }
          //   //     })
          //   //     !isAdd  && forEach(item?.isHidden, (val, key) => {
          //   //       const hasExist = [...val].includes(data?.data[key]);
          //   //         isAdd = hasExist ? false : true;
          //   //         if (hasExist) {
          //   //           return false;
          //   //         }
          //   //     })
          //   //     isAdd && arr.push(item.option);
          //   //   }
          //   //   return arr;
          //   // }, []);
          // },
        },
        getSchemaTpl('validationApiControl'),
        getSchemaTpl('validateOnChange')
      ]
    };
    return a;
  }
);

setSchemaTpl('validationApiControl', {
  type: 'ae-validationApiControl',
  label: false
});

setSchemaTpl('validationControl', (value: Array<ValidationOptions> = []) => ({
  type: 'ae-validationControl',
  label: 'Verification rules',
  mode: 'normal',
  pipeIn: (value: any, data: any) => {
    return reduce(
      value,
      (arr: any, item) => {
        if (typeof item === 'string') {
          arr.push(item);
        } else {
          let isAdd = false;
          // First determine whether the display conditions are met
          forEach(item?.isShow, (val, key) => {
            if ([...val].includes(data?.data[key])) {
              isAdd = true;
              return false;
            }
            return true;
          });
          !isAdd &&
            forEach(item?.isHidden, (val, key) => {
              const hasExist = [...val].includes(data?.data[key]);
              isAdd = hasExist ? false : true;
              if (hasExist) {
                return false;
              }
              return true;
            });
          isAdd && arr.push(item.option);
        }
        return arr;
      },
      []
    );
  },
  value
}));
