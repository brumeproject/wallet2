export namespace Ed25519 {

  export async function publish(sigraw: Uint8Array<ArrayBuffer>) {
    const asn = new Uint8Array([48, 46, 2, 1, 0, 48, 5, 6, 3, 43, 101, 112, 4, 34, 4, 32])

    const sigasn = new Uint8Array(asn.length + sigraw.length)
    sigasn.set(asn, 0)
    sigasn.set(sigraw, asn.length)

    const sigref = await crypto.subtle.importKey("pkcs8", sigasn, { name: "Ed25519" }, true, ["sign"])
    const sigjwk = await crypto.subtle.exportKey("jwk", sigref)

    delete sigjwk.d
    delete sigjwk.key_ops

    const pubref = await crypto.subtle.importKey("jwk", sigjwk, { name: "Ed25519" }, true, ["verify"])
    const pubraw = new Uint8Array(await crypto.subtle.exportKey("raw", pubref))

    return pubraw
  }

}