export const data: any = {
  Disabled: {
    disabled: true,
    layout: [
      { x: 0, y: -2, w: 2, h: 2, i: "1" },
      { x: -2, y: 0, w: 2, h: 2, i: "2" },
      { x: 0, y: 1, w: 20, h: 2, i: "3" },
      { x: 0, y: 2, w: 2, h: 2, i: "4" },
      { x: 20, y: 0, w: 2, h: 2, i: "5" },
      { x: -2, y: -2, w: 20, h: 2, i: "6" },
    ],
  } as any,
  Colsandrowheight: {
    layout: [
      { x: 0, y: 0, w: 2, h: 8, i: "1" },
      { x: 2, y: 0, w: 2, h: 8, i: "2" },
      { x: 0, y: 8, w: 6, h: 2, i: "3" },
    ],
    debug: false,
    cols: 6,
    rowHeight: 20,
  } as any,
  CollisionWithPriority: {
    rowHeight: 24,
    layout: [
      { w: 3, h: 10, x: 4, y: 0, i: "1" },
      { w: 3, h: 9, x: 3, y: 10, i: "2", priority: 1 },
      { w: 4, h: 14, x: 0, y: 0, i: "3" },
    ],
  } as any,
  Bricks: {
    layout: [
      { x: 1, y: 0, w: 2, h: 1, i: "17" },
      { x: 4, y: 0, w: 3, h: 1, i: "1" },
      { x: 8, y: 0, w: 2, h: 1, i: "18" },
      { x: 3, y: 1, w: 2, h: 1, i: "3" },
      { x: 6, y: 1, w: 2, h: 1, i: "2" },
      { x: 2, y: 2, w: 2, h: 1, i: "4" },
      { x: 7, y: 2, w: 2, h: 1, i: "5" },
      { x: 1, y: 3, w: 2, h: 1, i: "6" },
      { x: 8, y: 3, w: 2, h: 1, i: "8" },
      { x: 0, y: 4, w: 2, h: 1, i: "7" },
      { x: 9, y: 4, w: 2, h: 1, i: "9" },
      { x: 1, y: 5, w: 2, h: 1, i: "10" },
      { x: 8, y: 5, w: 2, h: 1, i: "14" },
      { x: 2, y: 6, w: 2, h: 1, i: "12" },
      { x: 7, y: 6, w: 2, h: 1, i: "11" },
      { x: 3, y: 7, w: 2, h: 1, i: "13" },
      { x: 6, y: 7, w: 2, h: 1, i: "15" },
      { x: 4, y: 8, w: 3, h: 1, i: "16" },
      { x: 0, y: 9, w: 6, h: 4, i: "19" },
      { x: 6, y: 9, w: 6, h: 4, i: "20" },
    ],
  } as any,
  Boundaries: {
    layout: [
      { x: 0, y: 0, w: 2, h: 2, i: "1" },
      {
        x: 2,
        y: 0,
        w: 2,
        h: 2,
        i: "2",
        minW: 2,
        minH: 2,
        maxW: 6,
        maxH: 5,
        data: {
          content:
            "This one has boundaries: { minW: 2, minH: 2, maxW: 6, maxH: 5 }",
        },
      },
      { x: 0, y: 2, w: 2, h: 2, i: "3" },
      { x: 0, y: 5, w: 2, h: 2, i: "4" },
      { x: 10, y: 0, w: 2, h: 2, i: "5" },
      { x: 10, y: 8, w: 2, h: 2, i: "6" },
    ],
  } as any,
  InitialCollisions: {
    layout: [
      { x: 0, y: 0, w: 2, h: 2, i: "1" },
      { x: 0, y: 0, w: 2, h: 2, i: "2" },
      { x: 0, y: 1, w: 2, h: 2, i: "3" },
      { x: 0, y: 2, w: 2, h: 2, i: "4" },
      { x: 10, y: 0, w: 2, h: 2, i: "5" },
      { x: 9, y: 0, w: 2, h: 2, i: "6" },
    ],
  },
  LargeExample: {
    layout: Array.from({ length: 100 })
      .fill(null)
      .map((_, index) => [
        { x: 0, y: index * 10, w: 6, h: 4, i: String(index * 3 + 1) },
        { x: 6, y: index * 10, w: 6, h: 4, i: String(index * 3 + 2) },
        { x: 0, y: index * 10 + 4, w: 12, h: 6, i: String(index * 3 + 3) },
      ])
      .reduce((prev, cur) => prev.concat(cur), []),
  } as any,
  OutOfTheContainer: {
    layout: [
      { x: 0, y: -2, w: 2, h: 2, i: "1" },
      { x: -2, y: 0, w: 2, h: 2, i: "2" },
      { x: 0, y: 1, w: 20, h: 2, i: "3" },
      { x: 0, y: 2, w: 2, h: 2, i: "4" },
      { x: 20, y: 0, w: 2, h: 2, i: "5" },
      { x: -2, y: -2, w: 20, h: 2, i: "6" },
    ],
  } as any,
  Scroll: {
    layout: Array.from({ length: 50 })
      .fill(null)
      .map((_, index) => ({
        x: 0,
        y: index,
        w: 6,
        h: 1,
        i: String(index + 1),
      })),
  } as any,
} as any;

