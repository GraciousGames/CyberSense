# CyberSense

CyberSense is an interactive full-stack web application for phishing awareness and email security training.

The application presents users with realistic email scenarios. For each email, the user decides whether it is **legitimate** or **phishing**. After submitting an answer, CyberSense immediately explains whether the decision was correct and highlights indicators that can help identify phishing attempts.

CyberSense was developed as part of the **Web Programming** module at **HAW Hamburg**.

---

## Project Information

| | |
|---|---|
| University | HAW Hamburg |
| Degree program | Media Informatics (B.Sc.) |
| Module | Web Programming |
| Lecturer | Stephanie Held |
| Semester | Winter semester 2026/2027 |

### Authors

| Name | Student ID |
|---|---|
| Grace Gehlisch | ****929 |
| Clemens Lampen | ****938 |
| Marcel Brauns | ****503 |

---

# What does CyberSense do?

CyberSense is designed as a learning environment for recognizing phishing emails.

A normal training flow looks like this:

1. The user registers an account.
2. The user logs in.
3. CyberSense loads a training scenario from the backend.
4. The user reads the simulated email.
5. The user chooses **Legitimate** or **Phishing**.
6. The answer is sent to the backend.
7. The backend checks whether the answer is correct.
8. CyberSense displays an explanation and relevant clues.
9. The attempt is stored in the database.
10. The user can later view the result on the statistics page.

The emails used by CyberSense are prepared training examples. The application does **not** access or analyze real email accounts.

---

# Main Features

## Interactive Phishing Training

The central feature of CyberSense is the phishing training.

Users can inspect:

- sender name
- sender email address
- recipient
- subject
- message text
- displayed links
- actual link targets
- signatures

The user then chooses one of two possible answers:

```text
legitim
phishing
```

These are the internal values used by the application.

There is deliberately no third "suspicious" category. The user must decide whether the message should ultimately be treated as legitimate or phishing.

After an answer has been submitted, CyberSense displays:

- whether the answer was correct
- an explanation
- relevant warning signs
- highlighted parts of the email

---

## User Accounts

CyberSense supports real user accounts.

Users can:

- register
- log in
- stay logged in while using the application
- reload the page without immediately losing their login
- log out

The backend stores the user accounts in SQLite.

Passwords are **not stored as readable plain text**.

Instead, passwords are transformed into password hashes before they are stored.

### What is password hashing?

A password hash is a one-way representation of a password.

For example, CyberSense does **not** store:

```text
MyPassword123
```

Instead, the database contains a hash that looks more like:

```text
$2b$10$...
```

When the user logs in, the entered password is compared with the stored hash.

This means that the original password does not have to be stored in the database.

CyberSense uses `bcrypt` for password hashing.

---

# Sessions

CyberSense uses **server-side sessions** for authentication.

A session allows the backend to remember which user is currently logged in.

A simplified login process looks like this:

```text
User enters email and password
            |
            v
Frontend sends login request
            |
            v
Backend verifies password
            |
            v
Backend creates a session
            |
            v
Browser receives a session cookie
```

The browser then sends this cookie with later requests.

This allows the backend to know:

```text
"This request belongs to user 5."
```

without requiring the frontend to send the user's password again.

The frontend uses:

```js
credentials: "include"
```

for requests that require the session cookie.

---

# What is `SESSION_SECRET`?

`express-session` uses a secret value to protect the session cookie.

CyberSense reads this value from:

```text
SESSION_SECRET
```

For example:

```env
SESSION_SECRET=my-long-random-secret
```

The secret is **not a user password**.

It is an internal server value used to sign session cookies so that they cannot simply be modified by the browser without detection.

For local development, CyberSense contains a development fallback.

For a real production environment, a separate secret should always be configured.

A secret should:

- be difficult to guess
- not be committed to Git
- not be hardcoded into public source code
- be different between environments

---

# Environment Variables and `.env`

Some configuration values depend on where an application is running.

For example:

```text
Local backend:
http://localhost:3000

University server:
another server address
```

Instead of changing the source code every time, applications commonly use **environment variables**.

An environment variable is a value provided to the application from outside the source code.

CyberSense uses environment configuration for values such as:

```text
SESSION_SECRET
VITE_API_BASE_URL
```

Files such as:

```text
.env
```

can contain these values locally.

