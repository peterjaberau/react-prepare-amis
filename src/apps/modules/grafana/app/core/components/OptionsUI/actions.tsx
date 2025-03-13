import { Action, DataLinksFieldConfigSettings, StandardEditorProps, VariableSuggestionsScope } from '@data/index';
import { ActionsInlineEditor } from '@grafana-module/app/features/actions/ActionsInlineEditor';

type Props = StandardEditorProps<Action[], DataLinksFieldConfigSettings>;

export const ActionsValueEditor = ({ value, onChange, context }: Props) => {
  return (
    <ActionsInlineEditor
      actions={value}
      onChange={onChange}
      data={context.data}
      getSuggestions={() => (context.getSuggestions ? context.getSuggestions(VariableSuggestionsScope.Values) : [])}
    />
  );
};
