import { DataFrame } from '@data/index';

export interface FileImportResult {
  dataFrames: DataFrame[];
  file: File;
}
