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
| Grace Gehlisch | *****29 |
| Clemens Lampen | *****38 |
| Marcel Brauns | *****03 |

---

## Project Goal

Phishing emails often imitate legitimate companies and services and can be difficult to identify at first glance.

CyberSense provides a safe environment in which users can practice evaluating realistic messages without interacting with real emails or external services.

Training scenarios include indicators such as:

- manipulated or unusual sender addresses
- misleading or mismatched links
- artificial urgency and time pressure
- social engineering techniques
- fake account or security warnings
- unexpected payment requests
- parcel delivery scams
- impersonation of known companies and services

For every scenario, the user decides between:

- **Legitimate**
- **Phishing**

After submitting an answer, CyberSense explains the result and provides clues that help users understand which parts of the message are relevant to the classification.

---

## Features

### Interactive Phishing Training

CyberSense provides realistic email scenarios through an interactive training interface.

Users can:

- inspect the sender, subject, message content, and links
- classify messages as legitimate or phishing
- receive immediate feedback
- view explanations for the correct classification
- reveal relevant clues within the email
- continue through multiple training scenarios

---

### Authentication

CyberSense includes server-side user authentication.

Users can:

- create an account
- log in
- remain authenticated through a server-side session
- log out

Passwords are hashed before being stored in the database.

Authentication is also used to associate training attempts with individual users.

---

### Personal Statistics

Authenticated users can review their training results on a personal statistics page.

The statistics include information such as:

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

Administrative API endpoints are protected on the server and require an authenticated user with the `admin` role.

The administration dashboard also visualizes possible future extensions such as user management and aggregated administrative statistics. These functions are not part of the current implementation.

---

### Error Handling

The application includes handling for invalid routes and API errors.

Unknown frontend routes lead to a custom `404` page instead of an empty or broken application state.

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
- SQLite using the Node.js `node:sqlite` module
- password hashing for authentication

### Development and Quality Assurance

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
        Routes / Auth
              |
              v
         Repositories
              |
              v
            SQLite
```

The frontend is organized into reusable pages, components, services, configuration, and styles.

The backend separates HTTP routes, authentication middleware, database access, database initialization, repositories, and seed data.

The frontend communicates with the backend exclusively through the REST API.

---

## Data Model

CyberSense stores application data in SQLite.

The main entities are:

### `users`

Stores registered users and authentication-related information, including the user's role.

### `scenarios`

Stores the content and classification of training messages.

Each scenario contains information such as:

- sender
- recipient
- subject
- message content
- displayed and actual URLs
- correct classification
- explanation

The valid classifications are:

```text
legitim
phishing
```

### `clues`

Stores clues associated with individual scenarios.

A scenario can contain multiple clues. When a scenario is deleted, its associated clues are removed through the configured foreign-key relationship.

### `attempts`

Stores training attempts made by authenticated users.

An attempt connects:

- a user
- a scenario
- the selected answer
- the result of the answer
- the time of the attempt

This data is used to generate the personal statistics page.

---

## Database Initialization

The SQLite database is created automatically when the backend starts.

The development database is stored at:

```text
backend/database/cybersense.sqlite
```

The database file itself is not versioned in Git.

Database initialization creates the required tables automatically.

If no scenarios exist yet, the predefined training scenarios from:

```text
backend/src/data/scenarios.js
```

are inserted into the database.

A separate SQLite database is used when running automated tests.

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

Start the development server:

```bash
npm run dev
```

The backend is available locally at:

```text
http://localhost:3000
```

The database is initialized automatically when the backend starts.

---

### Frontend Setup

Open another terminal and install the frontend dependencies:

```bash
cd frontend
npm install
```

Start the frontend:

```bash
npm run dev
```

Vite normally provides the frontend at:

```text
http://localhost:5173
```

Both frontend and backend must be running when developing CyberSense locally.

---

## Configuration

The frontend API URL can be configured through the environment variable:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

An example configuration is provided in:

```text
frontend/.env.example
```

If no environment variable is configured during local development, the frontend uses the local backend URL as its fallback.

### Session Secret

The backend supports configuration of the session secret through:

```env
SESSION_SECRET=your-secret
```

For local development, a development fallback is available.

For a production environment, `SESSION_SECRET` should be explicitly configured instead of relying on the development fallback.

Environment files and secrets are excluded from version control.

---

## REST API

### Health

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Retrieve backend status |

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Log in |
| `POST` | `/api/auth/logout` | Log out |
| `GET` | `/api/auth/me` | Retrieve the current authenticated user |

### Scenarios

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/scenarios` | Retrieve all training scenarios |
| `GET` | `/api/scenarios/:id` | Retrieve a single scenario |
| `POST` | `/api/scenarios` | Create a scenario as an administrator |
| `PUT` | `/api/scenarios/:id` | Update a scenario as an administrator |
| `DELETE` | `/api/scenarios/:id` | Delete a scenario as an administrator |

