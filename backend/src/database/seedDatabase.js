import database from "./database.js";
import scenarios from "../data/scenarios.js";


/**
 * Fügt die vorbereiteten Trainingsszenarien in eine leere Datenbank ein.
 *
 * Der Seeder läuft beim Start des Backends.
 * Sind bereits Szenarien vorhanden, werden keine weiteren Seed-Daten
 * eingefügt. Dadurch entstehen bei einem Neustart keine Duplikate.
 */
export function seedDatabase() {

  // Prüft, ob bereits Trainingsszenarien gespeichert sind.
  const countStatement = database.prepare(`
    SELECT COUNT(*) AS amount
    FROM scenarios
  `);

  const countResult = countStatement.get();

  // Seed-Daten werden nur in eine leere Szenariotabelle eingefügt.
  if (countResult.amount > 0) {
    return;
  }


  // -------------------------------------------------------
  // Prepared Statements
  // -------------------------------------------------------

  // Fügt die Hauptdaten eines Szenarios ein.
  const insertScenario = database.prepare(`
    INSERT INTO scenarios (
      sender_name,
      sender_email,
      recipient,
      subject,
      sent_at,
      greeting,
      paragraphs,
      action_text,
      displayed_url,
      actual_url,
      signature,
      correct_answer,
      explanation
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);


  // Fügt einen Hinweis zu einem Szenario ein.
  const insertClue = database.prepare(`
    INSERT INTO clues (
      scenario_id,
      clue_key,
      title,
      description
    )
    VALUES (?, ?, ?, ?)
  `);


  // -------------------------------------------------------
  // Seed-Vorgang
  // -------------------------------------------------------

  // Szenario und Hinweise gehören logisch zusammen.
  // Deshalb wird der gesamte Seed-Vorgang in einer Transaktion ausgeführt.
  database.exec("BEGIN TRANSACTION");

  try {

    for (const scenario of scenarios) {

      // Zuerst wird das Szenario gespeichert.
      const insertResult = insertScenario.run(
          scenario.senderName,
          scenario.senderEmail,
          scenario.recipient,
          scenario.subject,
          scenario.date,
          scenario.greeting,
          JSON.stringify(scenario.paragraphs),
          scenario.actionText,
          scenario.displayedUrl,
          scenario.actualUrl,
          scenario.signature,
          scenario.correctAnswer,
          scenario.explanation
      );


      // Die neu erzeugte ID wird für die zugehörigen Hinweise benötigt.
      const scenarioId =
          Number(insertResult.lastInsertRowid);


      // Danach werden alle Hinweise des Szenarios gespeichert.
      for (const clue of scenario.clues) {

        insertClue.run(
            scenarioId,
            clue.id,
            clue.title,
            clue.description
        );
      }
    }


    // Alle Inserts waren erfolgreich.
    database.exec("COMMIT");

  } catch (error) {

    // Bei einem Fehler wird der gesamte Seed-Vorgang zurückgesetzt.
    database.exec("ROLLBACK");

    throw error;
  }
}