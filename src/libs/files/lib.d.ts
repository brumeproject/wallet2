declare function showOpenFilePicker(options?: {
  readonly id: string
}): Promise<Array<FileSystemHandle>>