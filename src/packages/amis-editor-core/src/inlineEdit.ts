/**
 * Inline editing related function modules
 * Provides two editing modes: plain text and rich text
 * Support setting cursor by mouse click position
 */
import {guid} from 'amis-core';
import {InlineEditableElement} from './plugin';
import {EditorNodeType} from './store/node';
import keycode from 'keycode';

/**
 * Inline editing context interface definition
 * @interface InlineEditContext
 * @property {EditorNodeType} node - the current editor node instance
 * @property {HTMLElement} elem - the DOM element to be edited
 * @property {InlineEditableElement} config - configuration information for inline editing
 * @property {MouseEvent} [event] - The mouse event object that triggered the editing
 * @property {Function} onConfirm - callback function after editing is confirmed, the parameter is the edited content
 * @property {Function} onCancel - callback function for canceling editing
 */
export interface InlineEditContext {
  node: EditorNodeType;
  elem: HTMLElement;
  config: InlineEditableElement;
  event?: MouseEvent;
  onConfirm: (value: string) => void;
  onCancel: () => void;
  richTextToken?: string;
  richTextOptions?: any;
}

/**
 * Enable inline editing
 * Select the corresponding editing mode according to the configured mode
 * @param {InlineEditContext} context - edit context
 */
export function startInlineEdit(context: InlineEditContext) {
  if (context.config.mode === 'rich-text') {
    startRichTextEdit(context);
  } else {
    startPlainTextEdit(context);
  }
}

/**
 * Start plain text editing mode
 * Set the element to editable state and listen for keyboard events
 * Support ESC to cancel and Enter to confirm
 * @param {InlineEditContext} context - edit context
 */
function startPlainTextEdit({
  elem,
  onConfirm,
  onCancel,
  event
}: InlineEditContext) {
  let origin = elem.innerText.trim();
  let forceCancel = false;
  const onKeyDown = (e: Event) => {
    const code = keycode(e);
    if (code === 'esc') {
      // Don't restore all the content, just cancel it
      // forceCancel = true;
      cleanup();
      e.preventDefault();
    } else if (code === 'enter') {
      cleanup();
      e.preventDefault();
    }
  };

  /**
   * Clear edit status
   * Remove event listener and restore element attributes
   * Trigger confirmation or cancellation based on whether the content changes
   */
  const cleanup = () => {
    elem.removeEventListener('blur', cleanup);
    elem.removeAttribute('contenteditable');
    elem.removeEventListener('keydown', onKeyDown);
    const value = elem.innerText.trim();
    if (!forceCancel && value !== origin) {
      onConfirm(value);
    } else {
      onCancel();
    }
  };

  elem.addEventListener('blur', cleanup);
  elem.addEventListener('keydown', onKeyDown);
  elem.setAttribute('contenteditable', 'plaintext-only');
  elem.focus();

  let caretRange = event
    ? getMouseEventCaretRange(event, elem)
    : createRangeAtTheEnd(elem);

  // Set a timer to allow the selection to happen and the dust settle first
  setTimeout(function () {
    selectRange(caretRange, elem);
  }, 10);
}

/**
 * Enable rich text editing mode
 * Use Froala editor, support text formatting, inserting pictures and tables, etc.
 * @param {InlineEditContext} context - edit context
 */
