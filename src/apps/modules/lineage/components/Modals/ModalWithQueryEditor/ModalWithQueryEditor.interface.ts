
export type ModalWithQueryEditorProps = {
  header: string;
  value: string;
  onSave?: (text: string) => void;
  onCancel?: () => void;
  visible: boolean;
};
