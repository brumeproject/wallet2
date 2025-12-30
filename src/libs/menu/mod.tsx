// deno-lint-ignore-file no-unused-vars

import { usePathContext } from "@hazae41/chemin";
import { CloseContext, useCloseContext } from "@hazae41/react-close-context";
import React, { JSX, KeyboardEvent, MouseEvent, SyntheticEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Events } from "../events/mod.ts";
import { Nullable } from "../nullable/mod.tsx";
import { Portal } from "../portal/mod.tsx";
import { ChildrenProps, DarkProps } from "../props/mod.ts";

React;

export function Menu(props: ChildrenProps & DarkProps) {
  const { url } = usePathContext().getOrThrow()
  const close = useCloseContext().getOrThrow()
  const { dark, children } = props

  const maybeX = url.searchParams.get("x")
  const maybeY = url.searchParams.get("y")

  const previous = useRef(document.activeElement)

  /**
   * Restore focus on unmount
   */
  useEffect(() => () => {
    if (previous.current == null)
      return
    if (!(previous.current instanceof HTMLElement))
      return
    previous.current.focus()
  }, [])

  const [dialog, setDialog] = useState<HTMLDialogElement | null>(null)

  /**
   * Forcefully open HTML dialog on mount
   */
  useLayoutEffect(() => {
    if (!document.body.contains(dialog))
      return
    dialog?.showModal()
  }, [dialog])

  const [premount, setPremount] = useState(true)
  const [postmount, setPostmount] = useState(false)

  /**
   * Smoothly close the dialog
   */
  const hide = useCallback((force?: boolean) => {
    if (force) {
      close()
      return
    }

    setPremount(false)
  }, [close])

  /**
   * Smoothly close the dialog on escape
   */
  const onEscape = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Escape")
      return

    e.preventDefault()

    hide()
  }, [hide])

  /**
   * Smoothly close the dialog on outside click
   */
  const onClickOutside = useCallback((e: MouseEvent) => {
    if (e.clientX > e.currentTarget.clientWidth)
      return

    e.preventDefault()

    hide()
  }, [hide])

  /**
   * When the dialog could not be closed smoothly
   * @example Safari on escape
   */
  const onClose = useCallback((e: SyntheticEvent) => {
    close()
  }, [close])

  /**
   * Sync mounted state with visible state on animation end
   */
  const onAnimationEnd = useCallback(() => {
    flushSync(() => setPostmount(premount))
  }, [premount])

  /**
   * Unmount this component from parent when both visible and mounted are false
   */
  useEffect(() => {
    if (premount)
      return
    if (postmount)
      return
    close()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [premount, postmount])

  const [menu, setMenu] = useState<Nullable<HTMLElement>>(null)

  const [maybeW, setMaybeW] = useState(0)
  const [maybeH, setMaybeH] = useState(0)

  const [maybeL, setMaybeL] = useState(0)
  const [maybeT, setMaybeT] = useState(0)

  useLayoutEffect(() => {
    if (menu == null)
      return

    setMaybeW(menu.offsetWidth)
    setMaybeH(menu.offsetHeight)

    if (maybeX == null)
      return
    if (maybeY == null)
      return

    const x = Number(maybeX)
    const y = Number(maybeY)

    setMaybeL(((x + menu.offsetWidth) > innerWidth) ? Math.max(x - menu.offsetWidth, 0) : x)
    setMaybeT(((y + menu.offsetHeight) > innerHeight) ? Math.max(y - menu.offsetHeight, 0) : y)
  }, [maybeX, maybeY, menu])

  /**
   * Only unmount when transition is finished
   */
  if (!premount && !postmount)
    return null

  return <Portal>
    <CloseContext value={hide}>
      <dialog className={`[--x:${maybeX}px] [--y:${maybeY}px] [--w:${maybeW}px] [--h:${maybeH}px] [--l:${maybeL}px] [--t:${maybeT}px]`}
        onKeyDown={onEscape}
        onClose={onClose}
        ref={setDialog}>
        <div className={`fixed inset-0`}
          data-theme={dark && "dark"}
          onMouseDown={onClickOutside}
          onClick={Events.isolate}>
          <div className={`absolute flex flex-col min-w-[min(calc(100vw-var(--l)),8rem)] max-w-[min(calc(100vw-var(--l)),32rem)] top-0 left-0 [translate:var(--l)_var(--t)] text-default bg-default border border-default-contrast rounded-2xl p-2 ${premount ? "animate-scale-xywh-in" : "animate-scale-xywh-out"}`}
            ref={setMenu}
            aria-modal
            onAnimationEnd={onAnimationEnd}
            onMouseDown={Events.isolate}>
            <div className="grow flex flex-col max-h-[200px] overflow-y-auto p-scroll">
              {children}
            </div>
          </div>
        </div>
      </dialog>
    </CloseContext>
  </Portal>
}

export function GapperAndClickerInMenuAnchor(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex items-center justify-start gap-4 group-not-aria-disabled:group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function GapperAndClickerInMenuButton(props: ChildrenProps) {
  const { children } = props

  return <div className="h-full w-full flex items-center justify-start gap-4 group-enabled:group-active:scale-90 transition-transform">
    {children}
  </div>
}

export function WideClickableNakedMenuAnchor(props: ChildrenProps & JSX.IntrinsicElements["a"] & { "aria-disabled"?: boolean }) {
  const { children, "aria-disabled": disabled = false, ...rest } = props

  return <a className="group flex-1 po-2 rounded-xl outline-none whitespace-nowrap not-aria-disabled:hover:bg-default-contrast focus-visible:bg-default-contrast aria-disabled:opacity-50 transition-opacity"
    aria-disabled={disabled}
    {...rest}>
    <GapperAndClickerInMenuAnchor>
      {children}
    </GapperAndClickerInMenuAnchor>
  </a>
}

export function WideClickableNakedMenuButton(props: ChildrenProps & JSX.IntrinsicElements["button"] & { ["data-value"]?: string } & { ["aria-selected"]?: boolean }) {
  const { children, ...rest } = props

  return <button className="group flex-1 po-2 rounded-xl outline-none whitespace-nowrap enabled:hover:bg-default-contrast focus-visible:bg-default-contrast aria-selected:bg-default-contrast disabled:opacity-50 transition-opacity"
    {...rest}>
    <GapperAndClickerInMenuButton>
      {children}
    </GapperAndClickerInMenuButton>
  </button>
}