Administrative scenario operations require an authenticated user with the `admin` role.

### Training Attempts

Training attempts are stored through the attempts API.

Authenticated users can submit training results and retrieve their own previous attempts. The frontend uses this data to calculate and display personal statistics.

---

## Testing and Quality Assurance

### Backend Tests

The backend contains automated API tests for:

- authentication
- scenario endpoints
- administrative access control
- validation
- training attempts
- persistence behavior

Run the test suite with:

```bash
cd backend
npm test
```

Tests use a separate SQLite test database so that the development database is not modified.

---

### Frontend

Check the frontend source code with:

```bash
cd frontend
npm run lint
```

Create a production build with:

```bash
npm run build
```

The generated `dist` directory is excluded from version control.

---

## Security Measures

CyberSense implements several security-related measures within the scope of the project:

- passwords are stored as hashes instead of plain text
- authentication uses server-side sessions
- administrative endpoints require authentication and the `admin` role
- protected operations are checked by the backend and not only by the frontend
- scenario input is validated by the backend
- scenario classifications are restricted to `legitim` and `phishing`
- environment files and secrets are excluded from Git
- SQLite database files are excluded from Git
- session and test cookie files are excluded from Git

CyberSense is an educational university project and should not be considered a production-ready authentication or security platform.

---

## Future Work

The current version focuses on the complete training workflow, authentication, personal statistics, and scenario administration.

Possible future extensions include:

- administration of registered users and roles
- aggregated statistics for administrators
- more detailed training analytics
- additional phishing scenarios
- scenario categories and difficulty levels
- improved management of multiple clues in the scenario editor
- additional automated frontend tests
- further accessibility improvements
- extended security hardening for a production environment

Some of these future extensions are already represented visually in the administration dashboard but are not implemented in the current version.

---

## Git Workflow

Development uses the following branch structure:

- `main` – stable project version
- `dev` – shared development version
- `feature/<feature-name>` – development of individual features

Additional information about the development workflow is available in [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Project Status

| Area | Status |
|---|---|
| React frontend | ✅ Implemented |
| Responsive user interface | ✅ Implemented |
| Interactive phishing training | ✅ Implemented |
| Express backend | ✅ Implemented |
| SQLite persistence | ✅ Implemented |
| Registration and login | ✅ Implemented |
| Session authentication | ✅ Implemented |
| Role-based administration | ✅ Implemented |
| Scenario CRUD | ✅ Implemented |
| Training result persistence | ✅ Implemented |
| Personal statistics | ✅ Implemented |
| Automated backend tests | ✅ Implemented |
| Custom error page | ✅ Implemented |
| User administration | 🔜 Future work |
| Administrative statistics | 🔜 Future work |

---

## Educational Context

CyberSense was developed exclusively for educational purposes as part of the **Web Programming** module in the B.Sc. Media Informatics program at **HAW Hamburg**.

The email scenarios are prepared training examples. CyberSense does not access or analyze a user's real email account.
