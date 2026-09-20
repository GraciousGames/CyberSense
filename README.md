# CyberSense

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
| Grace Gehlisch | 2761929 |
| Clemens Lampen | 2574938 |
| Marcel Brauns | 2714503 |

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
