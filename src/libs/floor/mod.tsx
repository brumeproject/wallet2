// deno-lint-ignore-file no-unused-vars

/// <reference lib="dom"/>

import { CloseContext, useCloseContext } from "@hazae41/react-close-context"
import React, { AnimationEvent, KeyboardEvent, MouseEvent, SyntheticEvent, UIEvent, useCallback, useEffect, useLayoutEffect, useState } from "react"
import { flushSync } from "react-dom"
import { Events } from "../events/mod.ts"
import { ChildrenProps, DarkProps } from "../props/mod.ts"

React;

export function Floor(props: ChildrenProps & DarkProps) {
  const close = useCloseContext().getOrThrow()
  const { dark, children } = props

  const [dialog, setDialog] = useState<HTMLDialogElement>()

  /**
   * Show the dialog when mounted
   */
  useLayoutEffect(() => {
    dialog?.showModal()
  }, [dialog])

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
  const onEscape = useCallback((e: KeyboardEvent) => {
    if (e.key !== "Escape")
      return

    e.preventDefault()

    hide()
  }, [hide])

  /**
   * Smoothly close the dialog on outside click
   */
  const onMouseDown = useCallback((e: MouseEvent) => {
    if (e.clientX > e.currentTarget.clientWidth)
      return

    e.preventDefault()

    hide()
  }, [hide])

  /**
   * Force close when dialog is closed (Safari bug)
   */
  const onClose = useCallback((e: SyntheticEvent) => {
    close()
  }, [close])

  /**
   * Sync visible state with mounted state on animation end
   */
  const onAnimationEnd = useCallback((e: AnimationEvent) => {
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
   * Sync theme-color with dark mode
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

  /**
   * Swipe down to close
   */
  const onScroll = useCallback((e: UIEvent) => {
    if (e.currentTarget.scrollTop > 0)
      return
    hide()
  }, [hide])

  const [content, setContent] = useState<HTMLDivElement>()

  /**
   * Smoothly scroll to the content to perfectly fit the screen
   */
  useEffect(() => {
    if (content == null)
      return

    const timeout = setTimeout(() => content.scrollIntoView({ behavior: "smooth" }))

    return () => clearTimeout(timeout)
  }, [content])

  /**
   * Only unmount when transition is finished
   */
  if (!premount && !postmount)
    return null

  return <CloseContext value={hide}>
    <dialog className={`h-full w-full max-h-none max-w-none bg-transparent flex flex-col overscroll-y-none [scrollbar-gutter:stable] ${premount && postmount ? "overflow-y-scroll" : "overflow-y-hidden"} ${premount ? "animate-slideup-in" : "animate-slideup-out"} backdrop:bg-backdrop ${premount ? "backdrop:animate-opacity-in" : "backdrop:animate-opacity-out"}`}
      data-theme={dark && "dark"}
      onAnimationEnd={onAnimationEnd}
      onMouseDown={onMouseDown}
      onKeyDown={onEscape}
      onScroll={onScroll}
      onClose={onClose}
      ref={setDialog}>
      <div className="basis-[50vh] shrink-0" />
      <div className="flex flex-col bg-default text-default rounded-t-3xl"
        onMouseDown={Events.stopPropagation}>
        <div className="flex items-center justify-center p-4 ">
          <div className="w-16 h-2 bg-backdrop rounded-full" />
        </div>
        <div className="basis-[100vh] flex flex-col p-safe"
          ref={setContent}>
          {children}
        </div>
      </div>
    </dialog>
  </CloseContext>
}