// deno-lint-ignore-file no-unused-vars

import { usePathContext } from "@hazae41/chemin";
import { CloseContext, useCloseContext } from "@hazae41/react-close-context";
import React, { JSX, KeyboardEvent, MouseEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { ChildrenProps } from "../props/mod.ts";

React;

export function PathMenu(props: ChildrenProps) {
  const { children } = props

  const path = usePathContext().getOrThrow()

  const x = Number(path.url.searchParams.get("x"))
  const y = Number(path.url.searchParams.get("y"))

  return <Menu x={x} y={y}>
    {children}
  </Menu>
}

/**
 * Dialog positioned at some coordinates
 * @param props 
 * @returns 
 */
export function Menu(props: ChildrenProps & { x: number; y: number }) {
  const close = useCloseContext().getOrThrow()
  const { children, x, y } = props

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

  const [w, setW] = useState(0)
  const [h, setH] = useState(0)

  const [l, setL] = useState(0)
  const [t, setT] = useState(0)

  const [dialog, setDialog] = useState<HTMLDialogElement>()

  /**
   * Compute position and size
   */
  useLayoutEffect(() => {
    if (dialog == null)
      return

    dialog.showModal()

    const w = dialog.offsetWidth
    const h = dialog.offsetHeight

    setW(w)
    setH(h)

    setL(((x + w) > innerWidth) ? Math.max(x - w, 0) : x)
    setT(((y + h) > innerHeight) ? Math.max(y - h, 0) : y)
  }, [x, y, dialog])

  const [premount, setPremount] = useState(true)
  const [postmount, setPostmount] = useState(false)

  /**
   * Smoothly close the dialog
   */
  const hide = useCallback((force?: boolean) => {
    setPremount(false)

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
    if (dialog == null)
      return
    if (e.target !== dialog)
      return

    const { x, y } = dialog.getBoundingClientRect()

    const w = dialog.offsetWidth
    const h = dialog.offsetHeight

    if (e.clientX > x && e.clientX < x + w && e.clientY > y && e.clientY < y + h)
      return

    e.preventDefault()
    e.stopPropagation()

    hide()
  }, [dialog, hide])

  /**
   * Sync visible state with mounted state on animation end
   */
  const onAnimationEnd = useCallback(() => {
    flushSync(() => setPostmount(premount))
  }, [premount])

  /**
   * Close when both visible and mounted are false
   */
  useEffect(() => {
    if (premount)
      return
    if (postmount)
      return
    close()
  }, [premount, postmount])

  /**
   * Only unmount when transition is finished
   */
  if (!premount && !postmount)
    return null

  return <CloseContext value={hide}>
    <dialog className={`flex flex-col max-h-[200px] overflow-y-auto text-default bg-default focus:outline-none border border-default-contrast rounded-2xl p-2 [--x:${x}px] [--y:${y}px] [--w:${w}px] [--h:${h}px] [--l:${l}px] [--t:${t}px] [translate:var(--l)_var(--t)] ${premount ? "animate-scale-xywh-in" : "animate-scale-xywh-out"}`}
      onAnimationEnd={onAnimationEnd}
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      ref={setDialog}>
      <button type="button" autoFocus />
      {children}
    </dialog>
  </CloseContext>
}

export function InMenuAnchor(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex items-center justify-start gap-4 group-not-aria-disabled:group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function InMenuButton(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex items-center justify-start gap-4 group-enabled:group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function WideNakedMenuAnchor(props: ChildrenProps & JSX.IntrinsicElements["a"] & { "aria-disabled"?: boolean }) {
  const { children, "aria-disabled": disabled = false, ...rest } = props

  return <a className="group flex-1 po-2 rounded-xl focus:outline-none whitespace-nowrap not-aria-disabled:hover:bg-default-double-contrast focus:bg-default-double-contrast aria-disabled:opacity-50 transition-opacity"
    aria-disabled={disabled}
    {...rest}>
    <InMenuAnchor>
      {children}
    </InMenuAnchor>
  </a>
}

export function WideNakedMenuButton(props: ChildrenProps & JSX.IntrinsicElements["button"]) {
  const { children, ...rest } = props

  return <button className="group flex-1 po-2 rounded-xl focus:outline-none whitespace-nowrap enabled:hover:bg-default-double-contrast focus:bg-default-double-contrast disabled:opacity-50 transition-opacity"
    {...rest}>
    <InMenuButton>
      {children}
    </InMenuButton>
  </button>
}