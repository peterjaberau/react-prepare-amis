import type { TLayout } from '../../declarations';

export const getHigherPoint = (layout: TLayout) =>
  layout.reduce((prev, cur) => {
    const size = cur.y + cur.h;
    return size > prev ? size : prev;
  }, 0);
