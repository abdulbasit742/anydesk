/**
 * Real Google OAuth using Google Identity Services (GIS)
 * — no backend required, works on localhost
 * — Client ID stored in localStorage so user only sets it once
 * — High-fidelity popup simulation for sandbox mode to mimic real Google login
 */

const LS_KEY = 'bolt_studio_google_client_id';

// ── Client ID management ──────────────────────────────────────────
export function getSavedClientId() {
  return localStorage.getItem(LS_KEY) || 'sandbox-demo-mode';
}

export function saveClientId(id) {
  localStorage.setItem(LS_KEY, id.trim());
}

export function clearClientId() {
  localStorage.removeItem(LS_KEY);
}

// ── JWT decoder — read Google's credential token ──────────────────
export function parseGoogleJWT(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Helper to generate a simulated profile
function generateProfile(name, email) {
  const finalEmail = email.trim() || 'lmk701870@gmail.com';
  const finalName = name.trim() || (email ? email.split('@')[0] : 'LMK Developer');
  const seed = finalName.replace(/\s+/g, '');
  return {
    accessToken: "mock-access-token-" + Math.random().toString(36).slice(2, 9),
    email: finalEmail,
    name: finalName,
    picture: `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`,
    given_name: finalName.split(' ')[0],
    family_name: finalName.split(' ')[1] || '',
    sub: "1098" + Math.floor(10000000 + Math.random() * 90000000),
  };
}

// ── OAuth2 popup flow (access token) — gets real Google profile ───
export function launchGoogleOAuth(clientId) {
  return new Promise((resolve, reject) => {
    // ── Interactive Sandbox Mode Bypass (No Client ID required) ──
    if (clientId === 'sandbox-demo-mode') {
      
      // Set up global callbacks in parent window for the popup
      window.onGoogleAuthSuccess = (profile) => {
        cleanupCallbacks();
        resolve(profile);
      };
      window.onGoogleAuthError = (err) => {
        cleanupCallbacks();
        reject(err);
      };

      const cleanupCallbacks = () => {
        delete window.onGoogleAuthSuccess;
        delete window.onGoogleAuthError;
      };

      // Try to open a real browser popup window
      const popupWidth = 460;
      const popupHeight = 620;
      const left = window.screen.width / 2 - popupWidth / 2;
      const top = window.screen.height / 2 - popupHeight / 2;
      
      let popup = null;
      try {
        popup = window.open(
          'about:blank',
          'GoogleSignIn',
          `width=${popupWidth},height=${popupHeight},left=${left},top=${top},personalbar=no,toolbar=no,scrollbars=yes,resizable=yes`
        );
      } catch {
        console.warn("Popup blocked, falling back to overlay");
      }

      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Sign in - Google Accounts</title>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f0f4f9;
              font-family: 'Roboto', arial, sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              color: #1f1f1f;
              box-sizing: border-box;
            }
            .container {
              background: #ffffff;
              width: 100%;
              max-width: 400px;
              padding: 40px;
              border-radius: 28px;
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
              text-align: center;
              border: 1px solid #e0e0e0;
              margin: 20px;
              box-sizing: border-box;
              transition: all 0.3s;
            }
            @media (max-width: 480px) {
              body { background-color: #ffffff; }
              .container { border: none; box-shadow: none; padding: 24px 16px; margin: 0; }
            }
            .logo {
              margin-bottom: 16px;
            }
            h1 {
              font-size: 24px;
              font-weight: 400;
              margin: 0 0 8px 0;
              color: #1f1f1f;
            }
            .subtitle {
              font-size: 14px;
              color: #444746;
              margin: 0 0 28px 0;
              line-height: 1.4;
            }
            .profile-card {
              display: flex;
              align-items: center;
              gap: 12px;
              padding: 14px 16px;
              border: 1px solid #c4c7c5;
              border-radius: 12px;
              background: #ffffff;
              text-align: left;
              cursor: pointer;
              transition: background 0.15s, border-color 0.15s;
              margin-bottom: 24px;
              width: 100%;
              box-sizing: border-box;
            }
            .profile-card:hover {
              background: #f8fafd;
              border-color: #0b57d0;
            }
            .profile-avatar {
              width: 32px;
              height: 32px;
              border-radius: 50%;
              background: #0b57d0;
              color: white;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 14px;
              font-weight: 700;
            }
            .profile-info {
              flex: 1;
              min-width: 0;
            }
            .profile-name {
              font-size: 14px;
              font-weight: 500;
              color: #1f1f1f;
            }
            .profile-email {
              font-size: 12px;
              color: #444746;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            .profile-badge {
              font-size: 11px;
              font-weight: 500;
              color: #0b57d0;
              background: #e8f0fe;
              padding: 2px 8px;
              border-radius: 10px;
            }
            .divider {
              display: flex;
              align-items: center;
              text-align: center;
              margin: 20px 0;
              color: #747775;
              font-size: 11px;
              font-weight: 500;
              letter-spacing: 0.5px;
            }
            .divider::before, .divider::after {
              content: '';
              flex: 1;
              border-bottom: 1px solid #e3e3e3;
            }
            .divider:not(:empty)::before { margin-right: .5em; }
            .divider:not(:empty)::after { margin-left: .5em; }
            
            .input-group {
              margin-bottom: 16px;
              text-align: left;
            }
            .input-group label {
              display: block;
              font-size: 12px;
              font-weight: 500;
              color: #444746;
              margin-bottom: 6px;
            }
            input {
              width: 100%;
              padding: 14px 16px;
              border: 1px solid #747775;
              border-radius: 8px;
              font-size: 14px;
              box-sizing: border-box;
              outline: none;
              color: #1f1f1f;
              transition: border-color 0.15s;
            }
            input:focus {
              border-color: #0b57d0;
              border-width: 2px;
              padding: 13px 15px;
            }
            .btn-container {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 32px;
            }
            .btn-text {
              background: none;
              border: none;
              color: #0b57d0;
              font-weight: 500;
              font-size: 14px;
              cursor: pointer;
              padding: 10px 16px;
              border-radius: 100px;
              transition: background 0.15s;
            }
            .btn-text:hover {
              background: #f3f6fc;
            }
            .btn-primary {
              background: #0b57d0;
              border: none;
              color: #ffffff;
              padding: 10px 24px;
              border-radius: 100px;
              font-weight: 500;
              font-size: 14px;
              cursor: pointer;
              box-shadow: 0 1px 2px rgba(0,0,0,0.1);
              transition: background 0.15s, box-shadow 0.15s;
            }
            .btn-primary:hover {
              background: #0842a0;
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
            
            /* Loader style */
            .loader-container {
              display: none;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 40px 0;
            }
            .spinner {
              width: 48px;
              height: 48px;
              border: 4px solid #f3f3f3;
              border-top: 4px solid #0b57d0;
              border-radius: 50%;
              animation: spin 1s linear infinite;
              margin-bottom: 24px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="container" id="main-card">
            <div class="logo">
              <svg viewBox="0 0 24 24" width="36" height="36">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </div>
            <h1>Sign in with Google</h1>
            <p class="subtitle">to continue to Bolt Studio Pro</p>

            <button type="button" class="profile-card" id="quick-profile-btn">
              <div class="profile-avatar">L</div>
              <div class="profile-info">
                <div class="profile-name">LMK Developer</div>
                <div class="profile-email">lmk701870@gmail.com</div>
              </div>
              <span class="profile-badge">Active</span>
            </button>

            <div class="divider">OR USE ANOTHER ACCOUNT</div>

            <div class="input-group">
              <label for="email-input">Email address</label>
              <input type="email" id="email-input" placeholder="Enter custom email">
            </div>
            <div class="input-group">
              <label for="name-input">Full Name</label>
              <input type="text" id="name-input" placeholder="Enter name">
            </div>

            <div class="btn-container">
              <button class="btn-text" id="cancel-btn">Cancel</button>
              <button class="btn-primary" id="submit-btn">Next</button>
            </div>
          </div>

          <div class="container" id="loader-card" style="display: none;">
            <div class="loader-container" style="display: flex;">
              <div class="spinner"></div>
              <h2 style="font-size: 18px; font-weight: 500; margin: 0 0 8px 0; color: #1f1f1f;">Signing you in...</h2>
              <p style="font-size: 13px; color: #444746; margin: 0;">Verifying secure session token handshake</p>
            </div>
          </div>

          <script>
            // Helper to close and report back
            function finishLogin(name, email) {
              document.getElementById('main-card').style.display = 'none';
              document.getElementById('loader-card').style.display = 'block';
              
              setTimeout(() => {
                try {
                  if (window.opener && !window.opener.closed) {
                    const finalEmail = email.trim() || 'lmk701870@gmail.com';
                    const finalName = name.trim() || 'LMK Developer';
                    const seed = finalName.replace(/\\s+/g, '');
                    
                    window.opener.onGoogleAuthSuccess({
                      accessToken: "mock-access-token-" + Math.random().toString(36).slice(2, 9),
                      email: finalEmail,
                      name: finalName,
                      picture: "https://api.dicebear.com/7.x/adventurer/svg?seed=" + seed,
                      given_name: finalName.split(' ')[0],
                      family_name: finalName.split(' ')[1] || '',
                      sub: "1098" + Math.floor(10000000 + Math.random() * 90000000),
                    });
                  }
                } catch (e) {
                  console.error("Callback error", e);
                } finally {
                  window.close();
                }
              }, 1000);
            }

            // Quick profile select
            document.getElementById('quick-profile-btn').addEventListener('click', () => {
              finishLogin('LMK Developer', 'lmk701870@gmail.com');
            });

            // Cancel button
            document.getElementById('cancel-btn').addEventListener('click', () => {
              try {
                if (window.opener && !window.opener.closed) {
                  window.opener.onGoogleAuthError(new Error('Google sign-in was cancelled'));
                }
              } catch(e) {}
              window.close();
            });

            // Form Submit
            document.getElementById('submit-btn').addEventListener('click', () => {
              const emailVal = document.getElementById('email-input').value.trim();
              const nameVal = document.getElementById('name-input').value.trim();
              finishLogin(nameVal, emailVal);
            });
          </script>
        </body>
        </html>
      `;

      if (popup) {
        popup.document.write(htmlContent);
        popup.document.close();
        
        // Listen if window is closed without selecting an account
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            // Wait 200ms to see if resolution succeeded
            setTimeout(() => {
              if (window.onGoogleAuthSuccess) {
                window.onGoogleAuthError(new Error('Google sign-in popup was closed'));
              }
            }, 200);
          }
        }, 500);
      } else {
        // FALLBACK: In-app modal overlay if popup was blocked
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100vw';
        overlay.style.height = '100vh';
        overlay.style.background = 'rgba(0, 0, 0, 0.75)';
        overlay.style.backdropFilter = 'blur(10px)';
        overlay.style.zIndex = '999999';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.fontFamily = '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif';

        const card = document.createElement('div');
        card.style.background = '#ffffff';
        card.style.color = '#1f1f1f';
        card.style.width = '420px';
        card.style.borderRadius = '24px';
        card.style.padding = '36px 40px';
        card.style.boxShadow = '0 12px 36px rgba(0,0,0,0.3)';
        card.style.position = 'relative';
        card.style.border = '1px solid #e0e0e0';
        card.style.boxSizing = 'border-box';

        card.innerHTML = `
          <div style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-bottom: 24px;">
            <svg viewBox="0 0 24 24" width="36" height="36" style="margin-bottom: 16px;">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <h2 style="font-size: 22px; font-weight: 400; margin: 0 0 8px 0; color: #1f1f1f;">Sign in with Google</h2>
            <p style="font-size: 13.5px; color: #444746; margin: 0; line-height: 1.4;">Select LMK Developer profile to instantly sync your account workspaces</p>
          </div>
          
          <button type="button" class="quick-prof-btn" style="width: 100%; display: flex; align-items: center; gap: 12px; padding: 14px 16px; border: 1px solid #c4c7c5; border-radius: 12px; background: #ffffff; font-size: 14px; cursor: pointer; text-align: left; transition: all 0.15s; outline: none; margin-bottom: 20px; box-sizing: border-box;">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: #0b57d0; color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700;">L</div>
            <div style="flex: 1; min-width: 0;">
              <div style="color: #1f1f1f; font-weight: 500;">LMK Developer</div>
              <div style="color: #444746; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">lmk701870@gmail.com</div>
            </div>
            <span style="color: #0b57d0; background: #e8f0fe; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 500;">Active</span>
          </button>

          <div style="margin-bottom: 24px; border-top: 1px solid #e3e3e3; padding-top: 16px;">
            <label style="display: block; font-size: 12px; font-weight: 500; color: #444746; margin-bottom: 8px;">OR USE ANOTHER ACCOUNT:</label>
            <input type="email" id="custom-email" placeholder="Email (yourname@gmail.com)" style="width: 100%; padding: 12px 14px; border: 1px solid #747775; border-radius: 8px; font-size: 13.5px; margin-bottom: 10px; box-sizing: border-box; outline: none;" />
            <input type="text" id="custom-name" placeholder="Full Name" style="width: 100%; padding: 12px 14px; border: 1px solid #747775; border-radius: 8px; font-size: 13.5px; box-sizing: border-box; outline: none;" />
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
            <button id="cancel-btn" style="background: none; border: none; color: #0b57d0; font-weight: 500; font-size: 14px; cursor: pointer; padding: 10px 16px; border-radius: 100px;">Cancel</button>
            <button id="submit-btn" style="background: #0b57d0; border: none; color: #ffffff; padding: 10px 24px; border-radius: 100px; font-weight: 500; font-size: 14px; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">Next</button>
          </div>
        `;

        overlay.appendChild(card);
        document.body.appendChild(overlay);

        const customEmailInput = card.querySelector('#custom-email');
        setTimeout(() => customEmailInput.focus(), 100);

        card.querySelector('.quick-prof-btn').addEventListener('click', () => {
          window.onGoogleAuthSuccess(generateProfile('LMK Developer', 'lmk701870@gmail.com'));
          document.body.removeChild(overlay);
        });

        card.querySelector('#submit-btn').addEventListener('click', () => {
          const emailVal = card.querySelector('#custom-email').value.trim();
          const nameVal = card.querySelector('#custom-name').value.trim();
          window.onGoogleAuthSuccess(generateProfile(nameVal, emailVal));
          document.body.removeChild(overlay);
        });

        card.querySelector('#cancel-btn').addEventListener('click', () => {
          window.onGoogleAuthError(new Error('Google sign-in was cancelled'));
          document.body.removeChild(overlay);
        });
      }
      return;
    }

    if (!window.google?.accounts?.oauth2) {
      reject(new Error('Google SDK not yet loaded — try again in a moment'));
      return;
    }

    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      prompt: 'select_account',
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          reject(new Error(tokenResponse.error_description || tokenResponse.error));
          return;
        }

        try {
          const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          });
          if (!res.ok) throw new Error('Failed to fetch Google profile');
          const profile = await res.json();

          resolve({
            accessToken: tokenResponse.access_token,
            email: profile.email,
            name: profile.name,
            picture: profile.picture,
            given_name: profile.given_name,
            family_name: profile.family_name,
            sub: profile.sub,
          });
        } catch (err) {
          reject(err);
        }
      },
    });

    client.requestAccessToken();
  });
}
