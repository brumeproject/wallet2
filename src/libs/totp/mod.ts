export class Sha1Totp {

  constructor(
    readonly secret: Uint8Array<ArrayBuffer>,
    readonly digits: number = 6,
    readonly period: number = 30,
  ) { }

  async generate() {
    const hmac = await crypto.subtle.importKey("raw", this.secret, { name: "HMAC", hash: "SHA-1" }, false, ["sign"])

    const time = BigInt(Date.now()) / (BigInt(this.period) * 1000n)

    const data = new DataView(new ArrayBuffer(8))

    data.setBigUint64(0, time, false)

    const digest = new Uint8Array(await crypto.subtle.sign("HMAC", hmac, data.buffer))

    const offset = digest[digest.length - 1] & 0x0f

    const code = 0
      | ((digest[offset + 0] & 0x7f) << 24)
      | ((digest[offset + 1] & 0xff) << 16)
      | ((digest[offset + 2] & 0xff) << 8)
      | ((digest[offset + 3] & 0xff) << 0)

    const pass = BigInt(code) % (10n ** BigInt(this.digits))

    return pass.toString().padStart(this.digits, "0")
  }

}