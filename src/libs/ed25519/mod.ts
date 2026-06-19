import { Cursor } from "@hazae41/cursor";

export namespace ed25519 {

  export async function publish(keyraw: Uint8Array<ArrayBuffer>) {
    const asn = new Uint8Array([48, 46, 2, 1, 0, 48, 5, 6, 3, 43, 101, 112, 4, 34, 4, 32])

    const $keyasn = new Cursor(new Uint8Array(asn.length + keyraw.length))
    $keyasn.write(asn)
    $keyasn.write(keyraw)

    const keyref = await crypto.subtle.importKey("pkcs8", $keyasn.bytes, "Ed25519", true, ["sign"])
    const keyjwk = await crypto.subtle.exportKey("jwk", keyref)

    delete keyjwk.d
    delete keyjwk.key_ops

    const pubref = await crypto.subtle.importKey("jwk", keyjwk, "Ed25519", true, ["verify"])
    const pubraw = new Uint8Array(await crypto.subtle.exportKey("raw", pubref))

    return pubraw
  }

  export async function sign(keyraw: Uint8Array<ArrayBuffer>, msgraw: Uint8Array<ArrayBuffer>) {
    const asn = new Uint8Array([48, 46, 2, 1, 0, 48, 5, 6, 3, 43, 101, 112, 4, 34, 4, 32])

    const $keyasn = new Cursor(new Uint8Array(asn.length + keyraw.length))
    $keyasn.write(asn)
    $keyasn.write(keyraw)

    const keyref = await crypto.subtle.importKey("pkcs8", $keyasn.bytes, "Ed25519", true, ["sign"])
    const sigraw = new Uint8Array(await crypto.subtle.sign("Ed25519", keyref, msgraw))

    return sigraw
  }

}