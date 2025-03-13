import { StandardEditorProps, DataLink, VariableSuggestionsScope } from '@data/index';
import { DataLinksInlineEditor } from '@grafana/ui';
import { CanvasElementOptions } from '@grafana-module/app/features/canvas/element';

type Props = StandardEditorProps<DataLink[], CanvasElementOptions>;

export function DataLinksEditor({ value, onChange, item, context }: Props) {
  const actions = item.settings?.actions || [];

  return (
    <DataLinksInlineEditor
      links={value}
      onChange={(links) => {
        if (links.some(({ oneClick }) => oneClick === true)) {
          actions.forEach((action) => {
            action.oneClick = false;
          });
        }
        onChange(links);
      }}
      getSuggestions={() => (context.getSuggestions ? context.getSuggestions(VariableSuggestionsScope.Values) : [])}
      data={[]}
      showOneClick={true}
    />
  );
}
