// deno-lint-ignore-file no-unused-vars

/// <reference lib="dom"/>

import { Events } from "@/libs/events/mod.ts"
import { Nullable } from "@/libs/nullable/mod.ts"
import { Portal } from "@/libs/portal/mod.tsx"
import { ChildrenProps, DarkProps } from "@/libs/props/mod.ts"
import { usePathContext } from "@hazae41/chemin"
import { CloseContext, useCloseContext } from "@hazae41/react-close-context"
import React, { KeyboardEvent, MouseEvent, UIEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"

React;

export function PathBoard(props: ChildrenProps & DarkProps) {
  const { children, dark } = props

  const path = usePathContext().getOrThrow()

  const x = Number(path.url.searchParams.get("x"))
  const y = Number(path.url.searchParams.get("y"))

  return <Board x={x} y={y}
    dark={dark}>
    {children}
  </Board>
}

/**
 * Dialog that depends on screen size
 * @param props 
 * @returns 
 */
export function Board(props: ChildrenProps & DarkProps & { x: number, y: number }) {
  const close = useCloseContext().getOrThrow()
  const { dark, children, x, y } = props

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

      dialog.style.setProperty("--x", `${x}px`)
      dialog.style.setProperty("--y", `${y}px`)

      dialog.style.setProperty("--w", `${w}px`)
      dialog.style.setProperty("--h", `${h}px`)

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
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)

    if (innerWidth > 40 * rem)
      return
    if (e.currentTarget.scrollTop > 0)
      return

    hide()
  }, [hide])

  const [content, setContent] = useState<Nullable<HTMLDivElement>>()

  /**
   * Smoothly scroll to the content to perfectly fit the screen
   */
  useEffect(() => {
    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)

    if (content == null)
      return
    if (innerWidth > 40 * rem)
      return

    const timeout = setTimeout(() => content.scrollIntoView({ behavior: "smooth" }))

    return () => clearTimeout(timeout)
  }, [content])

  if (state === "delayed")
    return null
  if (state === "closed")
    return null

  return <CloseContext value={hide}>
    <Portal>
      <div className="absolute inset-0 bg-backdrop data-[state=rendering]:opacity-0 data-[state=opening]:animate-opacity-in data-[state=closing]:animate-opacity-out"
        data-state={state} />
      <div className="fixed inset-0 flex flex-col *:shrink-0 sm:p-6 focus-visible:outline-none overflow-y-scroll sm:overflow-y-hidden data-[state=opened]:sm:overflow-y-scroll overscroll-y-none not-sm:light:scrollbar-light-[white] not-sm:dark:scrollbar-dark-[black] [scrollbar-gutter:stable] data-[state=rendering]:opacity-0 data-[state=opening]:not-sm:animate-slideup-in data-[state=opening]:sm:animate-scale-xywh-in data-[state=closing]:not-sm:animate-opacity-out data-[state=closing]:sm:animate-scale-xywh-out"
        data-state={state}
        data-theme={dark && "dark"}
        onAnimationEnd={onAnimationEnd}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        ref={onDialog}>
        <div className="not-sm:basis-[100dvh] sm:basis-[10dvh] sm:grow" />
        <div className="flex flex-col text-default bg-default selection-default sm:w-full sm:m-auto sm:max-w-3xl not-sm:rounded-t-3xl sm:rounded-3xl overflow-clip"
          onMouseDown={Events.stopPropagation}>
          <div className="flex sm:hidden items-center justify-center p-4">
            <div className="w-16 h-2 bg-backdrop rounded-full" />
          </div>
          <div className="not-sm:basis-[100dvh] flex flex-col not-sm:p-safe"
            ref={setContent}>
            <button type="button" autoFocus />
            {children}
          </div>
        </div>
        <div className="sm:basis-[10dvh] sm:grow" />
      </div>
    </Portal>
  </CloseContext>
}