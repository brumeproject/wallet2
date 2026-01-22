import React, { JSX } from "react";
import { ChildrenProps } from "../props/mod.ts";

React;

export function InAnchor(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex justify-center items-center gap-2 group-not-aria-disabled:group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function OppositeAnchor(props: ChildrenProps & JSX.IntrinsicElements["a"] & { "aria-disabled"?: boolean }) {
  const { children, "aria-disabled": disabled = false, ...rest } = props

  return <a className="group po-2 bg-opposite text-opposite rounded-xl not-aria-disabled:hover:bg-opposite-double-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-opposite aria-disabled:opacity-50 transition-opacity"
    aria-disabled={disabled}
    {...rest}>
    <InAnchor>
      {children}
    </InAnchor>
  </a>
}

export function ContrastAnchor(props: ChildrenProps & JSX.IntrinsicElements["a"] & { "aria-disabled"?: boolean }) {
  const { children, "aria-disabled": disabled = false, ...rest } = props

  return <a className="group po-2 bg-default-contrast rounded-xl not-aria-disabled:hover:bg-default-double-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast aria-disabled:opacity-50 transition-opacity"
    aria-disabled={disabled}
    {...rest}>
    <InAnchor>
      {children}
    </InAnchor>
  </a>
}