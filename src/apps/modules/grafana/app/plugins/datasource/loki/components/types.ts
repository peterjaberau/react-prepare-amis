import { QueryEditorProps } from '@data/index';

import { LokiDatasource } from '../datasource';
import { LokiOptions, LokiQuery } from '../types';

export type LokiQueryEditorProps = QueryEditorProps<LokiDatasource, LokiQuery, LokiOptions>;
