# MERN Bug Tracker Application – Testing & Debugging Project

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Folder Structure](#folder-structure)
4. [Installation](#installation)
5. [Running the Application](#running-the-application)
6. [Testing](#testing)

   * [Unit Testing](#unit-testing)
   * [Integration Testing](#integration-testing)
   * [End-to-End Testing](#end-to-end-testing)
7. [Debugging Techniques](#debugging-techniques)
8. [Error Handling](#error-handling)
9. [Dependencies](#dependencies)

---

## Project Overview

This project is a **MERN stack Bug Tracker application** designed for practicing **testing and debugging** in full-stack development. The application allows users to create, update, view, and delete bug reports.

It includes **unit tests**, **integration tests**, and **end-to-end tests**, along with debugging tools to ensure code reliability and maintainability.

---

## Features

* Users can **report new bugs** via a form.
* View a **list of all reported bugs**.
* **Update bug statuses** (open, in-progress, resolved).
* **Delete bugs**.
* Implements **error handling** on backend and frontend.

---

## Folder Structure

```
mern-testing/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # React components (Button, BugForm, BugList)
│   │   ├── tests/
│   │   │   ├── unit/        # Unit tests (Button.test.jsx)
│   │   │   └── integration/ # Integration tests
│   │   └── App.jsx          # Main React app
│   └── cypress/             # E2E tests
├── server/                  # Express backend
│   ├── src/
│   │   ├── controllers/     
│   │   ├── models/          # Mongoose models (User, Post)
│   │   ├── routes/          # API routes (postRoutes)
│   │   └── middleware/      # Custom middleware
│   └── tests/
│       ├── unit/            
│       └── integration/     # Integration tests (posts.test.js)
├── jest.config.js           # Jest configuration
└── package.json             # Project dependencies
```

---

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd mern-testing
```

2. Install **backend dependencies**:

```bash
cd server
npm install
```

3. Install **frontend dependencies**:

```bash
cd ../client
npm install
```

4. Ensure **MongoDB** is running locally or provide a connection URI.

---

## Running the Application

### Start Backend

```bash
cd server
npm run server
```

Server runs on **[http://localhost:5000](http://localhost:5000)**

### Start Frontend

```bash
cd client
npm start
```

Frontend runs on **[http://localhost:3000](http://localhost:3000)**

---

## Testing

### Unit Testing

* **Purpose:** Test individual functions or components in isolation.
* **Frontend Unit Tests:**

  * Example: `Button.test.jsx` (React Testing Library)
* **Backend Unit Tests:**

  * Test helper functions, validation logic, authentication utilities.

Run unit tests:

```bash
npm test
```

Watch mode:

```bash
npm run test:watch
```

---

### Integration Testing

* **Purpose:** Test how different modules work together.
* **Backend Integration Tests:**

  * Example: `posts.test.js` using **Supertest** and **MongoDB Memory Server**
  * Covers CRUD operations, authentication, and authorization.

Run integration tests:

```bash
cd server
npm test
```

---

### End-to-End Testing (E2E)

* **Purpose:** Test complete user flows from frontend to backend.
* **Tool:** Cypress
* **Example Test:** Creating a bug report through the UI.

Run Cypress:

bash
cd client
npm run cypress:open


## Debugging Techniques

1. **Console Logs:**

   * Track values and application flow in both frontend and backend.

2. **Chrome DevTools:**

   * Inspect React component state and UI interactions.

3. **Node.js Inspector:**

   * Debug server-side code using breakpoints:

   bash
   node --inspect server/src/server.js
   

4. **Error Boundaries (React):**

   * Catch runtime errors in components and display fallback UI.

## Error Handling

* **Backend:** Express middleware handles unexpected errors and validation failures.
* **Frontend:** React error boundaries capture component crashes.
* Example:

js
class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? <h1>Something went wrong.</h1> : this.props.children; }
}

## Dependencies

### Server

json
"dependencies": {
  "express": "^4.18.2",
  "mongoose": "^7.3.4",
  "cors": "^2.8.5",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^9.0.1"
},
"devDependencies": {
  "jest": "^30.2.0",
  "supertest": "^6.3.3",
  "mongodb-memory-server": "^8.14.1"
}


### Client

json
"dependencies": {
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.6",
  "axios": "^1.13.2",
  "prop-types": "^15.8.1",
  "classnames": "^2.5.1"
},
"devDependencies": {
  "jest": "^30.2.0",
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.9.1",
  "babel-jest": "^30.2.0",
  "cypress": "^15.6.0",
  "identity-obj-proxy": "^3.0.0"
}

## Environment Variables

Create `.env` in the **server** folder:

JWT_SECRET=your_jwt_secret_here
MONGO_URI=mongodb://localhost:27017/mern_blog_db
PORT=5000

Create `.env.test` in the **server** folder for Jest tests:

JWT_SECRET=testsecret123
MONGO_URI=mongodb://localhost:27017/mern_test_db


## Running the Application

### Backend

bash
cd server
npm run dev


* Runs Express server with **nodemon**.
* Default port: `5000`.

### Frontend

bash
cd client
npm start


* Runs React app on `http://localhost:3000`.


## Testing & Debugging

### Running Tests

bash
cd server
npm test


* Uses **Jest** and **Supertest**.
* Tests run against an **in-memory MongoDB** to prevent polluting your development database.
* Loads `.env.test` automatically for JWT secrets and test DB.


### Sample Test Output


PASS  server/tests/integration/posts.test.js
  POST /api/posts
    ✓ should create a new post when authenticated (15 ms)
    ✓ should return 401 if not authenticated (5 ms)
    ✓ should return 400 if validation fails (7 ms)
  GET /api/posts
    ✓ should return all posts (6 ms)
    ✓ should filter posts by category (5 ms)
    ✓ should paginate results (4 ms)
  GET /api/posts/:id
    ✓ should return a post by ID (5 ms)
    ✓ should return 404 for non-existent post (4 ms)
  PUT /api/posts/:id
    ✓ should update a post when authenticated as author (6 ms)
    ✓ should return 401 if not authenticated (4 ms)
    ✓ should return 403 if not the author (6 ms)
  DELETE /api/posts/:id
    ✓ should delete a post when authenticated as author (4 ms)
    ✓ should return 401 if not authenticated (3 ms)


> **Note:** If you see `secretOrPrivateKey must have a value`, ensure your `.env.test` file is correctly loaded in `setup.js` and `JWT_SECRET` is defined.


### Code Coverage

After running tests, coverage reports are generated in `coverage/server`:

| File                 | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s   |
| -------------------- | ------- | -------- | ------- | ------- | ------------------- |
| **All files**        | 64.81   | 38.46    | 71.42   | 66.66   |                     |
| **src**              | 100     | 100      | 100     | 100     |                     |
| └─ app.js            | 100     | 100      | 100     | 100     |                     |
| **src/controllers**  | 50.7    | 39.13    | 80      | 52.94   |                     |
| └─ postController.js | 50.7    | 39.13    | 80      | 52.94   | ...9,89-109,124-134 |
| **src/middleware**   | 81.25   | 33.33    | 50      | 81.25   |                     |
| └─ auth.js           | 91.66   | 100      | 100     | 91.66   | 18                  |
| └─ errorHandler.js   | 50      | 0        | 0       | 50      | 4-5                 |
| **src/models**       | 100     | 100      | 100     | 100     |                     |
| └─ Post.js           | 100     | 100      | 100     | 100     |                     |
| └─ User.js           | 100     | 100      | 100     | 100     |                     |
| **src/routes**       | 100     | 100      | 100     | 100     |                     |
| └─ posts.js          | 100     | 100      | 100     | 100     |                     |


## API Endpoints

### Posts

| Method | Endpoint         | Auth | Description               |
| ------ | ---------------- | ---- | ------------------------- |
| POST   | `/api/posts`     | ✅    | Create a new post         |
| GET    | `/api/posts`     | ❌    | Get all posts             |
| GET    | `/api/posts/:id` | ❌    | Get post by ID            |
| PUT    | `/api/posts/:id` | ✅    | Update post (author only) |
| DELETE | `/api/posts/:id` | ✅    | Delete post (author only) |

### Users

| Method | Endpoint              | Auth | Description         |
| ------ | --------------------- | ---- | ------------------- |
| POST   | `/api/users/register` | ❌    | Register a new user |
| POST   | `/api/users/login`    | ❌    | Login and get JWT   |


## License

This project is licensed under the MIT License.

## Author

Awino Edger Williams





