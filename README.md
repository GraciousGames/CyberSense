# CyberSense

CyberSense is an interactive full-stack web application that raises awareness of phishing, social engineering, and email security. Using realistic training messages, users learn how to identify common attack patterns and assess emails correctly.

The project is being developed as part of the **Web Programming** module at **HAW Hamburg**.

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
| Grace Gehlisch | xxxxxxx |
| Clemens ... | xxxxxxx |
| Marcel ... | xxxxxxx |

## Project Goal

CyberSense teaches users how to handle suspicious emails safely. The training scenarios cover topics such as:

- manipulated sender addresses
- fake or mismatched links
- artificial time pressure
- social engineering
- fake invoices and unexpected payment requests
- parcel delivery scams

After each assessment, learners receive immediate feedback, an explanation, and specific clues pointing out suspicious characteristics.

## Current Features

### Implemented

- React frontend using Vite and React Router
- responsive user interface
- home page, navigation, and footer
- interactive phishing training
- loading training scenarios through a REST API
- classification as legitimate, suspicious, or phishing
- score and progress display
- immediate feedback and expandable clues
- Express backend with a health check
- SQLite database containing scenarios and related clues
- automatic database initialization and seeding
- API endpoints for retrieving all scenarios or a single scenario
- complete CRUD API for validated training scenarios
- user interfaces for login, registration, and administration
- administration interface for creating, viewing, editing, and deleting scenarios

### Partially Implemented

- Login and registration are currently frontend prototypes and are not connected to the backend.
- The administration area does not have access control yet.

### Planned

- user management and roles
- server-side registration and login
- password hashing and secure authentication
- storage of training progress and results
- personal and administrative statistics
- additional frontend and HTTP-level API tests
- application deployment

## Technologies

### Frontend

- React 19
- Vite
- React Router
- custom CSS; Bootstrap is installed as a dependency but has not been integrated yet
- Fetch API

### Backend

- Node.js
- Express 5
- CORS
- SQLite through the Node.js `node:sqlite` module

### Development

- Git and GitHub
- ESLint
- Nodemon

## Architecture

The frontend and backend are separated and communicate through a REST API.

```text
React pages and components
          |
          v
    Frontend service
          |
       REST/JSON
          |
          v
     Express routes
          |
          v
       Repository
          |
          v
         SQLite
```

The frontend is divided into reusable components, pages, services, and styles. In the backend, HTTP routes, database access, initialization, and seed data are organized separately. Further separation into controllers and services is planned as the application grows.

## Data Model

The SQLite database currently contains two tables:

- `scenarios`: content, sender information, classification, and explanation of a training message
- `clues`: clues associated with a scenario

A scenario can have multiple clues. `clues.scenario_id` references `scenarios.id` as a foreign key. When a scenario is deleted, its related clues are removed through `ON DELETE CASCADE` as well.

The database file is created at `backend/database/cybersense.sqlite` when the backend starts for the first time. If the scenarios table is empty, the example scenarios from `backend/src/data/scenarios.js` are inserted.

## Project Structure

```text
CyberSense/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── data/
│   │   ├── database/
│   │   ├── repositories/
│   │   ├── routes/
│   │   └── app.js
│   └── package.json
├── CONTRIBUTING.md
└── README.md
```

## Installation and Setup

### Requirements

- Git
- a recent Node.js version with support for `node:sqlite`
- npm

> Depending on the Node.js version, `node:sqlite` may still be marked as experimental.

### Clone the Repository

```bash
git clone https://github.com/GraciousGames/CyberSense.git
cd CyberSense
```

### Start the Backend

```bash
cd backend
npm install
npm run dev
```

The backend is then available at `http://localhost:3000`.

### Start the Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend is then available at `http://localhost:5173` by default.

Both the frontend and backend must be running for the training to work. The addresses `http://localhost:5173` and `http://localhost:3000` are currently configured directly in the source code.

## REST API

| Method | Endpoint | Description | Status |
|---|---|---|---|
| `GET` | `/api/health` | Retrieve the backend status | implemented |
| `GET` | `/api/scenarios` | Retrieve all training scenarios | implemented |
| `GET` | `/api/scenarios/:id` | Retrieve a single scenario | implemented |
| `POST` | `/api/scenarios` | Create a new scenario | implemented |
| `PUT` | `/api/scenarios/:id` | Replace an existing scenario | implemented |
| `DELETE` | `/api/scenarios/:id` | Delete a scenario and its clues | implemented |

### Example

```bash
curl http://localhost:3000/api/scenarios/1
```

Invalid IDs result in `400 Bad Request`, while scenarios that do not exist result in `404 Not Found`.

## Quality Assurance

The frontend provides the following scripts:

```bash
cd frontend
npm run lint
npm run build
```

The backend CRUD tests use a temporary SQLite database:

```bash
cd backend
npm test
```

## Security and Known Limitations

- Login and registration do not store user accounts yet.
- Passwords are currently neither transmitted nor stored or hashed.
- Administration pages are publicly accessible and are not protected by roles yet.
- CORS currently permits only the local frontend address.
- API and port settings cannot be configured through environment variables yet.
- Server-side validation, rate limiting, and centralized error handling still need to be added.
- There is no deployment configuration yet.

## Git Workflow

Development uses the following branches:

- `main`: stable project version
- `dev`: shared development version
- `feature/<feature-name>`: implementation of individual features

Further information about branches, commits, and pull requests is available in [CONTRIBUTING.md](CONTRIBUTING.md).

## Project Status

| Area | Status |
|---|---|
| React frontend | ✅ implemented |
| Navigation and responsive design | ✅ implemented |
| Interactive training | ✅ implemented |
| Express backend | ✅ implemented |
| Read-only REST API | ✅ implemented |
| SQLite database | ✅ implemented |
| Administration CRUD | ✅ implemented |
| Authentication | ⏳ planned |
| Training progress and statistics | ⏳ planned |
| Backend CRUD tests | ✅ implemented |
| Deployment | ⏳ planned |

## License

This project was developed exclusively for educational purposes as part of the **Web Programming** module at **HAW Hamburg**.
