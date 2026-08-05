import database from "./database.js";

export function initDatabase() {
  database.exec(`
    CREATE TABLE IF NOT EXISTS scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_name TEXT NOT NULL,
      sender_email TEXT NOT NULL,
      recipient TEXT NOT NULL,
      subject TEXT NOT NULL,
      sent_at TEXT NOT NULL,
      greeting TEXT NOT NULL,
      paragraphs TEXT NOT NULL,
      action_text TEXT,
      displayed_url TEXT,
      actual_url TEXT,
      signature TEXT NOT NULL,
      correct_answer TEXT NOT NULL
        CHECK (
          correct_answer IN (
            'legitim',
            'suspicious',
            'phishing'
          )
        ),
      explanation TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS clues (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scenario_id INTEGER NOT NULL,
      clue_key TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,

      FOREIGN KEY (scenario_id)
        REFERENCES scenarios(id)
        ON DELETE CASCADE
    );
  `);
}