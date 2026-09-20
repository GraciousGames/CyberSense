// Zentrale SQLite-Datenbankverbindung.
import database from "./database.js";


/**
 * Erstellt alle Tabellen, die CyberSense benötigt.
 *
 * CREATE TABLE IF NOT EXISTS sorgt dafür, dass eine bereits
 * vorhandene Datenbank beim Start nicht überschrieben wird.
 *
 * Beispieldaten werden separat durch seedDatabase.js eingefügt.
 */
export function initDatabase() {
  database.exec(`

    -- =====================================================
    -- TRAININGSSZENARIEN
    -- =====================================================

    CREATE TABLE IF NOT EXISTS scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      sender_name TEXT NOT NULL,
      sender_email TEXT NOT NULL,
      recipient TEXT NOT NULL,

      subject TEXT NOT NULL,
      sent_at TEXT NOT NULL,

      greeting TEXT NOT NULL,

      -- Mehrere Absätze werden als JSON-String gespeichert.
      paragraphs TEXT NOT NULL,

      action_text TEXT,
      displayed_url TEXT,
      actual_url TEXT,

      signature TEXT NOT NULL,

      -- Ein Szenario ist entweder legitim oder Phishing.
      correct_answer TEXT NOT NULL
        CHECK (
          correct_answer IN (
            'legitim',
            'phishing'
          )
        ),

      explanation TEXT NOT NULL
    );


    -- =====================================================
    -- HINWEISE ZU EINEM SZENARIO
    -- =====================================================

    CREATE TABLE IF NOT EXISTS clues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      scenario_id INTEGER NOT NULL,

      clue_key TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,

      -- Hinweise werden zusammen mit ihrem Szenario gelöscht.
      FOREIGN KEY (scenario_id)
        REFERENCES scenarios(id)
        ON DELETE CASCADE
    );


    -- =====================================================
    -- BENUTZERKONTEN
    -- =====================================================

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      username TEXT NOT NULL,

      -- Eine E-Mail-Adresse darf nur einmal registriert werden.
      email TEXT NOT NULL UNIQUE,

      -- Gespeichert wird ausschließlich der Passwort-Hash.
      password_hash TEXT NOT NULL,

      -- Neue Benutzer erhalten standardmäßig die Rolle "user".
      role TEXT NOT NULL DEFAULT 'user',

      created_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP
    );


    -- =====================================================
    -- TRAININGSVERSUCHE
    -- =====================================================

    CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      -- Benutzer, der die Aufgabe beantwortet hat.
      user_id INTEGER NOT NULL,

      -- Beantwortetes Szenario.
      scenario_id INTEGER NOT NULL,

      -- Benutzerentscheidung: legitim oder Phishing.
      selected_answer TEXT NOT NULL
        CHECK (
          selected_answer IN (
            'legitim',
            'phishing'
          )
        ),

      -- SQLite verwendet für Boolean-Werte 0 und 1.
      is_correct INTEGER NOT NULL
        CHECK (
          is_correct IN (0, 1)
        ),

      created_at TEXT NOT NULL
        DEFAULT CURRENT_TIMESTAMP,

      -- Trainingsversuche werden mit dem Benutzer gelöscht.
      FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

      -- Trainingsversuche werden mit dem Szenario gelöscht.
      FOREIGN KEY (scenario_id)
        REFERENCES scenarios(id)
        ON DELETE CASCADE
    );

  `);
}