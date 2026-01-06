import React from "react";
import { createPortal } from "react-dom";
import { Events } from "../events/mod.ts";
import { ChildrenProps } from "../props/mod.ts";

React;

export function Portal(props: ChildrenProps) {
  return createPortal(props.children, document.body)
}

export function Isolate(props: ChildrenProps) {
  const { children } = props

  return <div className="contents"
    onClick={Events.stopPropagation}
    onContextMenu={Events.stopPropagation}
    onDoubleClick={Events.stopPropagation}

    onDrag={Events.stopPropagation}
    onDragEnd={Events.stopPropagation}
    onDragEnter={Events.stopPropagation}
    onDragExit={Events.stopPropagation}
    onDragLeave={Events.stopPropagation}
    onDragOver={Events.stopPropagation}
    onDragStart={Events.stopPropagation}
    onDrop={Events.stopPropagation}

    onMouseDown={Events.stopPropagation}
    onMouseEnter={Events.stopPropagation}
    onMouseLeave={Events.stopPropagation}
    onMouseMove={Events.stopPropagation}
    onMouseOver={Events.stopPropagation}
    onMouseOut={Events.stopPropagation}
    onMouseUp={Events.stopPropagation}

    onKeyDown={Events.stopPropagation}
    onKeyUp={Events.stopPropagation}

    onFocus={Events.stopPropagation}
    onBlur={Events.stopPropagation}

    onChange={Events.stopPropagation}
    onInput={Events.stopPropagation}

    onInvalid={Events.stopPropagation}
    onSubmit={Events.stopPropagation}>
    {children}
  </div>
}