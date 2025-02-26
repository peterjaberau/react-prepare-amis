/**
 * @file compatibility configuration, make some adaptations for some unreasonable places in the old API design.
 * @author fex
 */
import {Schema} from '@/packages/amis-core/src';
import {addSchemaFilter} from '@/packages/amis-core/src';
import {CheckboxControlRenderer} from './renderers/Form/Checkbox';
import {FormRenderer, isObjectShallowModified} from '@/packages/amis-core/src';
import {FieldSetRenderer} from './renderers/Form/FieldSet';
import {CardRenderer} from './renderers/Card';
import {ListItemRenderer} from './renderers/List';
import {ButtonGroupControlRenderer} from './renderers/Form/ButtonGroupSelect';
import {getLevelFromClassName} from '@/packages/amis-core/src';
import {FileControlRenderer} from './renderers/Form/InputFile';
import {ImageControlRenderer} from './renderers/Form/InputImage';
import {RichTextControlRenderer} from './renderers/Form/InputRichText';
import {GridRenderer} from './renderers/Grid';
import {HBoxRenderer} from './renderers/HBox';

// Compatible with the old usage, the old usage label is used on the right side of the checkbox, the new usage uses option instead.
addSchemaFilter(function CheckboxPropsFilter(schema: Schema, renderer) {
  if (renderer.component !== CheckboxControlRenderer) {
    return schema;
  }

  if (schema.label && typeof schema.option === 'undefined') {
    schema = {
      ...schema
    };
    schema.option = schema.label;
    delete schema.label;
  }

  return schema;
});

function convertFieldSetTabs2Controls(schema: any) {
  const toUpdate: any = {};
  let flag = false;

  toUpdate.controls = Array.isArray(schema.controls)
    ? schema.controls.concat()
    : [];
  toUpdate.controls = toUpdate.controls.map((control: any) => {
    if (Array.isArray(control)) {
      let converted = convertFieldSetTabs2Controls({
        type: 'group',
        controls: control
      });

      if (converted !== control) {
        flag = true;
      }

      return converted;
    }
    return control;
  });

  schema.fieldSet &&
    (Array.isArray(schema.fieldSet)
      ? schema.fieldSet
      : [schema.fieldSet]
    ).forEach((fieldSet: any) => {
      flag = true;
      toUpdate.controls.push({
        ...convertFieldSetTabs2Controls(fieldSet),
        type: 'fieldSet',
        collapsable: schema.collapsable
      });
    });

  schema.tabs &&
    (flag = true) &&
    toUpdate.controls.push({
      type: 'tabs',
      tabs: schema.tabs.map((tab: any) => convertFieldSetTabs2Controls(tab))
    });

  if (flag) {
    schema = {
      ...schema,
      ...toUpdate
    };
    delete schema.fieldSet;
    delete schema.tabs;
  }
  return schema;
}

// In Form, convert fieldSet and tabs to {type: 'fieldSet', controls: []}
// Also convert array usage to {type: 'group', controls: []}
addSchemaFilter(function FormPropsFilter(schema: Schema, renderer) {
  if (renderer.component !== FormRenderer) {
    return schema;
  }

  if (schema.fieldSet || schema.tabs) {
    // console.warn('Using fieldSet or tabs directly under the Form is not supported. Please add them in the controls array instead.');
    schema = convertFieldSetTabs2Controls(schema);
  } else if (Array.isArray(schema.controls)) {
    let flag = false;
    let converted = schema.controls.map((control: any) => {
      if (Array.isArray(control)) {
        let converted = convertFieldSetTabs2Controls({
          type: 'group',
          controls: control
        });

        if (converted !== control) {
          flag = true;
        }
        return converted;
      }
      return control;
    });

    if (flag) {
      schema = {
        ...schema,
        controls: converted
      };
    }
  }

  return schema;
});

// In FieldSet, convert the array usage in controls to {type: 'group', controls: []}
addSchemaFilter(function FormPropsFilter(schema: Schema, renderer) {
  if (renderer.component !== FieldSetRenderer) {
    return schema;
  }

  if (Array.isArray(schema.controls)) {
    let flag = false;
    let converted = schema.controls.map((control: any) => {
      if (Array.isArray(control)) {
        let converted = convertFieldSetTabs2Controls({
          type: 'group',
          controls: control
        });

        if (converted !== control) {
          flag = true;
        }
        return converted;
      }
      return control;
    });

    if (flag) {
      schema = {
        ...schema,
        controls: converted
      };
    }
  }

  return schema;
});

// In the Tabs in the Form, convert the array usage in controls to {type: 'group', controls: []}

function convertArray2Hbox(arr: Array<any>): any {
  let flag = false;
  let converted = arr.map((item: any) => {
    if (Array.isArray(item)) {
      flag = true;
      return convertArray2Hbox(item);
    }

    return item;
  });
  if (!flag) {
    converted = arr;
  }

  return {
    type: 'hbox',
    columns: converted
  };
}