Actual `.env` files are excluded from Git because they may contain secrets.

CyberSense therefore contains:

```text
frontend/.env.example
```

instead.

This file demonstrates which configuration values are available without containing real secrets.

For example:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

A developer can use this example to create their own local configuration.

---

# Frontend and Backend

CyberSense consists of two separate applications:

```text
Frontend
   +
Backend
```

## Frontend

The frontend is the part that runs in the browser.

It contains:

- pages
- buttons
- forms
- navigation
- email previews
- statistics
- admin interfaces

CyberSense uses React for the frontend.

## Backend

The backend runs on the server.

It is responsible for:

- user registration
- login
- sessions
- permissions
- scenario data
- database access
- storing attempts
- validating requests

CyberSense uses Node.js and Express for the backend.

The frontend cannot directly access the SQLite database.

Instead, communication happens through an API.

---

# What is an API?

API stands for:

**Application Programming Interface**

An API provides defined ways for one application to communicate with another application.

In CyberSense:

```text
React Frontend
      |
      | HTTP request
      v
Express API
      |
      v
SQLite Database
```

For example, when the training page needs scenarios, the frontend sends a request to:

```text
GET /api/scenarios
```

The backend retrieves the scenarios from SQLite and returns them as JSON.

---

# What is REST?

CyberSense uses a **REST API**.

REST is a common way of designing web APIs around resources such as:

```text
users
scenarios
attempts
```

HTTP methods describe what should happen to a resource.

The most important methods used by CyberSense are:

| Method | Meaning | Example |
|---|---|---|
| `GET` | Read data | Load scenarios |
| `POST` | Create or submit data | Register user |
| `PUT` | Update data | Edit scenario |
| `DELETE` | Delete data | Delete scenario |

A simple example:

```text
GET /api/scenarios
```

means:

> Give me all scenarios.

While:

```text
GET /api/scenarios/5
```

means:

> Give me scenario number 5.

And:

```text
DELETE /api/scenarios/5
```

means:

> Delete scenario number 5.

The frontend sends these requests using the browser's Fetch API.

---

# What is JSON?

Frontend and backend exchange most data as **JSON**.

JSON is a text format that represents structured data.

For example, a scenario returned by the API could look roughly like this:

```json
{
  "id": 1,
  "senderName": "Microsoft Security",
  "subject": "Unusual account activity",
  "correctAnswer": "phishing"
}
```

React can then use this information to display the scenario.

---

# REST API

## Health Check

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Checks whether the backend is running |

Example:

```bash
curl http://localhost:3000/api/health
```

---

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create a user account |
| `POST` | `/api/auth/login` | Log in |
| `GET` | `/api/auth/me` | Return the currently logged-in user |
| `POST` | `/api/auth/logout` | Log out |

`/api/auth/me` is useful when the page is refreshed.

The frontend asks the backend:

> Is there currently an authenticated session?

If a valid session exists, the backend returns the current user.

---

## Scenarios

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/scenarios` | Load all scenarios |
| `GET` | `/api/scenarios/:id` | Load one scenario |
| `POST` | `/api/scenarios` | Create a scenario |
| `PUT` | `/api/scenarios/:id` | Update a scenario |
| `DELETE` | `/api/scenarios/:id` | Delete a scenario |

Reading scenarios is available for the training application.

Creating, editing, and deleting scenarios requires an authenticated administrator.

---

## Attempts

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/attempts` | Save a training answer |
| `GET` | `/api/attempts/me` | Load attempts of the current user |

When an answer is submitted, the frontend sends information such as:

```json
{
  "scenarioId": 4,
  "selectedAnswer": "phishing"
}
```

The frontend does **not** send:

```text
isCorrect: true
```

Instead, the backend loads the correct answer from the database and calculates whether the answer was correct.

This prevents the browser from deciding its own result.

The frontend also does not send an arbitrary user ID.

The backend gets the user from the authenticated session.

---

# Administrator Role

Users can have different roles.

CyberSense currently uses roles such as:

```text
user
admin
```

Normal users can complete training scenarios.

Administrators can additionally manage scenarios.

The important part is that administrator permissions are checked by the backend.

This means that hiding an admin button in React is **not** considered sufficient security.

The backend checks the session and user role before allowing operations such as:

```text
POST /api/scenarios
PUT /api/scenarios/:id
DELETE /api/scenarios/:id
```

