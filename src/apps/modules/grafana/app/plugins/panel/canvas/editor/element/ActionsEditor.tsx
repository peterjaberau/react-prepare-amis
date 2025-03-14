import { StandardEditorProps, Action, VariableSuggestionsScope } from '@data/index';
import { ActionsInlineEditor } from '@grafana-module/app/features/actions/ActionsInlineEditor';
import { CanvasElementOptions } from '@grafana-module/app/features/canvas/element';

type Props = StandardEditorProps<Action[], CanvasElementOptions>;

export function ActionsEditor({ value, onChange, item, context }: Props) {
  const dataLinks = item.settings?.links || [];

  return (
    <ActionsInlineEditor
      actions={value}
      onChange={(actions) => {
        if (actions.some(({ oneClick }) => oneClick === true)) {
          dataLinks.forEach((link) => {
            link.oneClick = false;
          });
        }
        onChange(actions);
      }}
      getSuggestions={() => (context.getSuggestions ? context.getSuggestions(VariableSuggestionsScope.Values) : [])}
      data={[]}
      showOneClick={true}
    />
  );
}
