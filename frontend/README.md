
---

## 2️⃣ Frontend README ( `frontend/README.md`)

```md
# Task 35 – React Authentication Frontend

This is the React frontend for Task 35.  
It talks to the authentication API, allows a user to register and log in, and keeps the JWT in `localStorage` so the session survives a page refresh.

---

## 1. Technologies

- React (Create React App)
- Fetch API
- Local Storage (for token + user)
- Basic CSS (App.css)

---

## 2. Folder structure

```text
frontend/
  src/
    api.js          # Helper for calling the backend
    App.js
    App.css
    LoginForm.js
    RegisterForm.js
    index.js
  package.json
  README.md


3. Backend dependency

The frontend expects the backend to be running at:

http://localhost:5000


In frontend/package.json there is a proxy entry:

"proxy": "http://localhost:5000"


This allows frontend code to call /api/... without hard-coding the full URL.

Make sure the backend is running before starting the React app:

cd backend
npm run dev

4. Install and run
cd frontend
npm install
npm start


Open the app in the browser:

http://localhost:3000

- How the app works
 - Tabs

The main App component shows two tabs:

Login

Register

The active tab is stored in React state.

- Registration flow

On mount, the app calls GET /api/auth/org-structure to load:

orgUnits

divisions

The Register form shows:

Name

Email

Password

Org Unit (dropdown)

Division (filtered by selected Org Unit)

When the form is submitted, RegisterForm sends a POST request to /api/auth/register using the helper in api.js.

On success:

The backend returns a JWT and user object.

App stores them:

in component state (token, user)

in localStorage (authToken, authUser)

After registration, the app switches to the logged-in state.

- Login flow

The Login form sends a POST request to /api/auth/login.

On success:

The returned JWT and user are again stored in state and in localStorage.

When the page is refreshed, App checks localStorage in a useEffect and restores the token and user if they exist.

- Logged-in view

When user and token are present:

A simple card is shown with:

- user name,

- user role,

- optional JWT preview (first characters only).

A Log out button clears:

- React state (user, token),

- localStorage keys.

   Files overview

  src/App.js

- Manages logged-in state, active tab, and localStorage synchronisation.

- Passes callback functions down to LoginForm and RegisterForm.

  src/LoginForm.js

- Controlled form for email + password.

- Calls parent handler when the login is successful.

  src/RegisterForm.js

- Controlled form for registration.

- Populates org unit and division dropdowns from props.

- Sends registration request and then calls parent handler.

  src/api.js

- Contains helper functions to call backend endpoints with fetch.

- Central place to change URLs if needed.