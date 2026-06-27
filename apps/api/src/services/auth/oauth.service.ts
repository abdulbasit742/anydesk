import { prisma } from "../../lib/prisma.js";
export const oauthService = {
  async initiateGoogleAuth(redirectUri: string) {
    const state = crypto.randomUUID();
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&state=${state}`;
    return { url, state };
  },
  async handleGoogleCallback(code: string) {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET, grant_type: "authorization_code" }),
    });
    const tokens = await tokenResponse.json();
    const userInfo = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } });
    return userInfo.json();
  },
  async initiateMicrosoftAuth(redirectUri: string) {
    const state = crypto.randomUUID();
    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.MICROSOFT_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=openid%20email%20profile&state=${state}`;
    return { url, state };
  },
  async initiateGithubAuth(redirectUri: string) {
    const state = crypto.randomUUID();
    const url = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email&state=${state}`;
    return { url, state };
  },
  async linkSSOProvider(userId: string, provider: string, providerUserId: string, email: string) {
    return prisma.user.update({ where: { id: userId }, data: { ssoProvider: provider, ssoId: providerUserId } });
  },
};
