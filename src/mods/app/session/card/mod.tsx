import { InButton } from "@/libs/button/mod.tsx";
import { useCopy } from "@/libs/copy/mod.ts";
import { Outline } from "@/libs/heroicons/mod.ts";
import { getEntryTitle } from "@/libs/kdbx/mod.ts";
import { WideNakedMenuAnchor } from "@/libs/menu/mod.tsx";
import { useAnchorWithCoords, usePathContext } from "@hazae41/chemin";
import * as KDBX from "@hazae41/kdbx";
import React, { Fragment, useMemo, useState } from "react";
import { SessionAccountCard } from "../mod.tsx";

React;

export function SessionCardAccountWindow(props: { $entry: KDBX.Inner.KeePassFile.Entry }) {
  const { $entry } = props

  const [masked, setMasked] = useState(true)

  const num = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("CardNumber")?.getValueOrThrow().get()
  }, [$entry])

  const hol = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("CardHolder")?.getValueOrThrow().get()
  }, [$entry])

  const exp = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("ExpiryDate")?.getValueOrThrow().get()
  }, [$entry])

  const cvv = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("CVV")?.getValueOrThrow().get()
  }, [$entry])

  const pin = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("PIN")?.getValueOrThrow().get()
  }, [$entry])

  const notes = useMemo(() => {
    return $entry.getDirectStringByKeyOrNull("Notes")?.getValueOrThrow().get()
  }, [$entry])

  const copyTheNum = useCopy(num)
  const copyTheHol = useCopy(hol)
  const copyTheExp = useCopy(exp)
  const copyTheCvv = useCopy(cvv)
  const copyThePin = useCopy(pin)

  return <div className="flex flex-col grow p-6">
    <h1 className="text-xl font-medium">
      {getEntryTitle($entry) || "Untitled"}
    </h1>
    <div className="text-default-contrast">
      {$entry.getUuidOrThrow().getOrThrow().slice(0, 8).toUpperCase()}
    </div>
    <div className="h-6" />
    <div className="flex items-center justify-center">
      <SessionAccountCard $entry={$entry} />
    </div>
    <div className="grow" />
    {num && <Fragment>
      <div className="h-6" />
      <div className="font-medium">
        Number
      </div>
      <div className="text-default-contrast">
        Your card number
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <Outline.HashtagIcon className="size-5" />
        <input className="w-full focus-visible:outline-none"
          readOnly
          onFocus={e => e.currentTarget.select()}
          value={num} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
            type="button"
            onClick={copyTheNum.copyOrAlert}>
            <InButton>
              {copyTheNum.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            </InButton>
          </button>
        </div>
      </div>
    </Fragment>}
    {hol && <Fragment>
      <div className="h-6" />
      <div className="font-medium">
        Holder
      </div>
      <div className="text-default-contrast">
        Your card holder name
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <Outline.LanguageIcon className="size-5" />
        <input className="w-full focus-visible:outline-none"
          readOnly
          onFocus={e => e.currentTarget.select()}
          value={hol} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
            type="button"
            onClick={copyTheHol.copyOrAlert}>
            <InButton>
              {copyTheHol.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            </InButton>
          </button>
        </div>
      </div>
    </Fragment>}
    {exp && <Fragment>
      <div className="h-6" />
      <div className="font-medium">
        Expiry
      </div>
      <div className="text-default-contrast">
        Your card expiry date
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <Outline.CalendarIcon className="size-5" />
        <input className="w-full focus-visible:outline-none"
          readOnly
          onFocus={e => e.currentTarget.select()}
          value={exp} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
            type="button"
            onClick={copyTheExp.copyOrAlert}>
            <InButton>
              {copyTheExp.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            </InButton>
          </button>
        </div>
      </div>
    </Fragment>}
    {cvv && <Fragment>
      <div className="h-6" />
      <div className="font-medium">
        CVV
      </div>
      <div className="text-default-contrast">
        Your card verification value
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <Outline.CalendarIcon className="size-5" />
        <input className="w-full focus-visible:outline-none"
          readOnly
          type={masked ? "password" : "text"}
          onFocus={e => e.currentTarget.select()}
          value={cvv} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
            type="button"
            onClick={() => setMasked(!masked)}>
            <InButton>
              {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
            </InButton>
          </button>
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
            type="button"
            onClick={copyTheCvv.copyOrAlert}>
            <InButton>
              {copyTheCvv.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            </InButton>
          </button>
        </div>
      </div>
    </Fragment>}
    {pin && <Fragment>
      <div className="h-6" />
      <div className="font-medium">
        PIN
      </div>
      <div className="text-default-contrast">
        Your card personal identification number
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl flex items-center gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <Outline.CalendarIcon className="size-5" />
        <input className="w-full focus-visible:outline-none"
          readOnly
          type={masked ? "password" : "text"}
          onFocus={e => e.currentTarget.select()}
          value={pin} />
        <div className="flex items-center gap-2">
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
            type="button"
            onClick={() => setMasked(!masked)}>
            <InButton>
              {masked ? <Outline.EyeIcon className="size-5" /> : <Outline.EyeSlashIcon className="size-5" />}
            </InButton>
          </button>
          <button className="group rounded-full p-1 hover:bg-default-double-contrast focus-visible:bg-default-double-contrast focus-visible:outline-none transition-all"
            type="button"
            onClick={copyThePin.copyOrAlert}>
            <InButton>
              {copyThePin.copied ? <Outline.CheckIcon className="size-5" /> : <Outline.DocumentDuplicateIcon className="size-5" />}
            </InButton>
          </button>
        </div>
      </div>
    </Fragment>}
    {notes && <Fragment>
      <div className="h-6" />
      <div className="font-medium">
        Notes
      </div>
      <div className="text-default-contrast">
        Any additional information
      </div>
      <div className="h-4" />
      <div className="bg-default-contrast po-2 rounded-xl gap-4 [&:has(:focus-visible)]:outline-2 [&:has(:focus-visible)]:outline-offset-2 [&:has(:focus-visible)]:outline-default-contrast">
        <textarea className="w-full resize-none focus-visible:outline-none"
          readOnly
          rows={6}
          value={notes} />
      </div>
    </Fragment>}
  </div>
}

export function SessionCardAddAnchor() {
  const path = usePathContext().getOrThrow()

  const coords = useAnchorWithCoords(path, "/add/card")

  return <WideNakedMenuAnchor
    href={coords.url.hash}
    onClick={coords.onClick}
    onKeyDown={coords.onKeyDown}>
    Card
  </WideNakedMenuAnchor>
}