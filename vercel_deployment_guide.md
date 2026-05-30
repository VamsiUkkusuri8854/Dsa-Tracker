# 🚀 Vercel Production Deployment Guide: React Frontend

Deploying your React frontend (Vite) on **Vercel** is extremely simple, high-performance, and offers free automatic CI/CD. 

Since your project is a **monorepo** containing separate `backend/` and `frontend/` directories, this guide shows the precise steps required to map the directory and configure the environment variables correctly.

---

## 🔒 Step 1: Adjust Backend CORS (Crucial!)
Because the frontend is hosted on a different domain than the backend, your Spring Boot backend on Render must authorize requests from Vercel.

1. Go to your **Render Dashboard** and open your **`dsa-tracker-backend`** Web Service.
2. Navigate to **Settings** -> **Environment Variables**.
3. Locate or add the **`CORS_ORIGINS`** environment variable.
4. Set the value to authorize your local dev server and your future Vercel domain:
   ```env
   CORS_ORIGINS=http://localhost:5173,https://your-vercel-project-name.vercel.app
   ```
   *(Replace `your-vercel-project-name.vercel.app` with the actual domain Vercel assigns to your app in the next steps!)*
5. Save changes. Render will automatically redeploy the backend with the new security policy.

---

## 📦 Step 2: Push Your Code to GitHub
Ensure all your local changes are committed and pushed to your GitHub repository:

```bash
git add .
git commit -m "feat: configure analytics zero-state & clean headers"
git push origin main
```

---

## ⚡ Step 3: Deploy Frontend on Vercel

1. Go to the **[Vercel Dashboard](https://vercel.com/)** and sign in using your GitHub account.
2. Click **Add New...** and select **Project**.
3. Find your **`Dsa-Tracker`** repository and click **Import**.
4. Configure the project settings:
   * **Project Name:** `smart-dsa-tracker` (or your preferred name)
   * **Framework Preset:** Select **Vite**
   * **Root Directory:** Click **Edit** next to Root Directory, select the **`frontend`** directory, and click **Continue**. 
     > [!IMPORTANT]
     > Do **NOT** skip this step! Since your project is a monorepo, Vercel must know to run the build command inside the `frontend/` folder.

5. Expand the **Build and Development Settings** section and verify:
   * **Build Command:** `npm run build`
   * **Output Directory:** `dist`

6. Expand the **Environment Variables** section and add the target backend API endpoint:
   
   | Key | Value | Description |
   | :--- | :--- | :--- |
   | `VITE_API_BASE_URL` | `https://dsa-tracker-backend.onrender.com` | Point this to your backend Render URL (without a trailing `/`) |

7. Click **Deploy**! 

Vercel will install dependencies, build the production bundles using Vite, and provision a globally optimized free CDN URL (e.g. `https://smart-dsa-tracker.vercel.app`).

---

## 🎉 Verification & Testing
Once deployed:
1. Open the provided Vercel URL.
2. Navigate to the **Sign Up** tab and register a fresh account.
3. Verify that your dashboard opens cleanly, showing a secure `0` count progress, and successfully dynamic statistics that update in real time as you complete problems!
