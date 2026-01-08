import React, { JSX } from "react";
import { ChildrenProps } from "../props/mod.ts";

React;

export function GapperAndClickerInAnchor(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex justify-center items-center gap-2 group-not-aria-disabled:group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function ClickableOppositeAnchor(props: ChildrenProps & JSX.IntrinsicElements["a"] & { "aria-disabled"?: boolean }) {
  const { children, "aria-disabled": disabled = false, ...rest } = props

  return <a className="group po-2 bg-opposite text-opposite rounded-xl outline-none not-aria-disabled:hover:bg-opposite-double-contrast focus-visible:outline-opposite aria-disabled:opacity-50 transition-opacity"
    aria-disabled={disabled}
    {...rest}>
    <GapperAndClickerInAnchor>
      {children}
    </GapperAndClickerInAnchor>
  </a>
}

export function ClickableContrastAnchor(props: ChildrenProps & JSX.IntrinsicElements["a"] & { "aria-disabled"?: boolean }) {
  const { children, "aria-disabled": disabled = false, ...rest } = props

  return <a className="group po-2 bg-default-contrast rounded-xl outline-none not-aria-disabled:hover:bg-default-double-contrast focus-visible:outline-default-contrast aria-disabled:opacity-50 transition-opacity"
    aria-disabled={disabled}
    {...rest}>
    <GapperAndClickerInAnchor>
      {children}
    </GapperAndClickerInAnchor>
  </a>
}