import './locale/index';
/**
 * @file all available validators
 */
const Validators: Validator[] = [];

/**
 * Validation rule class name
 */
export enum ValidationGroup {
  Pattern = 'text',
  Number = 'number',
  Regex = 'regular',
  Others = 'other'
}

export interface Validator {
  /**
   * Validation rule name, English
   */
  name: string;

  /**
   * Validation rule title
   */
  label: string;

  /**
   * Prompt for validation failure, if not, it means that the user cannot customize the configuration
   */
  message?: string;

  /**
   * Category
   */
  group?: string;

  // /**
  // * Display the conditions of the validation, such as {type: Components type}, used in combination with hidden, both are empty by default Misc
  // */
  // visible?: Array<SchemaObject>

  // /**
  // * Do not display the conditions of this validation, such as {type: Components type}, used in combination with visible, the default is Misc when both are empty
  // */
  // hidden?: Array<SchemaObject>

  /**
   * Quick edit form
   */
  schema?: any[];

  /**
   * Input type, true means default
   */
  tag: Partial<Record<ValidatorTag, ValidTagMatchType>>;
}

enum ValidTagMatchType {
  isDefault = 1, // Default recommendation, you can directly operate the switch
  isMore = 2, // Default is not recommended, you can set it by adding more rules, and the switch cannot be operated
  isBuiltIn = 3 // Default built-in validation, default open, inoperable switch closed
}

export const registerValidator = (...config: Array<Validator>) => {
  Validators.push(...config);
};

export const removeAllValidator = () => {
  Validators.length = 0;
};

export const getValidatorsByTag = (tag: ValidatorTag) => {
  const defaultValidators: Record<string, Validator> = {};
  const moreValidators: Record<string, Validator> = {};
  const builtInValidators: Record<string, Validator> = {};

  Validators.forEach((valid: Validator) => {
    let tagMatch = valid.tag[tag];
    if (tagMatch != null) {
      if (tagMatch === ValidTagMatchType.isDefault) {
        defaultValidators[valid.name] = valid;
      } else if (tagMatch === ValidTagMatchType.isMore) {
        moreValidators[valid.name] = valid;
      } else if (tagMatch === ValidTagMatchType.isBuiltIn) {
        builtInValidators[valid.name] = valid;
      }
      return;
    }

    tagMatch = valid.tag[ValidatorTag.All];
    if (tagMatch != null) {
      if (tagMatch === ValidTagMatchType.isDefault) {
        defaultValidators[valid.name] = valid;
      } else if (tagMatch === ValidTagMatchType.isMore) {
        moreValidators[valid.name] = valid;
      } else if (tagMatch === ValidTagMatchType.isBuiltIn) {
        builtInValidators[valid.name] = valid;
      }
    }
  });
  return {
    defaultValidators,
    moreValidators,
    builtInValidators
  };
};

export const getValidator = (name: string) => {
  return Validators.find(item => item.name === name);
};

export enum ValidatorTag {
  All = '0',
  Text = '1',
  MultiSelect = '2',
  Check = '3',
  Email = '4',
  Password = '5',
  URL = '6',
  Number = '7',
  File = '8',
  Date = '9',
  Code = '10',
  Tree = '11',
  Phone = '12',
  Tel = '13'
}

