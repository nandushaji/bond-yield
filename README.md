# Bond Yield Calculator

This repository contains the source code for the Bond Yield Calculator application.

## Project Structure

- `byc-fe`: Frontend application (React + Vite + TypeScript)
- `byc-be`: Backend application (NestJS + TypeScript)
- `PRD.md`: Product Requirements Document

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm

### Running the Application

1.  **Backend**:
    ```bash
    cd byc-be
    npm install
    npm run start:dev
    ```

2.  **Frontend**:
    ```bash
    cd byc-fe
    npm install
    npm run dev
    ```

## Deployment (Render)

This project includes a `render.yaml` Blueprint for one-click deployment to [Render](https://render.com).

### Steps

1. Push your code to a GitHub repository.
2. Go to [Render Dashboard](https://dashboard.render.com) and click **New** > **Blueprint**.
3. Connect your GitHub repo and select the branch.
4. Render will detect `render.yaml` and create two services:
   - **byc-api** — NestJS backend (Web Service, free tier)
   - **byc-frontend** — React static site (Static Site, free tier)
5. The frontend's `VITE_API_URL` is automatically set to the backend's URL.
6. Click **Apply** and wait for both services to build and deploy.

> **Note:** On the free tier, the backend spins down after 15 minutes of inactivity. The first request after idle may take ~30 seconds.

### Environment Variables

| Service | Variable | Description |
|---------|----------|-------------|
| byc-api | `PORT` | HTTP port (default: 3000, set by Render) |
| byc-api | `NODE_ENV` | Set to `production` |
| byc-api | `FRONTEND_URL` | (Optional) Frontend origin for CORS |
| byc-frontend | `VITE_API_URL` | Backend API URL (auto-configured) |

## Features

- Calculate Current Yield and Yield to Maturity (YTM)
- Generate Cash Flow Schedule
- Determine Premium/Discount status
