export namespace ed25519 {

  export async function publish(keyraw: Uint8Array<ArrayBuffer>) {
    const asn = new Uint8Array([48, 46, 2, 1, 0, 48, 5, 6, 3, 43, 101, 112, 4, 34, 4, 32])

    const keyasn = new Uint8Array(asn.length + keyraw.length)
    keyasn.set(asn, 0)
    keyasn.set(keyraw, asn.length)

    const keyref = await crypto.subtle.importKey("pkcs8", keyasn, { name: "Ed25519" }, true, ["sign"])
    const keyjwk = await crypto.subtle.exportKey("jwk", keyref)

    delete keyjwk.d
    delete keyjwk.key_ops

    const pubref = await crypto.subtle.importKey("jwk", keyjwk, { name: "Ed25519" }, true, ["verify"])
    const pubraw = new Uint8Array(await crypto.subtle.exportKey("raw", pubref))

    return pubraw
  }

  export async function sign(keyraw: Uint8Array<ArrayBuffer>, msgraw: Uint8Array<ArrayBuffer>) {
    const asn = new Uint8Array([48, 46, 2, 1, 0, 48, 5, 6, 3, 43, 101, 112, 4, 34, 4, 32])

    const keyasn = new Uint8Array(asn.length + keyraw.length)
    keyasn.set(asn, 0)
    keyasn.set(keyraw, asn.length)

    const keyref = await crypto.subtle.importKey("pkcs8", keyasn, { name: "Ed25519" }, true, ["sign"])
    const sigraw = new Uint8Array(await crypto.subtle.sign("Ed25519", keyref, msgraw))

    return sigraw
  }

}