If a normal user tries to call one of these endpoints directly, the backend rejects the request.

---

# Database

CyberSense uses SQLite.

SQLite is a relational database stored in a local file.

Unlike larger database systems, SQLite does not require a separate database server.

The development database is created at:

```text
backend/database/cybersense.sqlite
```

The database file is generated automatically and is not stored in Git.

CyberSense contains four main tables.

---

## `users`

Contains user accounts.

Typical information includes:

```text
id
username
email
password hash
role
```

---

## `scenarios`

Contains the training emails.

A scenario includes information such as:

```text
sender
recipient
subject
message
links
correct answer
explanation
```

---

## `clues`

Contains hints associated with scenarios.

A clue can identify a suspicious area such as:

```text
sender
subject
paragraph
link
signature
```

One scenario can have several clues.

---

## `attempts`

Stores training attempts.

An attempt connects:

```text
User
  |
  v
Attempt
  |
  v
Scenario
```

It contains information about:

- which scenario was answered
- which answer was selected
- whether it was correct
- when the attempt happened

These attempts are used to generate the statistics page.

---

# Database Relationships

The simplified database model looks like this:

```text
users
  |
  | 1:n
  v
attempts
  ^
  | 1:n
  |
scenarios
  |
  | 1:n
  v
clues
```

`1:n` means:

> One record can be connected to many other records.

For example:

- one user can have many attempts
- one scenario can have many attempts
- one scenario can have many clues

---

# Prepared SQL Statements

Database queries use prepared statements.

Instead of building SQL like this:

```js
"SELECT * FROM users WHERE email = '" + email + "'"
```

CyberSense uses placeholders.

Conceptually:

```sql
SELECT * FROM users WHERE email = ?
```

The actual value is provided separately.

This keeps data values separate from the SQL command itself and is an important protection against SQL injection.

---

# Architecture

A simplified overview of CyberSense is:

```text
Browser
  |
  v
React Page
  |
  v
Frontend Service
  |
  | HTTP + JSON
  v
Express Route
  |
  v
Authentication / Validation
  |
  v
Repository
  |
  | SQL
  v
SQLite
```

Each layer has a separate responsibility.

### Pages and Components

Responsible for what the user sees.

### Frontend Services

Responsible for communication with the API.

Examples:

```text
authService.js
scenarioService.js
attemptService.js
```

### Express Routes

Define API endpoints.

### Middleware

Contains reusable request checks such as:

```text
Is the user logged in?
Is the user an administrator?
```

### Repositories

Contain database operations and SQL.

### SQLite

Stores persistent application data.

---

# Technologies

## Frontend

- React 19
- React Router
- Vite
- Fetch API
- CSS

## Backend

- Node.js
- Express 5
- express-session
- bcrypt
- CORS
- SQLite / `node:sqlite`

## Testing and Development

- Node.js Test Runner
- Supertest
- ESLint
- Nodemon
- Git
- GitHub

---

# Project Structure

```text
CyberSense/
├── backend/
│   ├── database/
│   ├── src/
│   │   ├── data/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── app.js
│   ├── test/
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── config/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
├── CONTRIBUTING.md
└── README.md
```

---

# Installation

## Requirements

You need:

- Git
- Node.js with support for `node:sqlite`
- npm

You do **not** have to install SQLite as a separate database server for the application itself.

---

## 1. Clone the Repository

```bash
git clone https://github.com/GraciousGames/CyberSense.git
cd CyberSense
```

---

## 2. Install Backend Dependencies

```bash
cd backend
npm install
```

`npm install` reads:

```text
package.json
package-lock.json
```

and downloads the required libraries into:

```text
node_modules/
```

`node_modules` is deliberately not stored in Git because it can always be recreated with `npm install`.

---

## 3. Start the Backend

```bash
npm run dev
```

The backend runs locally at:

```text
http://localhost:3000
```

The database is initialized automatically when the backend starts.

---

## 4. Install Frontend Dependencies

Open another terminal:

```bash
cd frontend
npm install
```

---

## 5. Start the Frontend

```bash
npm run dev
```

Vite normally starts the frontend at:

```text
http://localhost:5173
```

The browser communicates with the Express backend while the application is running.

---

# API Configuration

The frontend needs to know where the backend is located.

CyberSense stores this configuration centrally.

