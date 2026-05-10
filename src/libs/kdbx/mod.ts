import * as KDBX from "@hazae41/kdbx";

export function getRecycleBinOrNull($file: KDBX.Inner.KeePassFile) {
  const $meta = $file.getMetaOrThrow()

  if (!$meta.getRecycleBinEnabledOrNull()?.get())
    return

  const uuid = $meta.getRecycleBinUuidOrThrow().getOrThrow()

  return $file.getRootOrThrow().getGroupByUuidOrThrow(uuid)
}

export function getEntryType($entry: KDBX.Inner.KeePassFile.Entry) {
  if ($entry.getStringByKeyOrNull("PublicKey")?.getValueOrThrow().get())
    return "keypair"

  if ($entry.getStringByKeyOrNull("SeedPhrase")?.getValueOrThrow().get())
    return "seed"

  if ($entry.getStringByKeyOrNull("CardNumber")?.getValueOrThrow().get())
    return "card"

  return "password"
}