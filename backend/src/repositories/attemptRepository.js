// Zentrale SQLite-Datenbankverbindung.
import database from "../database/database.js";


// ---------------------------------------------------------
// Versuch speichern
// ---------------------------------------------------------

export function createAttempt({
                                  userId,
                                  scenarioId,
                                  selectedAnswer,
                                  isCorrect
                              }) {

    // Prepared Statement verhindert,
    // dass Werte direkt in den SQL-String eingesetzt werden.
    const insertAttempt = database.prepare(`
    INSERT INTO attempts (
      user_id,
      scenario_id,
      selected_answer,
      is_correct
    )
    VALUES (?, ?, ?, ?)
  `);


    // SQLite speichert Boolean-Werte hier als 1 oder 0.
    const result = insertAttempt.run(
        userId,
        scenarioId,
        selectedAnswer,
        isCorrect ? 1 : 0
    );


    // ID des neu gespeicherten Versuchs.
    const attemptId =
        Number(result.lastInsertRowid);


    // Den neu gespeicherten Datensatz direkt zurückgeben.
    return findAttemptById(attemptId);
}


// ---------------------------------------------------------
// Einzelnen Versuch laden
// ---------------------------------------------------------

export function findAttemptById(id) {

    const selectAttempt = database.prepare(`
    SELECT
      id,
      user_id,
      scenario_id,
      selected_answer,
      is_correct,
      created_at
    FROM attempts
    WHERE id = ?
  `);


    const row = selectAttempt.get(id);


    // Falls keine Zeile gefunden wurde.
    if (!row) {
        return null;
    }


    // Datenbanknamen werden in unsere JavaScript-
    // Namenskonvention umgewandelt.
    return {
        id: row.id,

        userId:
        row.user_id,

        scenarioId:
        row.scenario_id,

        selectedAnswer:
        row.selected_answer,

        // Aus SQLite 1/0 wird wieder true/false.
        isCorrect:
            row.is_correct === 1,

        createdAt:
        row.created_at
    };
}


// ---------------------------------------------------------
// Alle Versuche eines Benutzers laden
// ---------------------------------------------------------

export function findAttemptsByUserId(userId) {

    const selectAttempts = database.prepare(`
    SELECT
      id,
      user_id,
      scenario_id,
      selected_answer,
      is_correct,
      created_at
    FROM attempts
    WHERE user_id = ?
    ORDER BY created_at DESC, id DESC
  `);


    // Alle Datenbankzeilen laden.
    const rows = selectAttempts.all(userId);


    // Datenbankstruktur in Frontend-freundliche
    // JavaScript-Objekte umwandeln.
    return rows.map((row) => ({
        id: row.id,

        userId:
        row.user_id,

        scenarioId:
        row.scenario_id,

        selectedAnswer:
        row.selected_answer,

        isCorrect:
            row.is_correct === 1,

        createdAt:
        row.created_at
    }));
}