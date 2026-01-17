// deno-lint-ignore-file no-unused-vars

/// <reference lib="dom"/>

import { usePathContext } from "@hazae41/chemin"
import { CloseContext, useCloseContext } from "@hazae41/react-close-context"
import React, { AnimationEvent, KeyboardEvent, MouseEvent, UIEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { Events } from "../events/mod.ts"
import { Nullable } from "../nullable/mod.tsx"
import { ChildrenProps, DarkProps } from "../props/mod.ts"

React;

export function PathWindow(props: ChildrenProps & DarkProps) {
  const { children, dark } = props

  const path = usePathContext().getOrThrow()

  const x = Number(path.url.searchParams.get("x"))
  const y = Number(path.url.searchParams.get("y"))

  return <Window x={x} y={y}
    dark={dark}>
    {children}
  </Window>
}

/**
 * Dialog that depends on screen size
 * @param props 
 * @returns 
 */
export function Window(props: ChildrenProps & DarkProps & { x: number; y: number }) {
  const close = useCloseContext().getOrThrow()
  const { dark, children, x, y } = props

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

  const [dialog, setDialog] = useState<Nullable<HTMLDialogElement>>()

  /**
   * Compute position and size
   */
  useLayoutEffect(() => {
    if (dialog == null)
      return

    dialog.showModal()

    setW(dialog.offsetWidth)
    setH(dialog.offsetHeight)
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

  /**
   * Only unmount when transition is finished
   */
  if (!premount && !postmount)
    return null

  return <CloseContext value={hide}>
    <dialog className={`h-full w-full max-h-none max-w-none md:p-safe bg-transparent focus:outline-none flex flex-col overflow-y-scroll ${postmount && premount ? "" : "md:overflow-y-hidden"} overscroll-y-none scrollbar-default-opaque md:scrollbar-default-transparent [scrollbar-gutter:stable] [--x:${x}px] [--y:${y}px] [--w:${w}px] [--h:${h}px] ${premount ? "not-md:animate-slideup-in md:animate-scale-xywh-in" : "not-md:animate-slideup-out md:animate-scale-xywh-out"} backdrop:bg-backdrop ${premount ? "backdrop:animate-opacity-in" : "backdrop:animate-opacity-out"}`}
      data-theme={dark && "dark"}
      onAnimationEnd={onAnimationEnd}
      onMouseDown={onMouseDown}
      onKeyDown={onKeyDown}
      onScroll={onScroll}
      ref={setDialog}>
      <div className="not-md:basis-[100dvh] md:grow shrink-0" />
      <div className="flex flex-col text-default bg-default md:w-full md:m-auto md:max-w-3xl not-md:rounded-t-3xl md:rounded-3xl overflow-clip shrink-0"
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
      <div className="md:grow shrink-0" />
    </dialog>
  </CloseContext>
}