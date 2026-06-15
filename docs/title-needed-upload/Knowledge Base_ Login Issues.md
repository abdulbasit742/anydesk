# Knowledge Base: Login Issues

This article provides troubleshooting steps for common problems encountered during the login process for RemoteDesk. It is intended for both support agents and end-users to quickly diagnose and resolve authentication problems.

## 1. Unable to Log In (Incorrect Credentials)

**Symptom:** User enters their email and password but receives an "Incorrect email or password" error.

**Potential Causes and Solutions:**

*   **Typographical Errors:** The most common cause is a typo in the email address or password.
    *   *Solution:* Advise the user to carefully re-enter their credentials, paying attention to capitalization (passwords are case-sensitive) and special characters. Ensure no extra spaces are present.
*   **Caps Lock On:** The Caps Lock key might be accidentally enabled.
    *   *Solution:* Ask the user to check their Caps Lock status.
*   **Incorrect Email Address:** The user might be trying to log in with an email address not registered with RemoteDesk or a different one than they usually use.
    *   *Solution:* Confirm the email address associated with their RemoteDesk account. Suggest checking alternative email addresses.
*   **Account Not Activated:** The user might have registered but not yet activated their account via email confirmation.
    *   *Solution:* Advise the user to check their inbox (and spam folder) for a verification email and complete the activation process.

## 2. Forgot Password / Password Reset Issues

**Symptom:** User initiates a password reset, but does not receive the reset email or the reset link doesn't work.

**Potential Causes and Solutions:**

*   **Email in Spam/Junk Folder:** The password reset email might have been filtered by their email provider.
    *   *Solution:* Advise the user to check their spam, junk, or promotions folders. Ask them to add RemoteDesk to their safe sender list.
*   **Incorrect Email Address for Reset:** The user might be requesting a reset for an email address not associated with an account.
    *   *Solution:* Confirm the email address they are using for the password reset request is the one registered with RemoteDesk.
*   **Expired Reset Link:** Password reset links are time-sensitive and expire after a certain period (e.g., 1 hour).
    *   *Solution:* If the link is old, advise the user to request a new password reset link.
*   **Browser/Cache Issues:** Browser extensions or cached data can sometimes interfere with the password reset process.
    *   *Solution:* Advise the user to try the password reset process in an incognito window or a different browser. Clear browser cache and cookies.

## 3. Multi-Factor Authentication (MFA) Issues

**Symptom:** User is prompted for an MFA code but it's not working or they are not receiving it.

**Potential Causes and Solutions:**

*   **Incorrect MFA Code:** The user might be entering an old or incorrect code from their authenticator app.
    *   *Solution:* Advise the user to ensure their authenticator app is synchronized correctly (time-based codes rely on accurate time) and to enter the most current code.
*   **Authenticator App Sync Issues:** The time on the user's device running the authenticator app might be out of sync.
    *   *Solution:* Guide the user to synchronize the time on their authenticator device (usually found in the app's settings).
*   **Backup Codes:** If the user has lost access to their primary MFA device, they should use a backup code.
    *   *Solution:* Remind the user about backup codes and how to use them. Advise them to generate new backup codes once they regain access or set up a new MFA device.
*   **Recovery Options:** If all else fails, the user might need to go through an account recovery process.
    *   *Solution:* Guide the user through the account recovery process, which may involve identity verification.

## 4. Session Timeout / Automatic Logout

**Symptom:** User is unexpectedly logged out of their RemoteDesk session.

**Potential Causes and Solutions:**

*   **Idle Timeout:** For security reasons, sessions automatically log out after a period of inactivity.
    *   *Solution:* Explain that this is a security feature. Users can simply log back in. Administrators can adjust idle timeout settings in the admin panel.
*   **Browser/Device Issues:** Browser crashes, closing the browser, or device sleep can terminate sessions.
    *   *Solution:* Advise users to ensure their browser is stable and their device settings don't prematurely close applications.
*   **Network Changes:** Switching networks (e.g., from Wi-Fi to mobile data) can sometimes invalidate sessions.
    *   *Solution:* This is expected behavior for some session management systems. Users will need to log in again.

## Diagnostic Information Required for Support

If the issue persists, please gather the following information:

1.  **User Email/Account ID:** The email address or account ID experiencing the login issue.
2.  **Date/Time of Issue:** When the login issue occurred or was first noticed.
3.  **Specific Error Message:** Any exact error messages displayed on the screen.
4.  **Browser/OS:** The browser and operating system being used.
5.  **Steps Taken:** What steps the user has already tried (e.g., clearing cache, trying different browser).
6.  **Application Logs:** If possible, export the application logs (refer to `support-diagnostics-guide.md`).
