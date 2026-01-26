import { binarize, Decoder, Detector, grayscale } from "@nuintun/qrcode";

export namespace QrCode {

  export async function decodeFileOrNull(file: File) {
    const bitmap = await createImageBitmap(file)

    const { width, height } = bitmap

    const canvas = new OffscreenCanvas(width, height)

    const context = canvas.getContext("2d")

    if (context == null)
      return

    context.drawImage(bitmap, 0, 0)

    const image = context.getImageData(0, 0, width, height)

    const detecteds = new Detector().detect(binarize(grayscale(image), width, height))

    for (let current = detecteds.next(); !current.done; current = detecteds.next()) {
      try {
        return new Decoder().decode(current.value.matrix).content
      } catch (e: unknown) {
        continue
      }
    }
  }

}