The variable is:

```text
VITE_API_BASE_URL
```

Example:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

The project contains:

```text
frontend/.env.example
```

as an example configuration.

During normal local development, CyberSense also uses:

```text
http://localhost:3000/api
```

as a fallback.

---

# Why is `.env` ignored by Git?

A `.env` file may contain environment-specific or secret values.

For example:

```env
SESSION_SECRET=some-secret-value
```

Such a value should normally not become part of the public Git history.

Therefore actual `.env` files are ignored.

The `.env.example` file is different.

It contains only examples and documentation and is therefore intentionally stored in Git.

---

# Testing

CyberSense contains automated backend API tests.

Run them using:

```bash
cd backend
npm test
```

The current test suite contains:

```text
35 tests
35 passed
0 failed
```

The tests cover areas including:

- registration
- duplicate registrations
- login
- invalid passwords
- logout
- sessions
- authentication
- administrator permissions
- scenario retrieval
- scenario creation
- scenario updates
- scenario deletion
- validation
- clues
- attempts
- correct answers
- incorrect answers
- separation of different users' attempts

Tests use a separate SQLite database.

This prevents automated tests from modifying the normal development database.

---

# Frontend Checks

To check the frontend code:

```bash
cd frontend
npm run lint
```

To create a production build:

```bash
npm run build
```

Vite generates the finished frontend in:

```text
frontend/dist/
```

The `dist` directory is generated output and is therefore excluded from Git.

---

# Files that are deliberately not committed

The `.gitignore` prevents generated or local files from being added to Git.

Examples include:

```text
node_modules/
frontend/dist/
*.sqlite
.env
cookies.txt
```

### Why?

`node_modules/`

Dependencies can be recreated using `npm install`.

`frontend/dist/`

Generated by `npm run build`.

`*.sqlite`

Contains the local database and potentially user data.

`.env`

Can contain secrets and environment-specific configuration.

`cookies.txt`

Can contain local session information.

The corresponding source code and configuration examples remain versioned.

---

# Security Decisions

CyberSense includes several basic security measures.

## Password Hashing

Passwords are hashed with bcrypt.

## Server-side Sessions

The backend controls authentication sessions.

## Backend Authorization

Administrator permissions are checked by Express middleware.

## Prepared SQL Statements

Database values are passed separately from SQL commands.

## Server-side Result Validation

The backend determines whether training answers are correct.

## User Identity from Session

The browser cannot simply submit another user's ID when saving an attempt.

## Input Validation

API requests are checked before database operations are performed.

## Restricted Answer Values

Scenario and attempt answers are restricted to:

```text
legitim
phishing
```

---

# Important Limitation

CyberSense is a university project.

It demonstrates important web programming and security concepts, but it should not automatically be treated as a production-ready authentication platform.

A public production system would normally require additional measures such as:

- HTTPS configuration
- secure production cookie settings
- rate limiting
- persistent production session storage
- monitoring and logging
- stronger operational secret management
- backups
- security maintenance

---

# Personal Statistics

Authenticated users have a statistics page based on their saved training attempts.

It displays information such as:

- number of attempts
- correct answers
- incorrect answers
- success rate
- completed scenarios
- recent activity

Statistics are calculated from persistent data rather than disappearing after the page is refreshed.

---

# Administration

Administrators can manage phishing scenarios.

Implemented functions include:

- list scenarios
- create scenarios
- edit scenarios
- delete scenarios

The administrator dashboard also contains areas for:

```text
User Management
Administrative Statistics
```

These are currently **future work** and are intentionally not implemented in the submitted project version.

---

# Future Work

Possible extensions include:

- user management
- role management through the admin interface
- aggregated administrator statistics
- more detailed analytics
- additional scenarios
- scenario categories
- difficulty levels
- improved editing of multiple clues
- automated frontend component tests
- accessibility improvements
- additional production security hardening

CyberSense could theoretically also be extended to analyze real emails, but this would significantly increase the security and privacy requirements and was deliberately excluded from the project scope.

---

# Git Workflow

The project uses Git and GitHub for version control.

The main branch structure is:

```text
main
dev
feature/<feature-name>
```

### `main`

Stable project version.

### `dev`

Shared development branch.

### `feature/...`

Branches used while implementing individual features.

More information is available in:

```text
CONTRIBUTING.md
```

---

