import React, { JSX } from "react";
import { ChildrenProps } from "../props/mod.ts";

React;

export function InButton(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex justify-center items-center gap-2 group-enabled:group-active:scale-90 transition-all">
    {children}
  </div>
}

export function WideOppositeButton(props: ChildrenProps & JSX.IntrinsicElements["button"]) {
  const { children, ...rest } = props

  return <button className="flex-1 group po-2 bg-opposite text-opposite rounded-xl enabled:hover:bg-opposite-double-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-opposite disabled:opacity-50 transition-all"
    {...rest}>
    <InButton>
      {children}
    </InButton>
  </button>
}

export function WideContrastButton(props: ChildrenProps & JSX.IntrinsicElements["button"]) {
  const { children, ...rest } = props

  return <button className="flex-1 group po-2 bg-default-contrast rounded-xl enabled:hover:bg-default-double-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-contrast disabled:opacity-50 transition-all"
    {...rest}>
    <InButton>
      {children}
    </InButton>
  </button>
}

export function OppositeButton(props: ChildrenProps & JSX.IntrinsicElements["button"]) {
  const { children, ...rest } = props

  return <button className="group po-2 bg-opposite text-opposite rounded-xl enabled:hover:bg-opposite-double-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-opposite disabled:opacity-50 transition-all"
    {...rest}>
    <InButton>
      {children}
    </InButton>
  </button>
}