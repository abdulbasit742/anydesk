# Web Application Deployment Guide

This guide provides instructions for deploying the RemoteDesk web application (`apps/web`) to a production environment.

## Prerequisites

-   A hosting platform for Next.js applications (e.g., Vercel, Netlify, AWS Amplify, or a custom server).
-   Node.js (LTS version) and npm/yarn.
-   Git.

## Deployment Options

### 1. Vercel / Netlify Deployment

These platforms offer seamless deployment for Next.js applications.

1.  **Connect Repository:** Link your Git repository (GitHub, GitLab, Bitbucket) to your Vercel/Netlify project.
2.  **Configure Build Settings:**
    -   **Build Command:** `yarn build` or `npm run build`
    -   **Output Directory:** `out` (for static export) or leave default for server-side rendering.
3.  **Environment Variables:** Set `NEXT_PUBLIC_API_BASE_URL` to your production backend API URL in the platform's environment variable settings.
4.  **Deploy:** The platform will automatically build and deploy your application on every push to the configured branch.

### 2. Custom Server Deployment (e.g., AWS EC2, DigitalOcean Droplet)

1.  **Build the application:**
    Navigate to `remotedesk/apps/web` and run:
    ```bash
    yarn build
    # or npm run build
    ```
2.  **Transfer build artifacts:**
    Copy the `.next` directory and `public` directory to your server.
3.  **Install dependencies:**
    On your server, navigate to the deployment directory and install production dependencies:
    ```bash
    yarn install --production
    # or npm install --production
    ```
4.  **Environment Variables:**
    Set `NEXT_PUBLIC_API_BASE_URL` and any other necessary environment variables on your server.
5.  **Start the application:**
    ```bash
    pm2 start npm --name "remotedesk-web" -- start
    ```
    Ensure PM2 or a similar process manager is used to keep the application running.
6.  **Configure a reverse proxy:**
    Use Nginx or Apache to proxy requests to the Next.js application and handle SSL termination.

### 3. Static Export Deployment (for purely static sites)

If your web application does not require server-side rendering or an API route, you can export it as a static site.

1.  **Configure `next.config.js`:**
    Add `output: 'export'` to your `next.config.js`.
2.  **Build the static site:**
    ```bash
    yarn build
    # or npm run build
    ```
3.  **Deploy:**
    The `out` directory will contain the static assets. These can be deployed to any static hosting service (e.g., AWS S3 + CloudFront, GitHub Pages).

## Post-Deployment Steps

-   **Monitoring:** Monitor web application performance, load times, and error rates.
-   **CDN:** Ensure static assets are served efficiently via a CDN.
-   **SSL:** Verify SSL certificates are correctly configured.

## Troubleshooting

-   **Page not loading:** Check server logs, environment variables, and ensure the Next.js server is running.
-   **API calls failing:** Verify `NEXT_PUBLIC_API_BASE_URL` is correctly set and the backend API is accessible.
