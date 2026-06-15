# Windows Code Signing Guide

This guide details the process of code signing for RemoteDesk applications and installers on Windows.

## Importance of Code Signing
Code signing is crucial for:
- **Authenticity**: Verifies that the software originates from a trusted publisher (RemoteDesk).
- **Integrity**: Ensures that the software has not been tampered with since it was signed.
- **Trust**: Helps Windows SmartScreen and antivirus programs trust the application, reducing security warnings and improving user experience.

## Prerequisites
- **Code Signing Certificate**: An Authenticode certificate issued by a trusted Certificate Authority (CA).
- **Private Key**: Associated with the certificate, used for signing.
- **Signtool.exe**: Microsoft's code signing tool, part of the Windows SDK.

## Signing Process
1. **Install Windows SDK**: Ensure `signtool.exe` is available on your build machine.
2. **Access Certificate**: Make sure your code signing certificate and private key are accessible (e.g., in the Windows Certificate Store or a PFX file).
3. **Sign Executables**: Use `signtool.exe` to sign the main application executable (`RemoteDesk.exe`), the installer (`RemoteDeskSetup.exe`), and any other executable components.

```bash
signtool sign /f "path\to\your\certificate.pfx" /p YourPassword /t http://timestamp.digicert.com /fd sha256 "path\to\RemoteDesk.exe"
signtool sign /f "path\to\your\certificate.pfx" /p YourPassword /t http://timestamp.digicert.com /fd sha256 "path\to\RemoteDeskSetup.exe"
```

- `/f`: Specifies the PFX certificate file.
- `/p`: Specifies the password for the PFX file.
- `/t`: Specifies a timestamp server URL. This is important for ensuring the signature remains valid even after the certificate expires.
- `/fd`: Specifies the file digest algorithm (SHA256 is recommended).

## Best Practices
- **Automate Signing**: Integrate code signing into your CI/CD pipeline to ensure all releases are signed automatically.
- **Secure Private Key**: Protect your private key with strong passwords and restrict access to authorized personnel only.
- **Timestamping**: Always use a timestamp server to ensure long-term validity of your signatures.
- **Dual Signing**: Consider dual signing with both SHA1 and SHA256 for compatibility with older Windows versions, though SHA256 is now standard.

## Verification
After signing, verify the signature using `signtool.exe`:

```bash
signtool verify /pa "path\to\RemoteDesk.exe"
```

Or by checking the file properties in Windows Explorer (Digital Signatures tab).
