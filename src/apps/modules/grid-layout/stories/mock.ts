const props = {
  animation:  0,  // seconds
  animationTimingFunction: "linear", // ease, ease-in, ease-out, ease-in-out, linear
  showAfterAdjustInitialSize: true, // show after adjust initial size
  disabled: true,
  cols: 6,
  rowHeight: 20,
  layout: [
    'test text layout item',
    {
      x: 0,
      y: -2,
      w: 2,
      h: 2,
      i: "1",
      priority: 1, // Infinity
      minW: 2,
      minH: 2,
      maxW: 6,
      maxH: 5,
      data: {},
      placeholder: 'move'
    }
  ],
}


const layoutItem = {
  x: 0,
  y: -2,
  w: 2,
  h: 2,
  i: "1",
  cols: 6,
  rowHeight: 20,
  disabled: true,
  debug: true,
  data: {},
  minW: 1,
  minH: 1,
  maxW: 6,
  maxH: 5,
  priority: 1,
  placeholder: "move", // 'move', 'resize'
};
