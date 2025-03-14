'use strict';

// src/data-transfer.ts
var getItemEntry = (item) => typeof item.getAsEntry === "function" ? item.getAsEntry() : typeof item.webkitGetAsEntry === "function" ? item.webkitGetAsEntry() : null;
var isDirectoryEntry = (entry) => entry.isDirectory;
var isFileEntry = (entry) => entry.isFile;
var addRelativePath = (file, path) => {
  Object.defineProperty(file, "relativePath", { value: path ? `${path}/${file.name}` : file.name });
  return file;
};
var getFileEntries = (items, traverseDirectories) => Promise.all(
  Array.from(items).filter((item) => item.kind === "file").map((item) => {
    const entry = getItemEntry(item);
    if (!entry) return null;
    if (isDirectoryEntry(entry) && traverseDirectories) {
      return getDirectoryFiles(entry.createReader(), `${entry.name}`);
    }
    if (isFileEntry(entry)) {
      return new Promise((resolve) => {
        entry.file((file) => {
          resolve(addRelativePath(file, ""));
        });
      });
    }
  }).filter((b) => b)
);
var getDirectoryFiles = (reader, path = "") => new Promise((resolve) => {
  const entryPromises = [];
  const readDirectoryEntries = () => {
    reader.readEntries((entries) => {
      if (entries.length === 0) {
        resolve(Promise.all(entryPromises).then((entries2) => entries2.flat()));
        return;
      }
      const promises = entries.map((entry) => {
        if (!entry) return null;
        if (isDirectoryEntry(entry)) {
          return getDirectoryFiles(entry.createReader(), `${path}${entry.name}`);
        }
        if (isFileEntry(entry)) {
          return new Promise((resolve2) => {
            entry.file((file) => {
              resolve2(addRelativePath(file, path));
            });
          });
        }
      }).filter((b) => b);
      entryPromises.push(Promise.all(promises));
      readDirectoryEntries();
    });
  };
  readDirectoryEntries();
});

// src/data-url-to-blob.ts
function dataURItoBlob(uri) {
  const binary = atob(uri.split(",")[1]);
  const mimeString = uri.split(",")[0].split(":")[1].split(";")[0];
  const buffer = new ArrayBuffer(binary.length);
  const intArray = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    intArray[i] = binary.charCodeAt(i);
  }
  return new Blob([buffer], { type: mimeString });
}

// src/download-file.ts
function isMSEdge(win) {
  return Boolean(win.navigator && win.navigator.msSaveOrOpenBlob);
}
function downloadFile(options) {
  const { file, win, type, name } = options;
  const doc = win.document;
  const obj = typeof file === "string" ? new Blob([file], { type }) : file;
  const fileName = typeof file === "string" ? name : file instanceof File ? file.name : void 0;
  if (isMSEdge(win)) {
    win.navigator.msSaveOrOpenBlob(obj, fileName || "file-download");
    return;
  }
  const url = win.URL.createObjectURL(obj);
  const anchor = doc.createElement("a");
  anchor.style.display = "none";
  anchor.href = url;
  anchor.rel = "noopener";
  anchor.download = fileName || "file-download";
  doc.documentElement.appendChild(anchor);
  anchor.click();
  setTimeout(() => {
    win.URL.revokeObjectURL(url);
    anchor.remove();
  }, 0);
}

// src/get-accept-attr.ts
function isMIMEType(v) {
  return v === "audio/*" || v === "video/*" || v === "image/*" || v === "text/*" || /\w+\/[-+.\w]+/g.test(v);
}
function isExt(v) {
  return /^.*\.[\w]+$/.test(v);
}
var isValidMIME = (v) => isMIMEType(v) || isExt(v);
function getAcceptAttrString(accept) {
  if (accept == null) return;
  if (typeof accept === "string") {
    return accept;
  }
  if (Array.isArray(accept)) {
    return accept.filter(isValidMIME).join(",");
  }
  return Object.entries(accept).reduce((a, [mimeType, ext]) => [...a, mimeType, ...ext], []).filter(isValidMIME).join(",");
}

// src/get-file-data-url.ts
var getFileDataUrl = async (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new Error("There was an error reading a file"));
    };
    reader.onloadend = () => {
      const { result } = reader;
      if (result instanceof ArrayBuffer) {
        reject(new Error("Expected DataURL as string from Blob/File, got ArrayBuffer"));
      } else {
        resolve(result || void 0);
      }
    };
    reader.readAsDataURL(file);
  });
};

// src/get-total-file-size.ts
var getTotalFileSize = (files) => {
  return files.reduce((acc, file) => acc + file.size, 0);
};

// src/is-file-equal.ts
var isFileEqual = (file1, file2) => {
  return file1.name === file2.name && file1.size === file2.size && file1.type === file2.type;
};

// src/is-valid-file-size.ts
var isDefined = (v) => v !== void 0 && v !== null;
function isValidFileSize(file, minSize, maxSize) {
  if (isDefined(file.size)) {
    if (isDefined(minSize) && isDefined(maxSize)) {
      if (file.size > maxSize) return [false, "FILE_TOO_LARGE"];
      if (file.size < minSize) return [false, "FILE_TOO_SMALL"];
    } else if (isDefined(minSize) && file.size < minSize) {
      return [false, "FILE_TOO_SMALL"];
    } else if (isDefined(maxSize) && file.size > maxSize) {
      return [false, "FILE_TOO_LARGE"];
    }
  }
  return [true, null];
}

// src/is-valid-file-type.ts
function isFileAccepted(file, accept) {
  if (file && accept) {
    const types = Array.isArray(accept) ? accept : typeof accept === "string" ? accept.split(",") : [];
    if (types.length === 0) return true;
    const fileName = file.name || "";
    const mimeType = (file.type || "").toLowerCase();
    const baseMimeType = mimeType.replace(/\/.*$/, "");
    return types.some((type) => {
      const validType = type.trim().toLowerCase();
      if (validType.charAt(0) === ".") {
        return fileName.toLowerCase().endsWith(validType);
      }
      if (validType.endsWith("/*")) {
        return baseMimeType === validType.replace(/\/.*$/, "");
      }
      return mimeType === validType;
    });
  }
  return true;
}
function isValidFileType(file, accept) {
  const isAcceptable = file.type === "application/x-moz-file" || isFileAccepted(file, accept);
  return [isAcceptable, isAcceptable ? null : "FILE_INVALID_TYPE"];
}

exports.dataURItoBlob = dataURItoBlob;
exports.downloadFile = downloadFile;
exports.getAcceptAttrString = getAcceptAttrString;
exports.getFileDataUrl = getFileDataUrl;
exports.getFileEntries = getFileEntries;
exports.getTotalFileSize = getTotalFileSize;
exports.isFileEqual = isFileEqual;
exports.isMSEdge = isMSEdge;
exports.isValidFileSize = isValidFileSize;
exports.isValidFileType = isValidFileType;
