import { useState } from "react";

interface DashboardGridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  gridWidth?: number;
  gridPos?: { y: number; x: number; w: number; h: number, static?: boolean } | any;
  isViewing: boolean;
  windowHeight: number;
  windowWidth: number;
  children: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export function DashboardGridItem(props: DashboardGridItemProps) {

  const { gridWidth, gridPos, isViewing, windowHeight, windowWidth, ...rest } = props;

  let width = 100;
  let height = 100;

  if (isViewing) {
    // In fullscreen view mode a single panel take up full width & 85% height
    width = gridWidth!;
    height = windowHeight * 0.85;
  }

  // props.children[0] is our main children. RGL adds the drag handle at props.children[1]
  return (
    <div {...rest}>
      {[props.children[0](width, height), props.children.slice(1)]}
    </div>
  );
}
