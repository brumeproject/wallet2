// deno-lint-ignore-file no-namespace

import { SyntheticEvent } from "react";

export namespace Events {

  export function stopPropagation(e: SyntheticEvent<unknown>) {
    e.stopPropagation()
  }

  export function preventDefault(e: SyntheticEvent<unknown>) {
    e.preventDefault()
  }

  export function preventDefaultAndStopPropagation(e: SyntheticEvent<unknown>) {
    e.preventDefault()
    e.stopPropagation()
  }

}