registerValidator(
  {
    label: 'required',
    name: 'required',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isDefault,
      [ValidatorTag.File]: ValidTagMatchType.isDefault,
      [ValidatorTag.MultiSelect]: ValidTagMatchType.isDefault,
      [ValidatorTag.Date]: ValidTagMatchType.isDefault,
      [ValidatorTag.Code]: ValidTagMatchType.isDefault,
      [ValidatorTag.Email]: ValidTagMatchType.isDefault,
      [ValidatorTag.Password]: ValidTagMatchType.isDefault,
      [ValidatorTag.URL]: ValidTagMatchType.isDefault,
      [ValidatorTag.Tree]: ValidTagMatchType.isDefault,
      [ValidatorTag.Phone]: ValidTagMatchType.isDefault
    }
  },
  {
    label: 'Email format',
    name: 'isEmail',
    group: ValidationGroup.Pattern,
    message: 'Email format is incorrect',
    tag: {
      [ValidatorTag.Email]: ValidTagMatchType.isBuiltIn,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: 'Url format',
    name: 'isUrl',
    group: ValidationGroup.Pattern,
    message: 'Url format is incorrect',
    tag: {
      [ValidatorTag.URL]: ValidTagMatchType.isBuiltIn,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: 'Letter',
    name: 'isAlpha',
    group: ValidationGroup.Pattern,
    message: 'Please enter letters',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: 'Number',
    name: 'isNumeric',
    group: ValidationGroup.Number,
    message: 'Please enter numbers',
    tag: {
      [ValidatorTag.Number]: ValidTagMatchType.isDefault,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: 'Letters and numbers',
    name: 'isAlphanumeric',
    group: ValidationGroup.Pattern,
    message: 'Please enter letters or numbers',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: 'Integer',
    name: 'isInt',
    group: ValidationGroup.Number,
    message: 'Please enter an integer number',
    tag: {
      [ValidatorTag.Number]: ValidTagMatchType.isDefault,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: '浮点型数字',
    name: 'isFloat',
    group: ValidationGroup.Number,
    message: '请输入浮点型数值',
    tag: {
      [ValidatorTag.Number]: ValidTagMatchType.isDefault,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: 'Fixed length',
    name: 'isLength',
    group: ValidationGroup.Pattern,
    message: 'Please enter content with a length of \\$1',
    tag: {
      [ValidatorTag.Number]: ValidTagMatchType.isDefault,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    },
    schema: [
      {
        type: 'input-number',
        name: 'value',
        label: 'Number of characters',
        placeholder: 'Please enter the number of characters'
      }
    ]
  },
  {
    label: 'Maximum length',
    name: 'maxLength',
    group: ValidationGroup.Pattern,
    message:
      'Please control the content length. Please do not enter more than \\$1 characters',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isDefault
    },
    schema: [
      {
        type: 'input-number',
        name: 'value',
        label: 'Number of characters'
        // placeholder: 'Please enter the number of characters'
      }
    ]
  },
  // {
  // label: 'Maximum number',
  // name: 'maxLength',
  // group: ValidationGroup.Pattern,
  // message: 'The number of files cannot exceed \\$1',
  // tag: {
  // [ValidatorTag.File]: true
  // },
  // schema: [
  // {
  // type: 'input-number',
  // name: 'value',
  // label: 'Number of files'
  // }
  // ]
  // },
  // {
  // label: 'Minimum number',
  // name: 'minLength',
  // group: ValidationGroup.Pattern,
  // message: 'The number of files cannot be less than \\$1',
  // tag: {
  // [ValidatorTag.File]: true
  // },
  // schema: [
  // {
  // type: 'input-number',
  // name: 'value',
  // label: 'Number of files'
  // }
  // ]
  // },
  // {
  // label: 'Maximum volume',
  // group: ValidationGroup.Pattern,
  // name: 'maxSize',
  // message: 'File volume cannot exceed \\$1 Byte',
  // tag: {
  // [ValidatorTag.File]: true
  // },
  // schema: [
  // {
  // type: 'input-number',
  // label: 'Volume (Byte)'
  // }
  // ]
  // },
  {
    label: 'Minimum length',
    name: 'minLength',
    group: ValidationGroup.Pattern,
    message: 'Please enter more content, at least \\$1 characters',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isDefault
    },
    schema: [
      {
        type: 'input-number',
        name: 'value',
        label: 'Number of characters'
        // placeholder: 'Please enter the number of characters'
      }
    ]
  },
  {
    label: 'Maximum value',
    name: 'maximum',
    group: ValidationGroup.Number,
    message:
      'The current input value exceeds the maximum value \\$1, please check',
    tag: {
      [ValidatorTag.Number]: ValidTagMatchType.isDefault,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    },
    schema: [
      {
        type: 'input-number',
        name: 'value',
        label: 'maximum'
        // placeholder: 'Please enter the maximum value'
      }
    ]
  },
  {
    label: 'minimum',
    name: 'minimum',
    group: ValidationGroup.Number,
    message:
      'The current input value is lower than the minimum value \\$1, please check',
    tag: {
      [ValidatorTag.Number]: ValidTagMatchType.isDefault,
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    },
    schema: [
      {
        type: 'input-number',
        name: 'value',
        label: 'minimum'
        // placeholder: 'Please enter the minimum value'
      }
    ]
  },
  {
    label: 'mobile phone number',
    name: 'isPhoneNumber',
    group: ValidationGroup.Pattern,
    message: 'Please enter a valid mobile phone number',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore,
      [ValidatorTag.Phone]: ValidTagMatchType.isBuiltIn
    }
  },
  {
    label: 'Phone number',
    name: 'isTelNumber',
    group: ValidationGroup.Pattern,
    message: 'Please enter a valid phone number',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore,
      [ValidatorTag.Tel]: ValidTagMatchType.isBuiltIn
    }
  },
  {
    label: 'Zip code',
    name: 'isZipcode',
    group: ValidationGroup.Pattern,
    message: 'Please enter a valid zip code address',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: 'ID number (18/15 digits)',
    name: 'isId',
    group: ValidationGroup.Pattern,
    message: 'Please enter a valid ID number',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: 'ID number (18 digits)',
    name: 'isId18',
    group: ValidationGroup.Pattern,
    message: 'Please enter a valid ID number',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: 'JSON format',
    name: 'isJson',
    group: ValidationGroup.Pattern,
    message: 'Please check the Json format',
    tag: {
      [ValidatorTag.Text]: ValidTagMatchType.isMore
    }
  },
  {
    label: 'The same as the specified value',
    name: 'equals',
    group: ValidationGroup.Others,
    message: 'The input data is inconsistent with \\$1',
    tag: {
      [ValidatorTag.All]: ValidTagMatchType.isMore,
      [ValidatorTag.Password]: ValidTagMatchType.isDefault
    },
    schema: [
      {
        type: 'input-text',
        name: 'value',
        label: 'Value content'
      }
    ]
  },
  {
    label: 'The same as the specified field value',
    name: 'equalsField',
    group: ValidationGroup.Others,
    message: 'The input data is inconsistent with the \\$1 value',
    tag: {
      [ValidatorTag.All]: ValidTagMatchType.isMore,
      [ValidatorTag.Password]: ValidTagMatchType.isDefault
    },
    schema: [
      {
        type: 'input-text',
        name: 'value',
        label: 'field name'
      }
    ]
  },
  ...Array(5)
    .fill(null)
    .map((v, index): Validator => {
      const num = index === 0 ? '' : index;
      return {
        label: 'Custom regular expression' + num,
        name: 'matchRegexp' + num,
        group: ValidationGroup.Regex,
        message:
          'The format is incorrect. Please enter the content that meets the rule of \\$1.',
        tag: {
          [ValidatorTag.All]: ValidTagMatchType.isMore
        },
        schema: [
          {
            type: 'input-text',
            name: 'value',
            label: 'expression',
            placeholder: 'Please enter Js regular expression',
            prefix: '/',
            suffix: '/'
          }
        ]
      };
    })
);
