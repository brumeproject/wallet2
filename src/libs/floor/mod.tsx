// deno-lint-ignore-file no-unused-vars no-window

/// <reference lib="dom"/>

import { CloseContext, useCloseContext } from "@hazae41/react-close-context"
import React, { AnimationEvent, KeyboardEvent, MouseEvent, SyntheticEvent, UIEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { Events } from "../events/mod.ts"
import { Portal } from "../portal/mod.tsx"
import { ChildrenProps, DarkProps } from "../props/mod.ts"

React;

export function Floor(props: ChildrenProps & DarkProps) {
  const close = useCloseContext().getOrThrow()
  const { dark, children } = props

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
  const onAnimationEnd = useCallback((e: AnimationEvent) => {
    flushSync(() => setPostmount(premount))

    /**
     * Prepare swipe down to close on Android
     */
    if (e.currentTarget.scrollTop === 0 && /(android)/i.test(navigator.userAgent)) {
      e.currentTarget.scrollTop = 1
      return
    }
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

  /**
   * Set theme-color based on dark prop
   */
  useLayoutEffect(() => {
    if (!premount)
      return
    if (!dark)
      return

    const color = document.querySelector("meta[name=theme-color]")

    if (color == null)
      return

    const original = color.getAttribute("content")

    if (original == null)
      return

    color.setAttribute("content", "#000000")

    return () => color.setAttribute("content", original)
  }, [premount, dark])

  const touch = useRef(false)

  const onTouchStart = useCallback(() => {
    touch.current = true
  }, [])

  const onTouchEnd = useCallback(() => {
    touch.current = false
  }, [])

  const onScroll = useCallback((e: UIEvent) => {
    /**
     * Only on mobile
     */
    if (window.innerWidth > 768)
      return

    /**
     * Swipe down to close on iOS
     */
    if (e.currentTarget.scrollTop < -60) {
      hide()
      return
    }

    /**
     * Prevent swipe down to close on Android
     */
    if (!touch.current && e.currentTarget.scrollTop === 0 && /(android)/i.test(navigator.userAgent)) {
      e.currentTarget.scrollTop = 1
      return
    }

    /**
     * Swipe down to close on Android
     */
    if (touch.current && e.currentTarget.scrollTop === 0 && /(android)/i.test(navigator.userAgent)) {
      hide()
      return
    }

    /**
     * Prevent overscroll on bottom
     */
    if (e.currentTarget.scrollTop > 60) {
      e.currentTarget.classList.add("overscroll-y-none")
      return
    }

    if (e.currentTarget.scrollTop < 60) {
      e.currentTarget.classList.remove("overscroll-y-none")
      return
    }

    return
  }, [hide])

  /**
   * Only unmount when transition is finished
   */
  if (!premount && !postmount)
    return null

  return <Portal>
    <CloseContext value={hide}>
      <dialog className={`h-full w-full max-h-none max-w-none bg-transparent flex flex-col-reverse [scrollbar-gutter:stable] ${premount && postmount ? "overflow-y-scroll" : "overflow-y-hidden"} ${premount ? "animate-slideup-in" : "animate-slideup-out"} backdrop:bg-backdrop ${premount ? "backdrop:animate-opacity-in" : "backdrop:animate-opacity-out"}`}
        data-theme={dark && "dark"}
        onAnimationEnd={onAnimationEnd}
        onMouseDown={onClickOutside}
        // onScroll={onScroll}
        onTouchMove={onTouchStart}
        onTouchEnd={onTouchEnd}
        onKeyDown={onEscape}
        onClose={onClose}
        ref={setDialog}>
        <div className="grow flex flex-col">
          <div className="basis-[50vh] grow" />
          <div className="flex flex-col bg-default rounded-t-3xl"
            onMouseDown={Events.stopPropagation}>
            <div className="p-4 flex items-center justify-center">
              <div className="w-16 h-2 bg-backdrop rounded-full" />
            </div>
            <div className="grow flex flex-col basis-[100vh] p-safe">
              {children}
            </div>
          </div>
        </div>
      </dialog>
    </CloseContext>
  </Portal>
}