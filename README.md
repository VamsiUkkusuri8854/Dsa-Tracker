# ⚡ Smart DSA Tracker

An advanced, high-fidelity Pair-Programming Dashboard and educational tracker designed to manage, visualize, and accelerate your Data Structures & Algorithms (DSA) preparation. 

Built with a secure **Spring Boot 3 (Java 25)** backend, a relational **MySQL** database, and a highly interactive, responsive **React (Vite)** frontend.

---

## ✨ Primary Features

### 🚀 1. The 106+ Pre-Loaded Classic DSA Sheet
Every newly registered account automatically pre-loads a curated syllabus of **106 high-quality classic DSA problems** (spanning Arrays, Strings, Linked Lists, Trees, Graphs, DP, Binary Search, Heaps, and Tries). These are linked directly to top competitive online judges:
* **LeetCode**
* **GeeksforGeeks (GFG)**
* **Codeforces**
* **CodeChef**

### 📊 2. Zero-State Dynamic Dashboards & Analytics
* **Fresh Starts**: Although the 106 problems are pre-loaded in the roadmap table, they are configured with an `UNSOLVED` state. All statistics, heatmaps, recent activities, and difficulty charts initially start at a clean **0** count.
* **Real-time Tracking**: As you mark problems as solved, counts instantly increment, updating streaks, activity trends, and platform allocations dynamically!

### ⚡ 3. Frictionless "Mark as Solved" Shortcuts
Unsolved problems in your sheet feature a prominent **green checkmark** action button. Clicking it instantly pre-fills the logging workspace with **today's date, 30 min duration, and status set to SOLVED** for rapid, single-click updates!

### 📝 4. Inbuilt Markdown Study Workspace
Comes with **4 detailed, pre-loaded markdown guides** pinned to your Notes section for immediate study:
1. *Mastering Recursion & Call Stacks* (with recursive Java stack templates).
2. *Graph Traversals: DFS vs BFS* (with direct syntax and comparison grids).
3. *Dynamic Programming: Tabulation* (with bottom-up coin change solutions).
4. *Sliding Window Templates* (with variable sliding window JavaScript layouts).

### 🔒 5. Secure Session Authentication
A strict register-to-login manual authorization flow. New users are securely redirected to the Sign In page upon registration, preventing unauthenticated sessions.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React (Vite), TailwindCSS, Chart.js, React-Icons, Axios, React Hot Toast |
| **Backend** | Spring Boot 3.3.5, Spring Security, JWT (JSON Web Tokens), Spring Data JPA, Lombok |
| **Database** | MySQL (Relational storage with native custom index JPQL counting) |
| **JDK Version** | OpenJDK 25 (Java 17+ compatible) |

---

## 🚀 Getting Started

### Prerequisites
* **Java SDK 17+** (Recommended JDK 25)
* **Node.js** (v18+)
* **MySQL Server** (running locally on port 3306)

---

### 1. Database Setup
Create the MySQL database scheme:
```sql
CREATE DATABASE dsa_tracker;
```
*(Optional) If you want to alter table columns manually:*
```sql
ALTER TABLE problems MODIFY COLUMN status VARCHAR(255) NOT NULL DEFAULT 'UNSOLVED';
```

---

### 2. Backend Installation & Setup
Navigate to the backend directory and configure your environment variables (or update `src/main/resources/application.yml` directly):

```bash
cd backend
```

#### Compile and package a production FAT Jar:
```bash
# Set your environment variables
$env:MYSQL_PASSWORD="your-mysql-password"

# Package using Maven
mvn clean package -DskipTests
```

#### Run the compiled Backend Server:
```bash
java -jar target/dsa-tracker-backend-1.0.0.jar
```
The server will boot and run on **[http://localhost:8080](http://localhost:8080)**.

---

### 3. Frontend Installation & Setup
Navigate to the frontend directory:

```bash
cd ../frontend
npm install
```

#### Start the local Vite Development Server:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser!

---

## 📦 Production Deployment Guide

### Frontend Bundle Packaging
To compile optimized production assets:
```bash
cd frontend
npm run build
```
This outputs a super fast `dist/` directory containing minified CSS/JS and `index.html`, ready to be dropped into static hosts like Vercel, Netlify, AWS S3, or Nginx.

### Backend Execution
Deploy the repackaged `dsa-tracker-backend-1.0.0.jar` on any server running a JRE (Java Runtime Environment) with direct connection to your production MySQL instance.

---

## 🧑‍💻 Author & Contributions
Maintained and updated by Vamsi Ukkusuri. Connect to the repository:
🔗 **Repository URL**: [https://github.com/VamsiUkkusuri8854/Dsa-Tracker.git](https://github.com/VamsiUkkusuri8854/Dsa-Tracker.git)