# Project Status

| Area | Status |
|---|---|
| React frontend | ✅ Implemented |
| Responsive interface | ✅ Implemented |
| Phishing training | ✅ Implemented |
| Legitimate/phishing classification | ✅ Implemented |
| Explanation and clue highlighting | ✅ Implemented |
| Express backend | ✅ Implemented |
| REST API | ✅ Implemented |
| SQLite database | ✅ Implemented |
| Registration | ✅ Implemented |
| Login and logout | ✅ Implemented |
| Password hashing | ✅ Implemented |
| Session authentication | ✅ Implemented |
| Administrator role | ✅ Implemented |
| Scenario CRUD | ✅ Implemented |
| Training attempt persistence | ✅ Implemented |
| Personal statistics | ✅ Implemented |
| Backend API tests | ✅ Implemented |
| Custom 404 page | ✅ Implemented |
| Environment-based API configuration | ✅ Implemented |
| User management | 🔜 Future work |
| Administrative statistics | 🔜 Future work |

---

# Educational Context

CyberSense was developed exclusively for educational purposes as part of the **Web Programming** module in the B.Sc. Media Informatics program at **HAW Hamburg**.

The project demonstrates concepts including:

- React applications
- client/server communication
- REST APIs
- HTTP requests
- JSON
- Express
- relational databases
- SQL
- sessions
- password hashing
- authorization
- automated API tests
- Git-based development

All displayed emails are prepared training scenarios.

CyberSense does not access the user's real mailbox.# CyberSense

CyberSense is an interactive full-stack web application for phishing awareness and email security training.

Users are presented with realistic email scenarios and decide whether a message is **legitimate** or **phishing**. After each decision, CyberSense provides immediate feedback, explains the correct classification, and highlights relevant clues within the message.

The project was developed as part of the **Web Programming** module at **HAW Hamburg**.

---

## Project Information

| | |
|---|---|
| University | HAW Hamburg |
| Degree program | Media Informatics (B.Sc.) |
| Module | Web Programming |
| Lecturer | Stephanie Held |
| Semester | Winter semester 2026/2027 |

### Authors

| Name | Student ID |
|---|---|
| Grace Gehlisch | ****929 |
| Clemens Lampen | ****938 |
| Marcel Brauns | ****503 |

---

## Project Goal

Phishing attacks often imitate legitimate companies and services and rely on users making quick or uninformed decisions.

CyberSense provides a safe training environment in which users can practice evaluating realistic email messages without interacting with real emails or external services.

Training scenarios include indicators such as:

- manipulated or unusual sender addresses
- misleading or mismatched links
- artificial urgency and time pressure
- social engineering techniques
- fake account and security warnings
- unexpected payment requests
- parcel delivery scams
- impersonation of known companies and services

For every scenario, the user chooses between:

- **Legitimate**
- **Phishing**

After submitting an answer, CyberSense explains the result and provides clues that help users understand which parts of the message are relevant to the classification.

---

## Features

### Interactive Phishing Training

CyberSense provides realistic email scenarios through an interactive training interface.

Users can:

- inspect sender information, subject, content, and links
- classify messages as legitimate or phishing
- receive immediate feedback
- view an explanation for the correct classification
- reveal relevant clues within the message
- continue through multiple training scenarios

The application uses a binary classification model. The only valid training answers are:

```text
legitim
phishing
```

---

### Authentication

CyberSense includes server-side user authentication.

Users can:

- register an account
- log in
- remain authenticated through a server-side session
- restore their session after reloading the application
- log out

Passwords are stored as hashes instead of plain text.

Authentication is also used to associate training attempts with the currently logged-in user.

---

### Personal Statistics

Authenticated users can review their training activity on a personal statistics page.

The statistics include:

- total training attempts
- correct answers
- incorrect answers
- success rate
- completed scenarios
- recent training attempts

Training results are stored persistently in the SQLite database.

---

### Administration

CyberSense contains a protected administration area.

Administrators can:

- view existing scenarios
- create new scenarios
- edit existing scenarios
- delete scenarios

Administrative operations are also protected by the backend and require an authenticated user with the `admin` role.

The administration dashboard additionally displays possible future extensions for:

- user management
- administrative statistics

These two areas are visual previews and are not implemented in the current project version.

---

### Error Handling

