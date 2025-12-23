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

  return <div
    onClick={Events.isolate}
    onContextMenu={Events.isolate}
    onDoubleClick={Events.isolate}

    onDrag={Events.isolate}
    onDragEnd={Events.isolate}
    onDragEnter={Events.isolate}
    onDragExit={Events.isolate}
    onDragLeave={Events.isolate}
    onDragOver={Events.isolate}
    onDragStart={Events.isolate}
    onDrop={Events.isolate}

    onMouseDown={Events.isolate}
    onMouseEnter={Events.isolate}
    onMouseLeave={Events.isolate}
    onMouseMove={Events.isolate}
    onMouseOver={Events.isolate}
    onMouseOut={Events.isolate}
    onMouseUp={Events.isolate}

    onKeyDown={Events.isolate}
    onKeyUp={Events.isolate}

    onFocus={Events.isolate}
    onBlur={Events.isolate}

    onChange={Events.isolate}
    onInput={Events.isolate}

    onInvalid={Events.isolate}
    onSubmit={Events.isolate}>
    {children}
  </div>
}