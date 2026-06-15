export const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024;
export const FILE_CHUNK_SIZE_BYTES = 64 * 1024;
export const MAX_CONCURRENT_FILE_TRANSFERS = 5;
export const MAX_FILENAME_LENGTH = 255;

export const WINDOWS_RESERVED_FILENAMES = new Set([
  "CON",
  "PRN",
  "AUX",
  "NUL",
  "COM1",
  "COM2",
  "COM3",
  "COM4",
  "COM5",
  "COM6",
  "COM7",
  "COM8",
  "COM9",
  "LPT1",
  "LPT2",
  "LPT3",
  "LPT4",
  "LPT5",
  "LPT6",
  "LPT7",
  "LPT8",
  "LPT9"
]);
