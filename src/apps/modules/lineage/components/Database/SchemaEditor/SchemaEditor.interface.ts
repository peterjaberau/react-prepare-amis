import { CSMode } from '../../../enums/codemirror.enum';

type Mode = {
  name: CSMode;
  json?: boolean;
};

export interface SchemaEditorProps {
  value?: string;
  className?: string;
  mode?: Mode;
  readOnly?: boolean;
  options?: {
    [key: string]: string | boolean | Array<string>;
  };
  editorClass?: string;
  showCopyButton?: boolean;
  onChange?: (value: string) => void;
  onFocus?: () => void;
}
