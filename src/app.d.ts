// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
/// <reference types="@sveltejs/kit" />

// Define the FileSystemHandle and related types if not already present
// (These might vary slightly based on exact browser support)
interface FileSystemHandle {
  kind: "file" | "directory";
  name: string;
  isSameEntry?(other: FileSystemHandle): Promise<boolean>;
  queryPermission?(
    descriptor?: FileSystemHandlePermissionDescriptor,
  ): Promise<PermissionState>;
  requestPermission?(
    descriptor?: FileSystemHandlePermissionDescriptor,
  ): Promise<PermissionState>;
}

interface FileSystemFileHandle extends FileSystemHandle {
  kind: "file";
  getFile(): Promise<File>;
  createWritable(
    options?: FileSystemWritableFileStreamOptions,
  ): Promise<FileSystemWritableFileStream>;
}

interface FileSystemWritableFileStream extends WritableStream {
  write(data: any): Promise<void>;
  seek(position: number): Promise<void>;
  truncate(size: number): Promise<void>;
}

interface FileSystemHandlePermissionDescriptor {
  mode?: "read" | "readwrite";
}

interface FileSystemWritableFileStreamOptions {
  keepExistingData?: boolean;
}

interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: {
    description?: string;
    accept?: { [mimeType: string]: string[] };
  }[];
  excludeAcceptAllOption?: boolean;
}

declare global {
  namespace App {
    interface Error {} // Ensure this line is uncommented
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  interface Window {
    // Add the missing property definition
    showSaveFilePicker?(
      options?: SaveFilePickerOptions,
    ): Promise<FileSystemFileHandle>;
  }
}

export {};
