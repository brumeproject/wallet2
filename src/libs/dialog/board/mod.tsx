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

  const [state, setState] = useState<"delaying" | "rendering" | "mounting" | "mounted" | "unmounting" | "unmounted">("delaying")

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

      flushSync(() => setState("mounting"))
    }, { timeout: 100 })
  }, [x, y])

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
    if (innerWidth > 768)
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
    if (content == null)
      return
    if (innerWidth > 768)
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
      <div className="absolute inset-0 bg-backdrop data-[state=rendering]:opacity-0 data-[state=mounting]:animate-opacity-in data-[state=unmounting]:animate-opacity-out"
        data-state={state} />
      <div className="fixed inset-0 flex flex-col md:p-safe focus-visible:outline-none overflow-y-scroll md:overflow-y-hidden data-[state=mounted]:md:overflow-y-scroll overscroll-y-none not-md:light:scrollbar-light-[white] not-md:dark:scrollbar-dark-[black] [scrollbar-gutter:stable] data-[state=rendering]:opacity-0 data-[state=mounting]:not-md:animate-slideup-in data-[state=mounting]:md:animate-scale-xywh-in data-[state=unmounting]:not-md:animate-opacity-out data-[state=unmounting]:md:animate-scale-xywh-out"
        data-state={state}
        data-theme={dark && "dark"}
        onAnimationEnd={onAnimationEnd}
        onMouseDown={onMouseDown}
        onKeyDown={onKeyDown}
        onScroll={onScroll}
        ref={onDialog}>
        <div className="not-md:basis-[100dvh] md:basis-[10dvh] md:grow shrink-0" />
        <div className="flex flex-col text-default bg-default selection-default md:w-full md:m-auto md:max-w-3xl not-md:rounded-t-3xl md:rounded-3xl overflow-clip shrink-0"
          onMouseDown={Events.stopPropagation}>
          <div className="flex md:hidden items-center justify-center p-4">
            <div className="w-16 h-2 bg-backdrop rounded-full" />
          </div>
          <div className="not-md:basis-[100dvh] flex flex-col not-md:p-safe"
            ref={setContent}>
            <button type="button" autoFocus />
            {children}
          </div>
        </div>
        <div className="md:basis-[10dvh] md:grow shrink-0" />
      </div>
    </Portal>
  </CloseContext>
}