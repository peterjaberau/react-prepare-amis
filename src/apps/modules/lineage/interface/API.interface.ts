
import { Include } from '../generated/type/include';

export type ListParams = {
  fields?: string | string[];
  limit?: number;
  before?: string;
  after?: string;
  include?: Include;
};

export type ListParamsWithOffset = ListParams & {
  offset?: number;
};
