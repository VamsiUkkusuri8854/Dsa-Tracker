# 🚀 Render Deployment Guide: Smart DSA Tracker

This guide details how to host and deploy both the **Spring Boot Backend** and **React Frontend** of your Smart DSA Tracker on **Render** (along with a free cloud MySQL database) for 100% free!

---

## 🗄️ Step 1: Create a Free Cloud MySQL Database
Render does not offer a free MySQL hosting plan, but you can spin up a **100% free, high-performance MySQL instance** on **Aiven.io** or **Clever Cloud**:

### Using Aiven.io (Recommended):
1. Sign up for a free account at **[Aiven.io](https://aiven.io/)**.
2. Click **Create Service** and select **MySQL**.
3. Choose the **Free Plan** (available in AWS regions like Virginia, Oregon, or Ireland).
4. Name your service and click **Create Service**.
5. Once active, copy the following parameters from the connection details panel:
   * **Host / Service URI** (e.g. `mysql-xxxx.aivencloud.com`)
   * **Port** (usually `25925` or `3306`)
   * **User** (usually `avnadmin`)
   * **Password** (your secure generated password)
   * **Database Name** (usually `defaultdb`)

---

## ☕ Step 2: Deploy the Backend on Render
We will deploy the Spring Boot backend using the multi-stage **Dockerfile** we committed to your repository.

1. Sign in to your dashboard at **[Render.com](https://render.com/)**.
2. Click **New +** and select **Web Service**.
3. Select your GitHub repository: `VamsiUkkusuri8854/Dsa-Tracker`.
4. Configure the service settings:
   * **Name**: `dsa-tracker-backend`
   * **Root Directory**: `backend` *(Crucial: This tells Render to execute inside the backend folder!)*
   * **Runtime**: `Docker` *(Render will automatically detect the Dockerfile!)*
   * **Instance Type**: `Free`
5. Click **Advanced** to add the following **Environment Variables**:

| Key | Value | Description |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://YOUR_AIVEN_HOST:PORT/defaultdb?useSSL=true` | Replace with your Aiven MySQL Host, Port, and Database Name! |
| `SPRING_DATASOURCE_USERNAME` | `avnadmin` | Your cloud database username |
| `SPRING_DATASOURCE_PASSWORD` | `YOUR_AIVEN_PASSWORD` | Your cloud database password |
| `MYSQL_PASSWORD` | `YOUR_AIVEN_PASSWORD` | Fallback variable |

6. Click **Deploy Web Service**! Render will pull your repository, build the Docker image, and launch the server on a public URL (e.g. `https://dsa-tracker-backend.onrender.com`).

---

## 💻 Step 3: Deploy the Frontend on Render
We will deploy the React web application as a static site.

1. In your Render Dashboard, click **New +** and select **Static Site**.
2. Select the same GitHub repository: `VamsiUkkusuri8854/Dsa-Tracker`.
3. Configure the static site settings:
   * **Name**: `dsa-tracker`
   * **Root Directory**: `frontend` *(Crucial: This tells Render to compile within the frontend folder!)*
   * **Build Command**: `npm install; npm run build`
   * **Publish Directory**: `dist`
4. Click **Advanced** and add the following **Environment Variable**:

| Key | Value | Description |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | `https://dsa-tracker-backend.onrender.com` | Point this to your backend Render URL! |

5. Click **Deploy Static Site**! Render will bundle your assets and host them on a free production domain (e.g. `https://dsa-tracker.onrender.com`).

---

## 🎉 Verification
Once both deployments complete successfully, open your frontend Static Site URL!
1. Go to your frontend website.
2. Navigate to **Sign Up** to create an account.
3. Your pre-loaded 106 classic problems sheet and study notes will seed instantly into your cloud MySQL database!
4. Solves, streak metrics, and dashboard charts will update dynamically in real time in the cloud!
