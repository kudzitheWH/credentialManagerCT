# Task 35 – Authentication API (Node, Express, JWT, MongoDB Atlas)

This backend is the API for Task 35.  
It handles user registration and login, issues JSON Web Tokens (JWT), and stores user and organisation data in MongoDB Atlas.

---

## 1. Technologies

- Node.js + Express
- MongoDB Atlas + Mongoose
- JSON Web Token (JWT)
- dotenv
- cors
- nodemon (for development)

---

## 2. Folder structure

```text
backend/
  src/
    config/
      db.js            # MongoDB connection + initial seed
    controllers/
      authController.js
    models/
      OrgUnit.js
      Division.js
      User.js
    routes/
      authRoutes.js
    app.js             # Express app setup
    server.js          # Server entry point
  package.json
  .env                 # NOT committed (local only)
  .env.example         # Example env configuration
  README.md

how to install:
cd backend
npm install
npm run dev

run the API endpoints

Register New user
POST /api/auth/register
Body(Json)
{
  "name": "Lebo Mokoena",
  "email": "lebo.mokoena@cooltech.internal",
  "password": "LeboPass123!",
  "orgUnitId": "ObjectId_of_org_unit",
  "divisionId": "ObjectId_of_division"
}

Response (201 Created)
{
  "msg": "Registration successful.",
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "name": "Lebo Mokoena",
    "role": "normal"
  }
}

POST /api/auth/login
Logs an existing user in and returns a JWT

Body(JSON)
{
  "email": "lebo.mokoena@cooltech.internal",
  "password": "LeboPass123!"
}

Response (200 OK)

{
  "msg": "Login successful.",
  "token": "jwt_token_here",
  "user": {
    "id": "...",
    "name": "Lebo Mokoena",
    "role": "normal"
  }
}

GET /api/auth/org-structure
Returns the organisation units and divisions that were seeded into the database

Response:
{
  "orgUnits": [
    {
      "_id": "...",
      "name": "Technology"
    },
    {
      "_id": "...",
      "name": "Operations"
    }
  ],
  "divisions": [
    {
      "_id": "...",
      "name": "Web Team",
      "orgUnit": "..."
    }
  ]
}

JWT Usage (for protected routes)
Any protected route (if added) expects the token in the Authorization header:

Authorization: Bearer <token_here>


In the code, the authentication middleware verifies the token and attaches the decoded user to req.user.

## Authentication, JWT and Protected Routes

This project uses **JWT** and **role-based access control** to protect the API.

### Environment variables

Create a `.env` file in the **backend** folder (do not commit this to GitHub):

```env
MONGO_URI=mongodb+srv://<db_username>:<password>@cluster0.8hyelge.mongodb.net/test
JWT_SECRET=some-long-random-secret-string
PORT=5000


