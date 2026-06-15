# File Transfer QA Checklist

This checklist outlines the quality assurance steps for the RemoteDesk file transfer feature.

## Functional Tests

- [ ] Verify file transfer is disabled by default on both host and viewer.
- [ ] Verify host can initiate a file transfer request.
- [ ] Verify viewer receives file transfer request with correct file metadata (name, size, type).
- [ ] Verify viewer can accept an incoming file transfer.
- [ ] Verify viewer can reject an incoming file transfer.
- [ ] Verify file transfer only proceeds when receiver explicitly accepts.
- [ ] Verify transferred file integrity (checksum verification, if implemented).
- [ ] Verify progress bar accurately reflects transfer progress.
- [ ] Verify transfer speed and ETA are displayed and updated correctly.
- [ ] Verify user can cancel an ongoing transfer (both sender and receiver).
- [ ] Verify user can pause and resume an ongoing transfer (both sender and receiver).
- [ ] Verify multiple concurrent file transfers are handled correctly (up to `MAX_CONCURRENT_FILE_TRANSFERS`).
- [ ] Verify file transfer history is maintained (if implemented).
- [ ] Verify transferred files are saved to the location chosen by the receiver.
- [ ] Verify file transfer UI components (FileTransferPanel, IncomingFileConsentDialog, TransferRow, TransferProgressBar, FileDropZone, FilePickerButton, TransferErrorBanner) function as expected.

## Security Tests

- [ ] Attempt to send files exceeding `MAX_FILE_SIZE_BYTES` (should be rejected).
- [ ] Attempt path traversal attacks in filenames (e.g., `../secret.txt`, `..\..\windows\system32\evil.dll`).
- [ ] Attempt to use Windows reserved names as filenames (e.g., `CON.txt`, `NUL.jpg`).
- [ ] Attempt to send files with excessively long filenames.
- [ ] Verify renderer process cannot directly access the file system for read/write operations.
- [ ] Verify all file operations are mediated via Electron main process using token-based access.
- [ ] Verify no arbitrary file writes are possible; files are only written to user-approved save locations.
- [ ] Verify file content is not modified during transfer (if checksums are implemented).
- [ ] Verify error handling for corrupted file chunks.
- [ ] Verify sensitive data is not logged unnecessarily during file transfer operations.

## Performance Tests

- [ ] Measure transfer speed for small files (e.g., 1KB, 100KB).
- [ ] Measure transfer speed for medium files (e.g., 1MB, 10MB).
- [ ] Measure transfer speed for large files (e.g., 50MB, 100MB).
- [ ] Monitor CPU/memory usage during active file transfers.
- [ ] Verify application remains responsive during file transfers.

## Edge Cases & Error Handling

- [ ] Verify behavior when network connection is lost during transfer.
- [ ] Verify behavior when one peer disconnects during transfer.
- [ ] Verify behavior when disk space is insufficient at the receiver.
- [ ] Verify behavior when file permissions prevent saving at the chosen location.
- [ ] Verify error messages are user-friendly and informative.
- [ ] Verify behavior when a file is deleted or moved on the sender's side after selection but before transfer.
- [ ] Verify behavior when a file is corrupted on the sender's side.
