// deno-lint-ignore-file no-unused-vars

import { Nullable } from "@/libs/nullable/mod.ts";
import { Portal } from "@/libs/portal/mod.tsx";
import { ChildrenProps } from "@/libs/props/mod.ts";
import { usePathContext } from "@hazae41/chemin";
import { CloseContext, useCloseContext } from "@hazae41/react-close-context";
import React, { JSX, KeyboardEvent, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

React;

export function PathPaper(props: ChildrenProps) {
  const { children } = props

  const path = usePathContext().getOrThrow()

  const x = Number(path.url.searchParams.get("x"))
  const y = Number(path.url.searchParams.get("y"))

  return <Paper x={x} y={y}>
    {children}
  </Paper>
}

/**
 * Dialog positioned at some coordinates
 * @param props 
 * @returns 
 */
export function Paper(props: ChildrenProps & { x: number; y: number }) {
  const close = useCloseContext().getOrThrow()
  const { children, x, y } = props

  const [state, setState] = useState<"delayed" | "rendering" | "opening" | "opened" | "closing" | "closed">("delayed")

  useEffect(() => {
    setState("rendering")
  }, [])

  const previous = useRef(document.activeElement)

  /**
   * Restore focus on unmount
   */
  useEffect(() => () => {
    if (previous.current == null)
      return
    if (previous.current instanceof HTMLElement === false)
      return

    const element = previous.current

    setTimeout(() => element.focus(), 2)
  }, [])

  /**
   * Compute position and size
   */
  const onDialog = useCallback((dialog: Nullable<HTMLDivElement>) => {
    if (dialog == null)
      return

    requestIdleCallback(() => {
      const w = dialog.offsetWidth
      const h = dialog.offsetHeight

      const l = ((x + w) > innerWidth) ? Math.max(x - w, 0) : x
      const t = ((y + h) > innerHeight) ? Math.max(y - h, 0) : y

      dialog.style.setProperty("--x", `${x}px`)
      dialog.style.setProperty("--y", `${y}px`)

      dialog.style.setProperty("--w", `${w}px`)
      dialog.style.setProperty("--h", `${h}px`)

      dialog.style.setProperty("--l", `${l}px`)
      dialog.style.setProperty("--t", `${t}px`)

      flushSync(() => setState("opening"))
    }, { timeout: 100 })
  }, [x, y])

  /**
   * Smoothly close the dialog
   */
  const hide = useCallback((force?: boolean) => {
    setState("closing")

    if (!force)
      return

    close()
  }, [close])

  /**
   * Smoothly close the dialog on escape
   */
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Escape")
      return

    e.preventDefault()
    e.stopPropagation()

    hide()
  }, [hide])

  /**
   * Smoothly close the dialog on outside click
   */
  const onMouseDown = useCallback((e: MouseEvent) => {
    /**
     * Ignore clicks on scrollbar
     */
    if (e.clientX > e.currentTarget.clientWidth)
      return

    e.preventDefault()
    e.stopPropagation()

    hide()
  }, [hide])

  /**
   * Switch state on animation end
   */
  const onAnimationEnd = useCallback(() => {
    if (state === "opening")
      flushSync(() => setState("opened"))
    if (state === "closing")
      flushSync(() => setState("closed"))
    return
  }, [state])

  /**
   * Close when closed
   */
  useEffect(() => {
    if (state !== "closed")
      return
    close()
  }, [state, close])

  if (state === "delayed")
    return null
  if (state === "closed")
    return null

  return <CloseContext value={hide}>
    <Portal>
      <div className="fixed inset-0 flex flex-col"
        onMouseDown={onMouseDown} />
      <div className="fixed top-0 left-0 translate-x-(--l) translate-y-(--t) flex flex-col text-default bg-default focus-visible:outline-none border border-default-contrast rounded-xl p-2 data-[state=rendering]:opacity-0 data-[state=opening]:animate-scale-xywh-in data-[state=closing]:animate-scale-xywh-out"
        data-state={state}
        onAnimationEnd={onAnimationEnd}
        onKeyDown={onKeyDown}
        ref={onDialog}>
        <button type="button" autoFocus />
        {children}
      </div>
    </Portal>
  </CloseContext>
}

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