Unknown frontend routes are handled by a custom `404` page instead of leading to a broken or empty application state.

API requests also provide feedback when loading or submitting data fails.

---

## Technologies

### Frontend

- React 19
- Vite
- React Router
- Fetch API
- custom CSS

### Backend

- Node.js
- Express 5
- express-session
- CORS
- SQLite using `node:sqlite`
- password hashing for authentication

### Development and Testing

- Git
- GitHub
- ESLint
- Nodemon
- Node.js Test Runner
- Supertest

---

## Architecture

CyberSense uses a separated frontend and backend architecture.

```text
        React Frontend
              |
              v
      Frontend Services
              |
          REST / JSON
              |
              v
       Express Backend
              |
     Routes / Middleware
              |
              v
         Repositories
              |
              v
            SQLite
```

The frontend is organized into pages, reusable components, services, configuration, and styles.

The backend separates HTTP routing, authentication and authorization middleware, database access, repositories, database initialization, and seed data.

The frontend does not access the database directly. All data exchange takes place through the REST API.

---

## Data Model

CyberSense stores its persistent application data in SQLite.

The database contains four central tables.

### `users`

Stores registered users and authentication-related information.

User records include information such as:

- username
- email
- password hash
- role

Roles are used to distinguish normal users from administrators.

---

### `scenarios`

Stores the content and classification of training messages.

Scenario data includes information such as:

- sender name
- sender email
- recipient
- subject
- message content
- displayed URL
- actual URL
- signature
- correct classification
- explanation

The valid values for the correct classification are restricted to:

```text
legitim
phishing
```

---

### `clues`

Stores clues associated with a training scenario.

A scenario can contain clues that refer to specific areas of a message, for example:

- sender
- subject
- greeting
- paragraphs
- links
- signature

Clues can be highlighted in the email preview after a user has submitted an answer.

---

### `attempts`

Stores training attempts made by authenticated users.

An attempt connects:

- a user
- a scenario
- the selected answer
- whether the answer was correct
- the time of the attempt

The stored attempts are used to generate the personal statistics page.

---

## Database Initialization

The SQLite database is created automatically when the backend starts.

The local development database is stored at:

```text
backend/database/cybersense.sqlite
```

The database file itself is excluded from Git.

Database initialization creates the required tables automatically.

If no scenarios exist yet, predefined training scenarios from:

```text
backend/src/data/scenarios.js
```

are inserted into the database.

Automated tests use a separate SQLite test database.

---

## Project Structure

```text
CyberSense/
├── backend/
│   ├── database/
│   ├── src/
│   │   ├── data/
│   │   ├── database/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── app.js
│   ├── test/
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── config/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── CONTRIBUTING.md
└── README.md
```

---

## Installation and Setup

### Requirements

The following software is required:

- Git
- Node.js with support for `node:sqlite`
- npm

---

### Clone the Repository

```bash
git clone https://github.com/GraciousGames/CyberSense.git
cd CyberSense
```

---

### Backend Setup

Install the backend dependencies:

```bash
cd backend
npm install
```

Start the backend:

```bash
npm run dev
```

The backend is available locally at:

```text
http://localhost:3000
```

The SQLite database is initialized automatically when the backend starts.

---

### Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Vite provides the frontend locally at:

```text
http://localhost:5173
```

Frontend and backend must both be running for the complete application to work locally.

---

## Configuration

### Frontend API URL

The frontend uses one central API configuration instead of hardcoded URLs in individual service files.

The backend API can be configured through:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

An example configuration is available in:

```text
frontend/.env.example
```

If no custom value is provided during local development, CyberSense uses:

```text
http://localhost:3000/api
```

as its fallback API URL.

---

### Session Secret

The backend supports configuration of the Express session secret through the environment variable:

```env
SESSION_SECRET=your-secret
```

A development fallback is available for local development.

For a production environment, `SESSION_SECRET` should be explicitly configured.

Environment files containing actual configuration values are excluded from Git.

---

## REST API

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Retrieve backend status |

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Authenticate a user |
| `GET` | `/api/auth/me` | Retrieve the current user |
| `POST` | `/api/auth/logout` | End the current session |

