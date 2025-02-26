import {RefObject, useCallback, useEffect} from 'react';

//Store a collection of all click event listeners
const listeners = new Set<(e: Event) => void>();

// Add a click event listener
const addClickListener = (callback: (e: Event) => void) =>
  listeners.add(callback);

// Remove the click event listener
const removeClickListener = (callback: (e: Event) => void) =>
  listeners.delete(callback);

// Handle click events and call all listeners
function handleEvent(e: Event) {
  listeners.forEach(listener => listener(e));
}

//Default event type
const defaultEvents = ['mousedown', 'touchstart'];

/**
 * Custom Hook: useClickAway
 * When a click event occurs outside the specified element, the callback function is triggered
 *
 * @param ref - the reference to the target element
 * @param onClickAway - callback function when clicking outside
 * @param doc - Document object, defaults to the current document
 * @param events - the event type to listen for, default is ['mousedown', 'touchstart']
 */
const useClickAway = (
  ref: RefObject<HTMLElement | null>,
  onClickAway: (e: Event) => void,
  doc: Document = document,
  events: string[] = defaultEvents
) => {
  // Event handling function
  const handler = useCallback(
    (e: Event) => {
      const {current: el} = ref;
      el && !el.contains(e.target as Node) && onClickAway(e);
    },
    [ref]
  );

  useEffect(() => {
    // Add event listener
    if (!listeners.has(handler)) {
      addClickListener(handler);
    }
    events.forEach(event => doc.addEventListener(event, handleEvent));

    // Cleanup function, remove event listener
    return () => {
      removeClickListener(handler);
      events.forEach(event => doc.removeEventListener(event, handleEvent));
    };
  }, [events, ref, doc]);
};

export default useClickAway;
