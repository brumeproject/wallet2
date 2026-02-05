import * as KDBX from "@hazae41/kdbx";

export function getEntryType($entry: KDBX.Inner.KeePassFile.Entry) {
  if ($entry.getDirectStringByKeyOrNull("CardNumber")?.getValueOrThrow().get())
    return "card"

  if ($entry.getDirectStringByKeyOrNull("EthereumAddress")?.getValueOrThrow().get())
    return "ethereum"

  if ($entry.getDirectStringByKeyOrNull("SolanaAddress")?.getValueOrThrow().get())
    return "solana"

  if ($entry.getDirectStringByKeyOrNull("BitcoinAddress")?.getValueOrThrow().get())
    return "bitcoin"

  if ($entry.getDirectStringByKeyOrNull("MoneroAddress")?.getValueOrThrow().get())
    return "monero"

  if ($entry.getDirectStringByKeyOrNull("SeedPhrase")?.getValueOrThrow().get())
    return "seed"

  if ($entry.getDirectStringByKeyOrNull("SshPublicKey")?.getValueOrThrow().get())
    return "ssh"

  return "password"
}

export function getEntryFilter($entry: KDBX.Inner.KeePassFile.Entry) {
  const type = getEntryType($entry)

  if (type === "card")
    return "card"

  if (type === "ethereum")
    return "crypto"

  if (type === "solana")
    return "crypto"

  if (type === "bitcoin")
    return "crypto"

  if (type === "monero")
    return "crypto"

  if (type === "seed")
    return "seed"

  if (type === "ssh")
    return "ssh"

  return "password"
}

export function getEntryColor($entry: KDBX.Inner.KeePassFile.Entry) {
  return $entry.getDirectStringByKeyOrNull("Color")?.getValueOrThrow().get()
}

export function getEntryTitle($entry: KDBX.Inner.KeePassFile.Entry) {
  return $entry.getDirectStringByKeyOrNull("Title")?.getValueOrThrow().get()
}