// Convert array usage in CRUD/List and CRUD/Card body to hbox
addSchemaFilter(function (schema: Schema, renderer) {
  if (
    renderer.component !== CardRenderer &&
    renderer.component !== ListItemRenderer
  ) {
    return schema;
  }

  if (Array.isArray(schema.body)) {
    let flag = false;
    let converted = schema.body.map((item: any) => {
      if (Array.isArray(item)) {
        flag = true;
        return convertArray2Hbox(item);
      }
      return item;
    });

    if (flag) {
      schema = {
        ...schema,
        body: converted
      };
    }
  }

  return schema;
});

// The btnClassName and btnActiveClassName of button group have been changed to btnLevel and btnActiveLevel
// 2023/7/20 fix: The configuration panel configuration button class name preview is invalid
addSchemaFilter(function (scheam: Schema, renderer) {
  if (renderer.component !== ButtonGroupControlRenderer) {
    return scheam;
  }

  if (scheam.btnClassName || scheam.btnActiveClassName) {
    scheam = {
      ...scheam,
      btnLevel: getLevelFromClassName(scheam.btnClassName),
      btnActiveLevel: getLevelFromClassName(scheam.btnActiveClassName)
    };
  }

  return scheam;
});

// The original word "reciever" was wrongly written as "receiver"
addSchemaFilter(function (scheam: Schema, renderer) {
  if (
    renderer.component !== FileControlRenderer &&
    renderer.component !== ImageControlRenderer &&
    renderer.component !== RichTextControlRenderer
  ) {
    return scheam;
  }

  if (scheam.reciever) {
    scheam = {
      ...scheam,
      receiver: scheam.reciever
    };
    delete scheam.reciever;
  }

  if (scheam.videoReciever) {
    scheam = {
      ...scheam,
      videoReceiver: scheam.reciever
    };
    delete scheam.reciever;
  }

  return scheam;
});

// Grid compatibility with some old formats
addSchemaFilter(function (scheam: Schema, renderer) {
  if (renderer.component !== GridRenderer) {
    return scheam;
  }

  if (
    Array.isArray(scheam.columns) &&
    scheam.columns.some(item => Array.isArray(item) || item.type)
  ) {
    scheam = {
      ...scheam,
      columns: scheam.columns.map(item => {
        if (Array.isArray(item)) {
          return {
            body: [
              {
                type: 'grid',
                columns: item
              }
            ]
          };
        } else if (item.type) {
          let {xs, sm, md, lg, columnClassName, ...rest} = item;
          item = {
            xs,
            sm,
            md,
            lg,
            columnClassName,
            body: [rest]
          };
        }

        return item;
      })
    };
  }

  return scheam;
});

// Hbox compatibility with some old formats
addSchemaFilter(function (scheam: Schema, renderer) {
  if (renderer.component !== HBoxRenderer) {
    return scheam;
  }

  if (Array.isArray(scheam.columns) && scheam.columns.some(item => item.type)) {
    scheam = {
      ...scheam,
      columns: scheam.columns.map(item => {
        let {
          width,
          height,
          style,
          columnClassName,
          visible,
          visibleOn,
          ...rest
        } = item;
        if (item.type) {
          item = {
            width,
            height,
            style,
            columnClassName,
            visible,
            visibleOn,
            body: [rest]
          };
        }

        return item;
      })
    };
  }

  return scheam;
});

const controlMapping: any = {
  'array': 'input-array',
  'button-group': 'button-group-select',
  'city': 'input-city',
  'color': 'input-color',
  'date': 'input-date',
  'datetime': 'input-datetime',
  'time': 'input-time',
  'quarter': 'input-quarter',
  'month': 'input-month',
  'year': 'input-year',
  'date-range': 'input-date-range',
  'datetime-range': 'input-datetime-range',
  'diff': 'diff-editor',
  'file': 'input-file',
  'image': 'input-image',
  'list': 'list-select',
  'location': 'location-picker',
  'matrix': 'matrix-checkboxes',
  'month-range': 'input-month-range',
  'quarter-range': 'input-quarter-range',
  'number': 'input-number',
  'range': 'input-range',
  'rating': 'input-rating',
  'repeat': 'input-repeat',
  'rich-text': 'input-rich-text',
  'form': 'input-sub-form',
  'table': 'input-table',
  'tag': 'input-tag',
  'text': 'input-text',
  'url': 'input-url',
  'password': 'input-password',
  'email': 'input-email',
  'tree': 'input-tree',
  'progress': 'static-progress',
  'mapping': 'static-mapping'
};

const maybeFormItem = [
  'button',
  'submit',
  'reset',
  'button-group',
  'button-toolbar',
  'container',
  'grid',
  'hbox',
  'panel',
  'anchor-nav',
  'qr-code'
];

