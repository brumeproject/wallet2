// deno-lint-ignore-file no-namespace

export namespace Errors {

  export function display(error: unknown) {
    console.error(error)

    if (error instanceof Error === false)
      return alert("An unknown error occured")

    if (!error.message.length)
      return alert("An unknown error occured")

    alert(`An error occured: ${error.message}`)
  }

}