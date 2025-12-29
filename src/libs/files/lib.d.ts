declare function showOpenFilePicker(options?: {
  readonly excludeAcceptAllOption?: boolean,
  readonly id?: string,
  readonly multiple?: boolean,
  readonly startIn?: FileSystemHandle | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos",
  readonly types?: Array<{ readonly description?: string, readonly accept: { readonly [key: string]: Array<string> } }>
}): Promise<Array<FileSystemFileHandle>>

declare function showSaveFilePicker(options?: {
  readonly excludeAcceptAllOption?: boolean,
  readonly id?: string,
  readonly startIn?: FileSystemHandle | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos",
  readonly suggestedName?: string
  readonly types?: Array<{ readonly description?: string, readonly accept: { readonly [key: string]: Array<string> } }>
}): Promise<FileSystemFileHandle>

interface FileSystemHandle {
  readonly kind: "file" | "directory"
  readonly name: string
  isSameEntry(other: FileSystemHandle): Promise<boolean>
  queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>
  requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>
}

interface FileSystemHandlePermissionDescriptor {
  readonly mode?: "read" | "readwrite"
}