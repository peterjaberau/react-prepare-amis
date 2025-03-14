import { DataLink, DataLinksFieldConfigSettings, StandardEditorProps, VariableSuggestionsScope } from '@data/index';
import { DataLinksInlineEditor } from '@grafana-ui/index';

type Props = StandardEditorProps<DataLink[], DataLinksFieldConfigSettings>;

export const DataLinksValueEditor = ({ value, onChange, context, item }: Props) => {
  return (
    <DataLinksInlineEditor
      links={value}
      onChange={onChange}
      data={context.data}
      getSuggestions={() => (context.getSuggestions ? context.getSuggestions(VariableSuggestionsScope.Values) : [])}
      showOneClick={item.settings?.showOneClick}
    />
  );
};
