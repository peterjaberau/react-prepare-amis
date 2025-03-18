import React, { useState, useCallback, useRef } from "react";
import {
  EuiResizableButton,
  EuiPanel,
  keys,
  EuiPortal,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPageTemplate,
} from "@elastic/eui";
// @ts-ignore
import { logicalCSS } from "@elastic/eui/lib/global_styling";
import { css } from "@emotion/react";

const MIN_PANEL_SIZE = 20;

const getMouseOrTouchPosition = (
  e: TouchEvent | MouseEvent | React.MouseEvent | React.TouchEvent,
) => ({
  x: (e as TouchEvent).targetTouches
    ? (e as TouchEvent).targetTouches[0].pageX
    : (e as MouseEvent).pageX,
  y: (e as TouchEvent).targetTouches
    ? (e as TouchEvent).targetTouches[0].pageY
    : (e as MouseEvent).pageY,
});

interface CustomResizeLogicProps {
  position?: "bottom" | "top" | "left" | "right";
}

export const CustomResizeLogic: React.FC<CustomResizeLogicProps> = ({
  position = "bottom",
}) => {
  const isVertical = position === "bottom" || position === "top";
  const [size, setSize] = useState(200);
  const initialSize = useRef(size);
  const initialMousePos = useRef(0);

  const onMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const { x, y } = getMouseOrTouchPosition(e);
      const offset = isVertical
        ? y - initialMousePos.current
        : x - initialMousePos.current;

      let newSize = initialSize.current;
      if (position === "bottom" || position === "right") {
        newSize = Math.max(initialSize.current - offset, MIN_PANEL_SIZE);
      } else {
        newSize = Math.max(initialSize.current + offset, MIN_PANEL_SIZE);
      }

      setSize(newSize);
    },
    [position, isVertical],
  );

  const onMouseUp = useCallback(() => {
    initialMousePos.current = 0;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    window.removeEventListener("touchmove", onMouseMove);
    window.removeEventListener("touchend", onMouseUp);
  }, [onMouseMove]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      initialMousePos.current = isVertical
        ? getMouseOrTouchPosition(e).y
        : getMouseOrTouchPosition(e).x;
      initialSize.current = size;

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onMouseMove);
      window.addEventListener("touchend", onMouseUp);
    },
    [size, isVertical, onMouseMove, onMouseUp],
  );

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    const KEYBOARD_OFFSET = 10;
    switch (e.key) {
      case keys.ARROW_RIGHT:
      case keys.ARROW_DOWN:
        e.preventDefault();
        setSize((s) => Math.max(s - KEYBOARD_OFFSET, MIN_PANEL_SIZE));
        break;
      case keys.ARROW_LEFT:
      case keys.ARROW_UP:
        e.preventDefault();
        setSize((s) => s + KEYBOARD_OFFSET);
        break;
    }
  }, []);

  const panelStyles: React.CSSProperties = {
    position: 'absolute',
    [position]: 0,
    ...(isVertical ? {
      inlineSize: '-webkit-fill-available',  height: size,
    } : { width: size, height: '100%' }),
    maxHeight: isVertical ? '100vh' : undefined,
    maxWidth: isVertical ? undefined : '100vw',
    boxShadow:     '0 .9px 4px rgba(0,0,0,0.15), 0 2.6px 8px rgba(0,0,0,0.12), 0 5.7px 12px rgba(0,0,0,0.10), 0 15px 15px rgba(0,0,0,0.08)',
  zIndex: 1000,
  };

  return (



    <EuiPanel paddingSize="s"
              style={panelStyles}
              hasShadow={true}
              // hasBorder={true}
              color={"plain"}
              borderRadius={"none"}
      >
      <EuiResizableButton
        // indicator={"border"}
        accountForScrollbars={"both"}

        isHorizontal={!isVertical}
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
        onKeyDown={onKeyDown}
      />

      test
    </EuiPanel>
  );
};
