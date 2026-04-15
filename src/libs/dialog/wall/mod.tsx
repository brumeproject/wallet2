// deno-lint-ignore-file no-unused-vars

/// <reference lib="dom"/>

import { Events } from "@/libs/events/mod.ts"
import { Portal } from "@/libs/portal/mod.tsx"
import { ChildrenProps, DarkProps } from "@/libs/props/mod.ts"
import { CloseContext, useCloseContext } from "@hazae41/react-close-context"
import React, { KeyboardEvent, MouseEvent, UIEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { Nullable } from "../../nullable/mod.ts"

React;

/**
 * Dialog that always fills the screen
 * @param props 
 * @returns 
 */
export function Wall(props: ChildrenProps & DarkProps) {
  const close = useCloseContext().getOrThrow()
  const { dark, children } = props

  const [state, setState] = useState<"delaying" | "mounting" | "mounted" | "unmounting" | "unmounted">("delaying")

  useEffect(() => {
    setState("mounting")
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
   * Smoothly close the dialog
   */
  const hide = useCallback((force?: boolean) => {
    setState("unmounting")

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
    if (state === "mounting")
      flushSync(() => setState("mounted"))
    if (state === "unmounting")
      flushSync(() => setState("unmounted"))
    return
  }, [state])

  /**
   * Close when unmounted
   */
  useEffect(() => {
    if (state !== "unmounted")
      return
    close()
  }, [state, close])

  /**
   * Sync theme-color with dark mode
   */
  useLayoutEffect(() => {
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
  }, [dark])

  /**
   * Swipe down to close
   */
  const onScroll = useCallback((e: UIEvent) => {
    if (e.currentTarget.scrollTop > 0)
      return
    hide()
  }, [hide])

  const [content, setContent] = useState<Nullable<HTMLDivElement>>()

  /**
   * Smoothly scroll to the content to perfectly fit the screen
   */
  useEffect(() => {
    if (content == null)
      return

    const timeout = setTimeout(() => content.scrollIntoView({ behavior: "smooth" }))

    return () => clearTimeout(timeout)
  }, [content])

  if (state === "delaying")
    return null
  if (state === "unmounted")
    return null

  return <CloseContext value={hide}>
    <Portal>
      <div className="absolute inset-0 bg-backdrop data-[state=mounting]:animate-opacity-in data-[state=unmounting]:animate-opacity-out"
        data-state={state} />
      <div className="fixed inset-0 focus-visible:outline-none flex flex-col overflow-y-scroll overscroll-y-none light:scrollbar-light-[white] dark:scrollbar-dark-[black] [scrollbar-gutter:stable] data-[state=mounting]:animate-slideup-in data-[state=unmounting]:animate-opacity-out"
        data-state={state}
        data-theme={dark && "dark"}
        onAnimationEnd={onAnimationEnd}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        onScroll={onScroll}>
        <div className="basis-[100dvh] shrink-0" />
        <div className="flex flex-col bg-default text-default selection-default rounded-t-3xl shrink-0"
          onMouseDown={Events.stopPropagation}>
          <div className="flex items-center justify-center p-4">
            <div className="w-16 h-2 bg-backdrop rounded-full" />
          </div>
          <div className="basis-[100dvh] flex flex-col p-safe overflow-y-auto"
            ref={setContent}>
            <button type="button" autoFocus />
            {children}
          </div>
        </div>
      </div>
    </Portal>
  </CloseContext>
}