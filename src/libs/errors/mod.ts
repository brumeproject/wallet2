// deno-lint-ignore-file no-namespace

export namespace Errors {

  export function display(error: unknown) {
    console.error(error)

    if (error instanceof Error)
      return alert(`An error occured: ${error.message}`)

    alert("An unknown error occured")
  }

}