// deno-lint-ignore-file no-namespace

import { SyntheticEvent } from "react";

export namespace Events {

  export function isolate(e: SyntheticEvent<unknown>) {
    e.stopPropagation()
  }

  export function override(e: SyntheticEvent<unknown>) {
    e.preventDefault()
  }

  export function cancel(e: SyntheticEvent<unknown>) {
    e.preventDefault()
    e.stopPropagation()
  }

}