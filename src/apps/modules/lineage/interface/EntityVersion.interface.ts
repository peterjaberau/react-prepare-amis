

import { FieldChange } from '../generated/entity/type';

export interface EntityDiffProps {
  added?: FieldChange;
  deleted?: FieldChange;
  updated?: FieldChange;
}
export interface EntityDiffWithMultiChanges {
  added?: FieldChange[];
  deleted?: FieldChange[];
  updated?: FieldChange[];
}
