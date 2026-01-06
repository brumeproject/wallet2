// deno-lint-ignore-file no-unused-vars

/// <reference lib="dom"/>

import { usePathContext } from "@hazae41/chemin"
import { CloseContext, useCloseContext } from "@hazae41/react-close-context"
import React, { AnimationEvent, KeyboardEvent, MouseEvent, SyntheticEvent, UIEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { Events } from "../events/mod.ts"
import { ChildrenProps, DarkProps } from "../props/mod.ts"

React;

export function Dialog(props: ChildrenProps & DarkProps) {
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
     * Only on touch devices
     */
    if (navigator.maxTouchPoints === 0)
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

  const [content, setContent] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    if (content == null)
      return
    /**
     * Scroll to the content to fit the screen
     */
    setTimeout(() => content.scrollIntoView({ behavior: "smooth" }))
  }, [content])

  /**
   * Only unmount when transition is finished
   */
  if (!premount && !postmount)
    return null

  return <CloseContext value={hide}>
    <dialog className={`h-full w-full max-h-none max-w-none md:p-safe bg-transparent flex flex-col [scrollbar-gutter:stable] [--x:${maybeX}px] [--y:${maybeY}px] ${postmount && premount ? "overflow-y-scroll" : "overflow-y-hidden"} ${premount ? "animate-slideup-in md:animate-scale-xy-in" : "animate-slideup-out md:animate-scale-xy-out"} backdrop:bg-backdrop ${premount ? "backdrop:animate-opacity-in" : "backdrop:animate-opacity-out"}`}
      data-theme={dark && "dark"}
      onAnimationEnd={onAnimationEnd}
      onMouseDown={onClickOutside}
      onScroll={onScroll}
      onTouchMove={onTouchStart}
      onTouchEnd={onTouchEnd}
      onKeyDown={onEscape}
      onClose={onClose}
      ref={setDialog}>
      <div className="basis-[50vh] shrink-0 md:basis-auto md:grow md:shrink" />
      <div className="flex flex-col md:w-full md:m-auto md:max-w-3xl text-default bg-default rounded-t-3xl md:rounded-3xl"
        onMouseDown={Events.stopPropagation}>
        <div className="flex md:hidden items-center justify-center p-4">
          <div className="w-16 h-2 bg-backdrop rounded-full" />
        </div>
        <div className="basis-[100dvh] md:basis-[50dvh] flex flex-col p-safe md:p-0"
          ref={setContent}>
          {children}
        </div>
      </div>
      <div className="hidden md:block grow" />
    </dialog>
  </CloseContext>
}