# Contributing

Vielen Dank für deinen Beitrag zu CyberSense.

---

# Workflow

Es wird nach GitFlow gearbeitet.

## Branches

```
main
```

Produktive Version.

```
dev
```

Aktueller Entwicklungsstand.

```
feature/<feature-name>
```

Neue Funktionen.

Beispiele:

```
feature/login

feature/register

feature/training

feature/backend

feature/database
```

---

# Entwicklung

Vor jeder neuen Aufgabe:

```bash
git switch dev
git pull origin dev
git switch -c feature/meine-funktion
```

Nach Fertigstellung:

```bash
git add .
git commit -m "feat: kurze Beschreibung"
git push
```

Anschließend Pull Request nach

```
dev
```

---

# Commit-Konvention

Neue Funktion

```
feat:
```

Beispiel

```
feat: add login page
```

Bugfix

```
fix:
```

Beispiel

```
fix: correct navbar routing
```

Dokumentation

```
docs:
```

Beispiel

```
docs: update README
```

Styles

```
style:
```

Refactoring

```
refactor:
```

Tests

```
test:
```

---

# Coding Style

- Englisch für Code
- Deutsche Benutzeroberfläche
- camelCase für Variablen
- PascalCase für Komponenten
- Funktionen möglichst kurz halten
- Kommentare nur dort, wo sie Mehrwert bieten

---

# Pull Requests

Vor jedem Merge prüfen:

- Projekt startet
- Keine Konsolenfehler
- Keine ESLint-Fehler
- Responsives Layout funktioniert
- Commit-Nachrichten sinnvoll
