interface FileSystemHandlePermissionDescriptor {
  readonly mode?: "read" | "readwrite"
}

interface FileSystemHandle {
  queryPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>
  requestPermission(descriptor?: FileSystemHandlePermissionDescriptor): Promise<PermissionState>
}

interface DataTransferItem {
  getAsFileSystemHandle?(): Promise<FileSystemFileHandle | FileSystemDirectoryHandle>
}

interface Window {

  showOpenFilePicker?(options?: {
    readonly excludeAcceptAllOption?: boolean,
    readonly id?: string,
    readonly multiple?: boolean,
    readonly startIn?: FileSystemHandle | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos",
    readonly types?: Array<{ readonly description?: string, readonly accept: { readonly [key: string]: Array<string> } }>
  }): Promise<Array<FileSystemFileHandle>>

  showSaveFilePicker?(options?: {
    readonly excludeAcceptAllOption?: boolean,
    readonly id?: string,
    readonly startIn?: FileSystemHandle | "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos",
    readonly suggestedName?: string
    readonly types?: Array<{ readonly description?: string, readonly accept: { readonly [key: string]: Array<string> } }>
  }): Promise<FileSystemFileHandle>

}