function wrapControl(item: any) {
  if (!item || !item.type) {
    return item;
  }

  let {
    label,
    description,
    name,
    required,
    remark,
    inputOnly,
    labelClassName,
    caption,
    labelRemark,
    descriptionClassName,
    captionClassName,
    hint,
    showErrorMsg,
    mode,
    horizontal,
    className,
    inputClassName,
    columnClassName,
    visibleOn,
    visible,
    ...rest
  } = item;

  rest.name = name;
  rest.className = inputClassName;

  // If it is a button
  if (~['button', 'submit', 'reset'].indexOf(rest.type)) {
    rest.label = label;
    label = '';
  }

  return {
    type: 'control',
    label,
    description,
    name,
    required,
    remark,
    inputOnly,
    labelClassName,
    caption,
    labelRemark,
    descriptionClassName,
    captionClassName,
    hint,
    showErrorMsg,
    mode,
    horizontal,
    className,
    columnClassName,
    visibleOn,
    visible,
    body: rest
  };
}

const maybeStatic = [
  'tpl',
  'mapping',
  'progress',
  'status',
  'json',
  'video',
  'qrcode',
  'plain',
  'each',
  'link'
];

function wrapStatic(item: any) {
  if (!item || !item.type) {
    return item;
  }

  return {
    ...item,
    type: `static-${item.type}`
  };
}

addSchemaFilter(function (schema: Schema, renderer: any, props: any) {
  const type =
    typeof schema?.type === 'string' ? schema.type.toLowerCase() : '';
  let newSchema = schema;

  // controls 转成 body
  if (type === 'combo' && Array.isArray(schema.conditions)) {
    newSchema = {
      ...schema,
      conditions: schema.conditions.map(condition => {
        if (Array.isArray(condition.controls)) {
          condition = {
            ...condition,
            items: condition.controls.map(controlToNormalRenderer)
          };
          delete condition.controls;
        }

        return condition;
      })
    };
  }

  if (
    schema?.controls &&
    schema.type !== 'audio' &&
    schema.type !== 'carousel'
  ) {
    newSchema = {
      ...schema,
      [schema.type === 'combo' ? `items` : 'body']: (Array.isArray(
        schema.controls
      )
        ? schema.controls
        : [schema.controls]
      ).map(controlToNormalRenderer)
    };
    delete newSchema.controls;
  } else if (
    schema?.quickEdit?.controls &&
    (!schema.quickEdit.type ||
      !~['combo', 'group', 'panel', 'fieldSet', 'fieldset'].indexOf(
        schema.quickEdit.type
      ))
  ) {
    newSchema = {
      ...schema,
      quickEdit: {
        ...schema.quickEdit,
        body: (Array.isArray(schema.quickEdit.controls)
          ? schema.quickEdit.controls
          : [schema.quickEdit.controls]
        ).map(controlToNormalRenderer)
      }
    };
    delete newSchema.quickEdit.controls;
  } else if (schema?.quickEdit?.type) {
    newSchema = {
      ...schema,
      quickEdit: controlToNormalRenderer(schema.quickEdit)
    };
  } else if (type === 'tabs' && Array.isArray(schema.tabs)) {
    newSchema = {
      ...schema,
      tabs: schema.tabs.map(tab => {
        if (Array.isArray(tab.controls) && !Array.isArray(tab.body)) {
          tab = {
            ...tab,
            body: tab.controls.map(controlToNormalRenderer)
          };
          delete tab.controls;
        }

        return tab;
      })
    };
  } else if (type === 'anchor-nav' && Array.isArray(schema.links)) {
    newSchema = {
      ...schema,
      links: schema.links.map(link => {
        if (Array.isArray(link.controls)) {
          link = {
            ...link,
            body: link?.controls.map(controlToNormalRenderer)
          };

          delete link.controls;
        }

        return link;
      })
    };
  } else if (type === 'input-array' && schema.items) {
    newSchema = {
      ...schema,
      items: Array.isArray(schema.items)
        ? schema.items.map(controlToNormalRenderer)
        : controlToNormalRenderer(schema.items)
    };
  } else if (
    (type === 'grid' || type === 'hbox') &&
    Array.isArray(schema.columns)
  ) {
    newSchema = {
      ...schema,
      columns: schema.columns.map(column => {
        if (Array.isArray(column.controls)) {
          column = {
            ...column,

            body: column?.controls.map(controlToNormalRenderer)
          };

          // 有可能直接外面的grid 或者 bhox 列里面用 form 的。
          if (column.type !== 'form') {
            delete column.type;
          }

          delete column.controls;
        }

        return column;
      })
    };
  } else if (type === 'service' && schema?.body?.controls) {
    newSchema = {
      ...schema,
      body: (Array.isArray(schema.body.controls)
        ? schema.body.controls
        : [schema.body.controls]
      ).map(controlToNormalRenderer)
    };
  }

  if (
    newSchema !== schema &&
    isObjectShallowModified(newSchema, schema, false, false, [], 10)
  ) {
    return newSchema;
  }

  return schema;

  function controlToNormalRenderer(item: any) {
    if (item?.$ref && props.resolveDefinitions) {
      item = {
        ...props.resolveDefinitions(item.$ref),
        ...item
      };
      delete item.$ref;
    }

    return item && controlMapping[item.type]
      ? {
          ...item,
          type: controlMapping[item.type]
        }
      : ~maybeFormItem.indexOf(item?.type)
      ? wrapControl(item)
      : ~maybeStatic.indexOf(item?.type)
      ? wrapStatic(item)
      : item;
  }
});
