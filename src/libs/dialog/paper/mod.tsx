import { ChildrenProps } from "@/libs/props/mod.ts";
import React, { JSX } from "react";

React;

export function InMenuAnchor(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex items-center justify-start gap-4 select-none group-not-aria-disabled:group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function InMenuButton(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex items-center justify-start gap-4 select-none cursor-pointer group-enabled:group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function WideNakedMenuAnchor(props: ChildrenProps & JSX.IntrinsicElements["a"] & { "aria-disabled"?: boolean }) {
  const { children, "aria-disabled": disabled = false, ...rest } = props

  return <a className="group flex-1 po-2 rounded-xl focus-visible:outline-none whitespace-nowrap not-aria-disabled:hover:bg-default-double-contrast focus-visible:bg-default-double-contrast aria-disabled:opacity-50"
    aria-disabled={disabled}
    {...rest}>
    <InMenuAnchor>
      {children}
    </InMenuAnchor>
  </a>
}

export function WideNakedMenuButton(props: ChildrenProps & JSX.IntrinsicElements["button"] & { type: "button" }) {
  const { children, ...rest } = props

  return <button className="group flex-1 po-2 rounded-xl focus-visible:outline-none whitespace-nowrap enabled:hover:bg-default-double-contrast focus-visible:bg-default-double-contrast disabled:opacity-50"
    {...rest}>
    <InMenuButton>
      {children}
    </InMenuButton>
  </button>
}