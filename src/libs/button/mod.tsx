import React, { JSX } from "react";
import { ChildrenProps } from "../props/mod.ts";

React;

export function GapperAndClickerInButton(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex justify-center items-center gap-2 group-enabled:group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function WideClickableOppositeButton(props: ChildrenProps & JSX.IntrinsicElements["button"]) {
  const { children, ...rest } = props

  return <button className="flex-1 group po-2 bg-opposite text-opposite rounded-xl enabled:hover:bg-opposite-double-contrast focus:outline-2 focus:outline-offset-2 focus:outline-opposite disabled:opacity-50 transition-opacity"
    {...rest}>
    <GapperAndClickerInButton>
      {children}
    </GapperAndClickerInButton>
  </button>
}

export function WideClickableContrastButton(props: ChildrenProps & JSX.IntrinsicElements["button"]) {
  const { children, ...rest } = props

  return <button className="flex-1 group po-2 bg-default-contrast rounded-xl enabled:hover:bg-default-double-contrast focus:outline-2 focus:outline-offset-2 focus:outline-default-contrast disabled:opacity-50 transition-opacity"
    {...rest}>
    <GapperAndClickerInButton>
      {children}
    </GapperAndClickerInButton>
  </button>
}

export function ClickableOppositeButton(props: ChildrenProps & JSX.IntrinsicElements["button"]) {
  const { children, ...rest } = props

  return <button className="group po-2 bg-opposite text-opposite rounded-xl enabled:hover:bg-opposite-double-contrast focus:outline-2 focus:outline-offset-2 focus:outline-opposite disabled:opacity-50 transition-opacity"
    {...rest}>
    <GapperAndClickerInButton>
      {children}
    </GapperAndClickerInButton>
  </button>
}