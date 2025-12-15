# Cool Tech Credential Manager – HyperionDev Task 35 (Capstone: Authentication)


It is a full-stack app that demonstrates:

- User **registration & login** with **JWT authentication**
- **Role-based access control** via `normal` and `admin` roles
- **Division / organisational unit–based** access to credentials
- A React frontend with:
  - **"My Credentials"** area for normal users
  - **"Admin – Manage Users"** area for admin users
- A clean backend structure using **Express**, **Mongoose**, and **middleware**.

---

## Tech Stack

**Backend**

- Node.js
- Express
- MongoDB Atlas (via Mongoose)
- JWT (jsonwebtoken)
- bcryptjs
- dotenv
- CORS

**Frontend**

- React (Create React App)
- React Router (`react-router-dom`)

---

## Project Structure (High-Level)

//text
project-root/
│
├─ src/                # Backend source code
│  ├─ app.js           # Express app configuration (routes + middleware)
│  ├─ server.js        # Backend entrypoint (connects DB and starts server)
│  ├─ config/
│  │   └─ db.js        # MongoDB connection helper
│  ├─ controllers/
│  │   ├─ auth.controller.js?      # (logic for auth – if used)
│  │   ├─ credential.controller.js # credentials: get/create/update
│  │   └─ admin.controller.js      # admin: assign/remove divisions, etc.
│  ├─ middleware/
│  │   └─ auth.js      # authRequired + requireRole middleware
│  ├─ models/
│  │   ├─ User.js
│  │   ├─ Division.js
│  │   ├─ OrgUnit.js
│  │   └─ Credential.js
│  ├─ routes/
│  │   ├─ authRoutes.js
│  │   ├─ credential.routes.js
│  │   └─ admin.routes.js
│  └─ seed/
│      └─ seedData.js  # optional: inserts initial admin + divisions/units
│
├─ frontend/
│  ├─ src/
│  │   ├─ App.js
│  │   ├─ api.js
│  │   ├─ routes/
│  │   │   └─ ProtectedRoute.js
│  │   ├─ pages/
│  │   │   ├─ LoginPage.js
│  │   │   └─ DashboardPage.js
│  │   └─ components/
│  │       ├─ CredentialsManager.js
│  │       ├─ CredentialsPanel.js
│  │       └─ AdminUsersPanel.js
│  └─ ...
│
├─ package.json         # Backend dependencies
└─ README.md            # (this file)
