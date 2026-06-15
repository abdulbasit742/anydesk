# File Transfer Safety Guide

## Before Transferring Files

### Security Checklist
- [ ] Only transfer files with trusted connections
- [ ] Verify file types being transferred
- [ ] Scan files with antivirus (sender)
- [ ] Check file sizes (large files may be suspicious)
- [ ] Confirm recipient expects the files

### Blocked File Types
For security, the following cannot be transferred:
- .exe, .msi, .bat, .cmd (Windows executables)
- .sh, .bash (shell scripts)
- .app (macOS applications)
- .apk, .ipa (mobile apps)
- .jar (Java archives)

### Allowed File Types
- Documents: .pdf, .doc, .xls, .ppt, .txt
- Images: .jpg, .png, .gif, .svg
- Archives: .zip, .tar.gz (contents scanned)
- Media: .mp4, .mp3, .wav
- Code: .js, .ts, .py, .java (text only)

## During Transfer
- Progress indicator shows transfer status
- Encrypted in transit (TLS 1.3)
- Cancel anytime if suspicious
- Large files: may take time

## After Transfer
- Scan received files before opening
- Verify checksums if available
- Report suspicious files to security
- Delete temporary transfer files

## Enterprise DLP
Organizations may have Data Loss Prevention policies:
- Blocked paths (e.g., /etc, C:\Windows)\n- Allowed paths only
- File content scanning
- Transfer audit logging