### Scenarios

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/scenarios` | Retrieve all training scenarios |
| `GET` | `/api/scenarios/:id` | Retrieve one scenario |
| `POST` | `/api/scenarios` | Create a scenario |
| `PUT` | `/api/scenarios/:id` | Update a scenario |
| `DELETE` | `/api/scenarios/:id` | Delete a scenario |

Creating, updating, and deleting scenarios requires an authenticated administrator.

### Training Attempts

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/attempts` | Store a training answer |
| `GET` | `/api/attempts/me` | Retrieve attempts of the current user |

When an attempt is submitted, the frontend sends the selected answer and scenario ID.

The backend determines whether the answer is correct and associates the attempt with the authenticated user from the session.

The frontend therefore does not decide whether its own result is correct and does not send an arbitrary user ID.

---

## Testing and Quality Assurance

### Backend Tests

The backend contains automated API tests covering:

- registration
- login and logout
- session persistence
- duplicate user validation
- authentication errors
- scenario retrieval
- administrator permissions
- scenario creation
- scenario updates
- scenario deletion
- input validation
- clue handling
- training attempts
- correct and incorrect answers
- separation of user-specific attempt data

Run the complete backend test suite with:

```bash
cd backend
npm test
```

The current test suite contains:

```text
35 tests
35 passed
0 failed
```

Test suites run sequentially because they use a shared SQLite test database.

---

### Frontend Checks

Run ESLint with:

```bash
cd frontend
npm run lint
```

Create a production build with:

```bash
npm run build
```

The generated:

```text
frontend/dist/
```

directory is excluded from version control.

---

## Security Considerations

Several security-related decisions were implemented within the scope of the university project:

- passwords are stored as hashes instead of plain text
- authentication uses server-side sessions
- administrative API operations require the `admin` role
- protected operations are checked by the backend and not only by the frontend
- scenario inputs are validated by the backend
- prepared SQL statements use placeholders for values
- scenario answers are restricted to `legitim` and `phishing`
- correctness of training attempts is determined by the backend
- the authenticated user is derived from the session
- environment files are excluded from Git
- SQLite database files are excluded from Git
- local cookie files are excluded from Git
- generated frontend build files are excluded from Git

CyberSense is an educational university project and should not be considered a production-ready authentication or security platform.

Additional hardening would be necessary for a publicly operated production system.

---

## Future Work

The current version focuses on the complete phishing-training workflow, authentication, personal statistics, and scenario administration.

Possible future extensions include:

- user and role management in the administration area
- aggregated statistics for administrators
- more detailed training analytics
- additional training scenarios
- scenario categories
- difficulty levels
- improved editing of multiple clues
- frontend component tests
- accessibility audits
- further production security hardening

The administration dashboard already contains visual placeholders for **User Management** and **Administrative Statistics**. These areas represent possible future extensions and are not functional in the submitted project version.

Connecting CyberSense to real email accounts or processing live emails was deliberately excluded from the project scope.

---

## Git Workflow

Development uses the following branch structure:

- `main` – stable project version
- `dev` – shared development version
- `feature/<feature-name>` – implementation of individual features

Additional information about branches, commits, and pull requests is available in [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Project Status

| Area | Status |
|---|---|
| React frontend | ✅ Implemented |
| Responsive interface | ✅ Implemented |
| Interactive phishing training | ✅ Implemented |
| Binary legitimate/phishing classification | ✅ Implemented |
| Express backend | ✅ Implemented |
| SQLite persistence | ✅ Implemented |
| Registration | ✅ Implemented |
| Login and logout | ✅ Implemented |
| Session authentication | ✅ Implemented |
| Role-based administration | ✅ Implemented |
| Scenario CRUD | ✅ Implemented |
| Training attempt persistence | ✅ Implemented |
| Personal statistics | ✅ Implemented |
| Automated backend tests | ✅ Implemented |
| Custom 404 page | ✅ Implemented |
| Configurable frontend API URL | ✅ Implemented |
| User administration | 🔜 Future work |
| Administrative statistics | 🔜 Future work |

---

## Educational Context

CyberSense was developed exclusively for educational purposes as part of the **Web Programming** module in the B.Sc. Media Informatics program at **HAW Hamburg**.

All email messages used in CyberSense are prepared training scenarios.

The application does not access, read, or analyze a user's real email account.

## Full Documentation

The complete project documentation is available here:

[CyberSense Project Documentation](https://github.com/GraciousGames/CyberSense/blob/main/CyberSense_Documentation_for_GitHub.pdf)