async function startRichTextEdit({
  elem,
  event,
  node,
  richTextToken,
  richTextOptions,
  onConfirm,
  onCancel
}: InlineEditContext) {
  // @ts-ignore
  const {FroalaEditor} = await import('@/packages/amis-ui/src/components/RichText');
  const id = `u_${guid()}`;
  elem.setAttribute('data-froala-id', id);

  let origin = '';
  let forceCancel = false;

  /**
   * Clean up the rich text editor
   * Destroy the editor instance and remove associated properties
   * Trigger confirmation or cancellation based on content changes
   */
  const cleanup = () => {
    const value = editor.html.get();
    editor.destroy();
    elem.removeAttribute('data-froala-id');

    if (!forceCancel && value !== origin) {
      onConfirm(value);
    } else {
      onCancel();
    }
  };

  const editor = new FroalaEditor(
    `[data-froala-id="${id}"]`,
    {
      iframe_document: elem.ownerDocument,
      toolbarInline: true,
      charCounterCount: false,
      key: richTextToken,
      // If this user is not configured to automatically wrap the <p>, it will jump
      // https://wysiwyg-editor.froala.help/hc/en-us/articles/115000461089-Can-I-disable-wrapping-content-with-P-tags
      enter: FroalaEditor.ENTER_BR,
      // todo Now the position of this button is problematic, ignore it for now
      // quickInsertEnabled: false,
      toolbarButtons: [
        'paragraphFormat',
        'textColor',
        'backgroundColor',
        'bold',
        'underline',
        'strikeThrough',
        'formatOL',
        'format',
        'align',
        'quote',
        'insertLink',
        'insertImage',
        'insertEmotion',
        'insertTable'
      ],
      imageUpload: false,
      ...richTextOptions,
      events: {
        blur: cleanup,
        keydown: (e: KeyboardEvent) => {
          if (e.key === 'Escape') {
            // Don't restore all the content, just cancel it
            // forceCancel = true;
            cleanup();
          }
        },
        contentChanged: () => {
          node.calculateHighlightBox();
        }
      }
    },
    () => {
      editor.events.focus();
      origin = editor.html.get();

      let caretRange = event
        ? getMouseEventCaretRange(event, elem)
        : createRangeAtTheEnd(elem);

      // Set a timer to allow the selection to happen and the dust settle first
      setTimeout(function () {
        selectRange(caretRange, elem);
      }, 10);
    }
  );
}

/**
 * Create a Range object at the end of the element
 * Used to set the cursor position
 * @param {HTMLElement} elem - target element
 * @returns {Range} The created Range object
 */
function createRangeAtTheEnd(elem: HTMLElement) {
  const range = elem.ownerDocument.createRange();
  range.selectNodeContents(elem);
  range.collapse(false);
  return range;
}

/**
 * Get the cursor Range based on the mouse event
 * Support multiple browser cursor position acquisition methods
 * Including IE, Mozilla, WebKit, etc.
 * @param {MouseEvent} evt - mouse event object
 * @returns {Range} Range object at the cursor position
 */
function getMouseEventCaretRange(evt: MouseEvent, elem: HTMLElement) {
  let range,
    x = evt.clientX,
    y = evt.clientY;

  const target = evt.target as HTMLElement;
  const doc = elem.ownerDocument;

  if (target.ownerDocument !== doc) {
    // If the click event comes from outside the iframe, the coordinates need to be adjusted
    const iframe = doc.defaultView?.frameElement as HTMLIFrameElement;

    if (iframe) {
      const rect = iframe.getBoundingClientRect();
      x -= rect.left;
      y -= rect.top;
    }
  }

  // Try the simple IE way first
  if ((doc.body as any).createTextRange) {
    range = (doc.body as any).createTextRange();
    range.moveToPoint(x, y);
  } else if (typeof doc.createRange != 'undefined') {
    // Try Mozilla's rangeOffset and rangeParent properties,
    // which are exactly what we want
    if (typeof (evt as any).rangeParent != 'undefined') {
      range = doc.createRange();
      range.setStart((evt as any).rangeParent, (evt as any).rangeOffset);
      range.collapse(true);
    }

    // Try the standards-based way next
    else if ((doc as any).caretPositionFromPoint) {
      let pos: any = (doc as any).caretPositionFromPoint(x, y);
      range = doc.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
    }

    // Next, the WebKit way
    else if (doc.caretRangeFromPoint) {
      range = doc.caretRangeFromPoint(x, y);
    }
  }

  return range;
}

/**
 * Select the specified Range area
 * Supports both IE and standard browsers
 * @param {Range} range - the Range object to be selected
 */
function selectRange(range: any, elem: HTMLElement) {
  const doc = elem.ownerDocument;
  const win = doc.defaultView || (doc as any).parentWindow;

  if (range) {
    if (typeof range.select != 'undefined') {
      range.select();
    } else if (typeof win.getSelection != 'undefined') {
      let sel: any = win.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}
