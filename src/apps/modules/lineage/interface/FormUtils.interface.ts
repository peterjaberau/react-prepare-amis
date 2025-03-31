
import { FormItemProps, FormRule } from 'antd';
import { NamePath } from 'antd/lib/form/interface';
import { ReactNode } from 'react';
import { FormValidationRulesType } from '../enums/form.enum';

export type FormValidationRules = Record<
  FormValidationRulesType,
  Array<string>
>;

export enum FormItemLayout {
  HORIZONTAL = 'horizontal',
  VERTICAL = 'vertical',
}

export enum FieldTypes {
  TEXT = 'text',
  PASSWORD = 'password',
  FILTER_PATTERN = 'filter_pattern',
  SWITCH = 'switch',
  SELECT = 'select',
  ASYNC_SELECT_LIST = 'async_select_list',
  NUMBER = 'number',
  SLIDER_INPUT = 'slider_input',
  DESCRIPTION = 'description',
  TAG_SUGGESTION = 'tag_suggestion',
  USER_TEAM_SELECT = 'user_team_select',
  USER_MULTI_SELECT = 'user_multi_select',
  COLOR_PICKER = 'color_picker',
  DOMAIN_SELECT = 'domain_select',
  CRON_EDITOR = 'cron_editor',
}

export enum HelperTextType {
  ALERT = 'alert',
  Tooltip = 'tooltip',
}

export interface FieldProp {
  label: ReactNode;
  name: NamePath;
  type: FieldTypes;
  required: boolean;
  id: string;
  props?: Record<string, unknown> & { children?: ReactNode };
  formItemProps?: FormItemProps;
  rules?: FormRule[];
  helperText?: ReactNode;
  helperTextType?: HelperTextType;
  showHelperText?: boolean;
  placeholder?: string;
  hasSeparator?: boolean;
  formItemLayout?: FormItemLayout;
  isBeta?: boolean;
}
