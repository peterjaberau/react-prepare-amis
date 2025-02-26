/**
 * Used to place some key polyfills
 */

// Old versions of ios will report an error if this is not available
if (!('DragEvent' in window)) {
  Object.defineProperty(window, 'DragEvent', {
    value: class DragEvent {}
  });
}
