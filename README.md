# CyberSense

CyberSense ist eine interaktive Webanwendung zur Sensibilisierung für Phishing, Social Engineering und E-Mail-Sicherheit.

Das Projekt entsteht im Rahmen des Moduls **Web Programming** an der **HAW Hamburg**.

---

## Projektinformationen

|---|---|
| Hochschule | HAW Hamburg |
| Studiengang | Medieninformatik (B.Sc.) |
| Modul | Web Programming |
| Dozentin | Stephanie Held |
| Semester | Wintersemester 2026/2027 |

### Autoren

| Name | Matrikelnummer |
|------|----------------|
| Grace Gehlisch | xxxxxxx |
| Clemens ... | xxxxxxx |
| Marcel ... | xxxxxxx |

---

# Projektziel

CyberSense vermittelt den sicheren Umgang mit Phishing-E-Mails anhand realistischer Trainingsszenarien.

Benutzer lernen typische Angriffsmerkmale wie

- manipulierte Absenderadressen
- gefälschte Links
- Zeitdruck
- Social Engineering
- Fake-Rechnungen
- Paketbetrug

zu erkennen und richtig einzuordnen.

---

# Funktionen

## Bereits umgesetzt

- React Frontend
- Responsive Oberfläche
- Navigation
- Login
- Registrierung
- Interaktives Phishing-Training
- Sofortiges Feedback
- Hinweise zu jeder E-Mail
- Fortschrittsanzeige

## Geplant

- Express Backend
- REST API
- Benutzerverwaltung
- Login über Backend
- Passwort-Hashing
- SQLite Datenbank
- Speichern von Trainingsständen
- Statistiken
- Adminbereich
- Weitere Trainingsszenarien

---

# Technologien

## Frontend

- React
- Vite
- React Router
- Bootstrap
- CSS3

## Backend

- Node.js
- Express

## Datenbank

- SQLite (geplant)

## Versionsverwaltung

- Git
- GitHub

---

# Projektstruktur

```
CyberSense
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── data
│   │   ├── pages
│   │   ├── services
│   │   ├── styles
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── routes
│   │   ├── data
│   │   ├── database
│   │   └── app.js
│   └── package.json
│
└── README.md
```

---

# Installation

## Repository klonen

```bash
git clone https://github.com/GraciousGames/CyberSense.git
```

```
cd CyberSense
```

---

## Frontend installieren

```bash
cd frontend
npm install
```

Frontend starten

```bash
npm run dev
```

Die Anwendung ist anschließend erreichbar unter

```
http://localhost:5173
```

---

## Backend installieren

```bash
cd backend
npm install
```

Backend starten

```bash
npm run dev
```

Backend erreichbar unter

```
http://localhost:3000
```

---

# Git-Workflow

## Branches

```
main
```

Produktive Version

```
dev
```

Entwicklungsbranch

```
feature/...
```

Neue Funktionen

Beispiele

```
feature/login
feature/register
feature/training
feature/backend
feature/database
```

---

# Projektstatus

| Funktion | Status |
|----------|--------|
| React | ✅ |
| Navigation | ✅ |
| Login | ✅ |
| Registrierung | ✅ |
| Phishing-Training | ✅ |
| REST API | 🚧 |
| Backend | 🚧 |
| Datenbank | ⏳ |
| Authentifizierung | ⏳ |
| Statistik | ⏳ |

---

# Lizenz

Dieses Projekt wurde ausschließlich zu Lehrzwecken im Rahmen des Moduls **Web Programming** an der **HAW Hamburg** entwickelt.
